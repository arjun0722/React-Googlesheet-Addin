import { func } from 'prop-types';
import React, { useState } from 'react';

import { ADD_ONS_APIS } from '../Config/api';
import { TOKEN_KEY } from '../Config/constant';
import { httpPost } from '../Utils/http';

function Login({ setLoginAccessToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errorMessage, setError] = useState('');

  const onLogin = async () => {
    setError('');

    if (
      email === undefined ||
      password === undefined ||
      email?.length === 0 ||
      password?.length === 0
    ) {
      setError('Please enter in both and email and password.');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      params.append('remember_me', rememberMe);

      const response = await httpPost(ADD_ONS_APIS.LOGIN_API, params);

      if (response?.response?.status === 422) {
        setError(
          response?.response?.message ?? 'Login failed. Please try again later.'
        );

        return;
      }

      localStorage.setItem(TOKEN_KEY, response.access_token);
      document.getElementById('close-login-modal').click();
      setLoginAccessToken(response?.access_token);
    } catch (error) {
      setError('Login failed. Please try again later.');
      setLoginAccessToken(null);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title" id="exampleModalLabel">
              Analyst Intelligence Login
            </h6>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <>
              <div>
                <p id="info-heading">
                  Please enter in your email and password to login.
                </p>
              </div>

              {errorMessage && (
                <span style={{ color: 'red' }}> {errorMessage} </span>
              )}

              <div id="main-form">
                <div className="form-group">
                  <label className="input-label">Email / User Name</label>
                  <input
                    type="text"
                    onChange={({ target }) => setEmail(target.value)}
                    className="form-control"
                    value={email}
                    id="usr"
                  />
                </div>
                <div className="form-group postion-relative">
                  <label className="input-label">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={({ target }) => setPassword(target.value)}
                    className="form-control"
                    value={password}
                    id="pwd"
                  />

                  {showPassword ? (
                    <i
                      className="bi bi-eye-slash password-show-hide"
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-eye password-show-hide"
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  )}
                </div>
                <div className="form-check input-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="check1"
                    name="option1"
                    value="something"
                    onClick={() => {
                      setRememberMe((pre) => !pre);
                    }}
                    checked={rememberMe}
                  />
                  <label className="form-check-label">Remember me</label>
                </div>
              </div>
            </>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              style={{ float: 'right' }}
              className="btn btn-outline-dark"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              type="button"
              className="btn btn-outline-dark"
              data-bs-dismiss="modal"
              id="close-login-modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setLoginAccessToken: func,
};

Login.defaultProps = {
  setLoginAccessToken: () => {},
};

export default Login;
