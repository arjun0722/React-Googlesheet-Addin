import React, { useState } from 'react';

import Login from './Login';
import NavOptions from './NavOptions';
import { TOKEN_KEY } from '../Config/constant';
import DataSelectionMenu from './DataSelectionMenu';

import './index.css';

function AnalystIntelligence() {
  const [errorMessage, setErrorMessage] = useState('');
  const [realod, setReload] = useState(false);

  const [loginAccessToken, setLoginAccessToken] = useState(
    localStorage.getItem(TOKEN_KEY)
  );

  return (
    <>
      <NavOptions
        setReload={setReload}
        loginAccessToken={loginAccessToken}
        setLoginAccessToken={setLoginAccessToken}
      />

      {realod ? (
        <></>
      ) : (
        <div className="main-section">
          <div id="showErrorMessage">{errorMessage}</div>
          {!loginAccessToken ? (
            <Login
              setErrorMessage={setErrorMessage}
              setLoginAccessToken={setLoginAccessToken}
            />
          ) : (
            <DataSelectionMenu />
          )}
        </div>
      )}
    </>
  );
}

export default AnalystIntelligence;
