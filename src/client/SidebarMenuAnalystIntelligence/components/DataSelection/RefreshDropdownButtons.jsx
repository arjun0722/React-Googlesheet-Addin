import React, { useEffect, useRef } from 'react';
import { bool, array, func } from 'prop-types';

import {
  BUTTON_ACTION,
  CONSTANT_TEXT,
  NOTIFICATIONS_MESSAGES,
  MAXIMUM_NUMBER_TO_DISABLE_BUTTON,
} from '../../Config/constant';

function RefreshOptionDropdown({
  selectedSources,
  showHideDropdown,
  setShowHideDropdown,
  handleActionButtonClick,
}) {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showHideDropdown &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setShowHideDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.addEventListener('click', handleClickOutside, true);
    };
  });

  const { MESSAGE_FOR_DUMP_SOURCE_TABLE } = NOTIFICATIONS_MESSAGES;

  return (
    <label className="dropdown" ref={ref}>
      {showHideDropdown && (
        <ul className="refresh-button-dropdown">
          {selectedSources.length === MAXIMUM_NUMBER_TO_DISABLE_BUTTON ? (
            <li
              className="refresh-option"
              onClick={() =>
                handleActionButtonClick(
                  BUTTON_ACTION.DOWNLOAD_SOURCE_TABLE_DATA
                )
              }
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              {CONSTANT_TEXT.DOWNLOAD_TABLE} &nbsp;
              <i
                className="bi bi-info-circle"
                data-toggle="tooltip"
                data-placement="top"
                title={MESSAGE_FOR_DUMP_SOURCE_TABLE}
              ></i>
            </li>
          ) : (
            ''
          )}
        </ul>
      )}
    </label>
  );
}

RefreshOptionDropdown.propTypes = {
  selectedSources: array,
  showHideDropdown: bool,
  setShowHideDropdown: func,
  handleActionButtonClick: func,
};

RefreshOptionDropdown.defaultProps = {
  selectedSources: [],
  showHideDropdown: false,
  setShowHideDropdown: () => {},
  handleActionButtonClick: () => {},
};

export default RefreshOptionDropdown;
