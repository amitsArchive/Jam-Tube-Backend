import { useState } from "react";
import { useForm } from "react-hook-form";

function Landingpage({ onCreateSubmit, onJoinSubmit }) {
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: createErrors },
  } = useForm();

  const {
    register: registerJoin,
    handleSubmit: handleSubmitJoin,
    formState: { errors: joinErrors },
  } = useForm();

  const onCreateValid = (data) => {
    onCreateSubmit(data.createUsername);
  };

  const onJoinValid = (data) => {
    onJoinSubmit(data.joinUsername, data.joinCode);
  };

  const [isCreateSession, setIsCreateSession] = useState(true);

  return (
    <div className="landing">
      <div className="landing__card panel">
        <div className="landing__brand">
          <h1 className="landing__title">Jam</h1>
          <p className="landing__subtitle">
            Listen to music together in real time
          </p>
        </div>

        <div className="landing__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isCreateSession}
            className={`landing__tab ${isCreateSession ? "landing__tab--active" : ""}`}
            onClick={() => setIsCreateSession(true)}
          >
            Create
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isCreateSession}
            className={`landing__tab ${!isCreateSession ? "landing__tab--active" : ""}`}
            onClick={() => setIsCreateSession(false)}
          >
            Join
          </button>
        </div>

        {isCreateSession ? (
          <form
            className="landing__form"
            onSubmit={handleSubmitCreate(onCreateValid)}
          >
            <h2 className="landing__form-title">New session</h2>
            <div>
              <label className="label" htmlFor="createUsername">
                Username
              </label>
              <input
                id="createUsername"
                type="text"
                className="input"
                placeholder="Your name"
                autoComplete="username"
                {...registerCreate("createUsername", {
                  required: "Username is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 20, message: "Max 20 characters" },
                })}
              />
              {createErrors.createUsername && (
                <span className="error-text">
                  {createErrors.createUsername.message}
                </span>
              )}
            </div>
            <button type="submit" className="btn btn--primary">
              Start session
            </button>
          </form>
        ) : (
          <form
            className="landing__form"
            onSubmit={handleSubmitJoin(onJoinValid)}
          >
            <h2 className="landing__form-title">Join session</h2>
            <div>
              <label className="label" htmlFor="joinUsername">
                Username
              </label>
              <input
                id="joinUsername"
                type="text"
                className="input"
                placeholder="Your name"
                autoComplete="username"
                {...registerJoin("joinUsername", {
                  required: "Username is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 20, message: "Max 20 characters" },
                })}
              />
              {joinErrors.joinUsername && (
                <span className="error-text">
                  {joinErrors.joinUsername.message}
                </span>
              )}
            </div>
            <div>
              <label className="label" htmlFor="joinCode">
                Room code
              </label>
              <input
                id="joinCode"
                type="text"
                className="input"
                placeholder="6-character code"
                autoComplete="off"
                {...registerJoin("joinCode", {
                  required: "Room code is required",
                  minLength: { value: 6, message: "Invalid code" },
                })}
              />
              {joinErrors.joinCode && (
                <span className="error-text">{joinErrors.joinCode.message}</span>
              )}
            </div>
            <button type="submit" className="btn btn--primary">
              Join
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Landingpage;
