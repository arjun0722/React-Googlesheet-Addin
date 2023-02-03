import React from 'react';

import { bool, func, string } from 'prop-types';

import { CONSTANT_TEXT, TOKEN_KEY } from '../Config/constant';

function NavOptions({ setLoginAccessToken, loginAccessToken, setReload }) {
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setLoginAccessToken('');
  };

  const handleReloadApp = () => {
    setReload(true);

    setTimeout(() => setReload(false), 1000);
  };

  return (
    <div id="nav-options">
      {loginAccessToken ? (
        <button
          type="button"
          className="btn btn nav-button"
          onClick={handleLogout}
        >
          <i className="bi bi-person"></i> {CONSTANT_TEXT.LOGOUT}
        </button>
      ) : (
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn nav-button"
        >
          <i className="bi bi-person"></i> {CONSTANT_TEXT.LOGIN}
        </button>
      )}

      <button
        onClick={handleReloadApp}
        type="button"
        className="btn btn nav-button"
      >
        <i className="bi bi-arrow-clockwise"></i> {CONSTANT_TEXT.RELOAD}
      </button>
    </div>
  );
}

NavOptions.propTypes = {
  setLoginAccessToken: func,
  loginAccessToken: string,
  setReload: bool,
};

NavOptions.defaultProps = {
  setLoginAccessToken: () => {},
  loginAccessToken: '',
  setReload: false,
};

export default NavOptions;
