import "./app.scss";
import { useImmer } from "use-immer";
import * as EmailValidator from "email-validator";
import { passwordStrength } from "check-password-strength";

function App() {
  const [state, setState] = useImmer({
    email: "",
    password: "",
    confirmationPassword: "",
    showPassword: false,
    showInvalidEmail: false,
    isPasswordShort: false,
    passwordStrength: {
      color: '',
      value: '',
    }
  });

  const validate = (
    state.email 
    && !state.showInvalidEmail
    && state.password.length > 8
    && ['Medium', 'Strong' ].includes(state.passwordStrength.value)
    && state.password === state.confirmationPassword
);
  return (
    <div id="app">
      <form id="my-form" className="shadow">
        <h4>Form Validator</h4>

        <div className="mb-4">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            data-rules="required|digits:5|min:5"
            placeHolder="Please enter your email"
            value={state?.user || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.user = event.target.value;
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.showInvalidEmail = !EmailValidator.validate(state?.email);
              });
            }}
          />
          {state.showInvalidEmail && (
            <p className="validator-err">Please use valid Email Address</p>
          )}
        </div>
        <div
          className="mb-4"
          style={{
            position: "relative",
          }}
        >
          <label>Password</label>
          <input
            className="form-control"
            type={state.showPassword ? "text" : "password"}
            // type="password"
            data-rules="required|string|min:5"
            value={state.password || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.password = event.target.value;
                if (state.showPassword) {
                  draft.confirmationPassword = event.target.value;
                }
                if (event.target.value.length > 8) {
                  const passwordStrengthValue =
                    passwordStrength(event.target.value).value
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch (passwordStrengthValue) {
                    case "Too Weak":
                      draft.passwordStrength.color = "red";
                      break;
                    case "Weak":
                      draft.passwordStrength.color = "orange";
                      break;
                    case "Medium":
                      draft.passwordStrength.color = "blue";
                      break;
                    default:
                      draft.passwordStrength.color = "green";
                  }

                  draft.isPasswordShort = false;
                } else {
                  draft.passwordStrength.value = "";
                  draft.passwordStrength.color = "";
                }
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.isPasswordShort = state.password.length < 8;
              });
            }}
          />
          {
            state.isPasswordShort && 
            <p className="validator-err">
              Password requires more than 8 characters
            </p>
          }
          {
            state.password && 
            <button
              style={{
                position: "absolute",
                top: 25,
                right: 10,
                width: 50,
                padding: "0px !important",
                margin: 0,
                fontSize: 2,
                border: "none !important",
              }}
              type="button"
              onClick={() => {
                setState((draft) => {
                  draft.showPassword = !state.showPassword;
                  if (state.showPassword) {
                    draft.confirmationPassword = state.password
                  } else {
                    draft.confirmationPassword = ""
                  }
                });
              }}
            >
              eye
            </button>
          }
        </div>
        {
          // !state.showPassword
          && <div className="mb-4">
            <label>Password Confirmation</label>
            <input
              className="form-control"
              type="password"
              data-rules="required|string|min:5"
              value={state.confirmationPassword || ""}
              onChange={(event) => {
                setState((draft) => {
                  draft.confirmationPassword = event.target.value;
                });
              }}
            />
          </div>
        }
        {
          state.passwordStrength.value
          && <div
            className="mb-4"
            style={{
              position: "relative",
              color: state.passwordStrength.color
            }}
            >
              {state.passwordStrength.value}
          </div>
        }
        <button
          disabled={
           validate
          }
          style={{
            backgroundColor: validate ? " " : "gray",
          }}
        >
          Create Email
        </button>
      </form>
    </div>
  );
}

export default App;
