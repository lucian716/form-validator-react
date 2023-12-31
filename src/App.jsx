import { useImmer } from "use-immer";
import * as EmailValidator from "email-validator";
import { passwordStrength } from "check-password-strength";
import "./app.scss";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  showPassword: "",
  showInvalidPassword: "",
  isPasswordShort: "",
  passwordMatch: "",
  passwordStrength: {
    color: "",
    value: "",
  },
};
let validate = false;
function App() {
  const [state, setState] = useImmer(initialState);

  const validate =
    state.email &&
    !state.showInvalidEmail &&
    state.password.length > 8 &&
    [("Strong", "Medium")].includes(state.passwordStrength.value) &&
    state.password === state.confirmPassword;

  return (
    <div id="app">
      <form id="my-form" class="shadow">
        <h4>Form Validator</h4>

        <div className="mb-4">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            data-rules="required|digits:5|min:5"
            placeholder="Please put email"
            value={state?.email || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.email = event.target.value;
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.showInvalidEmail = !EmailValidator.validate(state?.email);
              });
            }}
          />

          {state.showInvalidEmail && (
            <p className="validator-err">
              Email is not valid, please put correct email
            </p>
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
            data-rules="required|string|min:5"
            value={state.password || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.password = event.target.value;
                if (state.showPassword) {
                  draft.confirmPassword = event.target.value;
                }
                if (event.target.value.length > 8) {
                  const passwordStrengthValue = passwordStrength(
                    event.target.value
                  ).value;
                  console.log(passwordStrengthValue);
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch (passwordStrengthValue) {
                    case "Too weak":
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
          {state.isPasswordShort && (
            <p className="validator-err">
              Password must be more than 8 characters
            </p>
          )}
          {state.password && (
            <button
              style={{
                position: "absolute",
                top: 25,
                right: 10,
                width: 50,
                padding: "opx !important",
                margin: 0,
                fontSize: 2,
                border: "none !important",
              }}
              type="button"
              onClick={() => {
                setState((draft) => {
                  draft.showPassword = !draft.showPassword;
                  if (!state.showPassword) {
                    draft.confirmPassword = state.password;
                    draft.passwordMatch = true;
                  } else {
                    draft.passwordMatch = false;
                    draft.confirmPassword = "";
                  }
                });
              }}
            >
              eye
            </button>
          )}
        </div>
        {!state.showPassword && (
          <div className="mb-4">
            <label>Password Confirm</label>
            <input
              className="form-control"
              type="password"
              data-rules="required|string|min:5"
              value={state.confirmPassword || ""}
              onChange={(event) => {
                setState((draft) => {
                  draft.confirmPassword = event.target.value;
                  draft.passwordMatch = event.target.value === state.password;
                });
              }}
            />
          </div>
        )}
        {!state.passwordMatch && state.confirmPassword && (
          <p className="validator-err">Confirm password, didn't match</p>
        )}
        {state.passwordStrength.value && (
          <div
            className="mb-4"
            style={{
              position: "relative",
              color: state.passwordStrength.color,
            }}
          >
            {state.passwordStrength.value}
          </div>
        )}

        <ul className="information">
          <li>password must be at least 8 charactes</li>
          <li>password must have at least 1 number</li>
          <li>password must have at least 1 capital letter</li>
          <li>password must have at least 1 symbol</li>
        </ul>
        <button
          disabled={validate}
          style={{
            backgroundColor: validate ? "" : "gray",
          }}
          onClick={() => {
            alert("Congrats, your form is validated!");
            setState(initialState);
          }}
          type="button"
        >
          Create email
        </button>
      </form>
    </div>
  );
}

export default App;