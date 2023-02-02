import React from 'react';
import { arrayOf, func, string, bool } from 'prop-types';

import {
  BUTTON_ACTION,
  NOTIFICATIONS_MESSAGES,
  CONSTANT_TEXT,
  MAXIMUM_NUMBER_TO_DISABLE_BUTTON,
} from '../../Config/constant';

function ActionButton({
  handleActionButtonClick,
  selectedSources,
  loadingFieldsData,
}) {
  return (
    <div className="action-buttons">
      <button
        type="button"
        onClick={() => handleActionButtonClick(BUTTON_ACTION.SAVE_DATA)}
        className="btn btn-outline-success action-button"
        disabled={
          !(selectedSources.length === MAXIMUM_NUMBER_TO_DISABLE_BUTTON)
        }
      >
        {CONSTANT_TEXT.SAVE}
      </button>

      <button
        type="button"
        onClick={() =>
          handleActionButtonClick(BUTTON_ACTION.DOWNLOAD_SOURCE_TABLE_DATA)
        }
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        className="btn btn-outline-primary action-button"
        disabled={
          loadingFieldsData ||
          !(selectedSources.length === MAXIMUM_NUMBER_TO_DISABLE_BUTTON)
        }
        data-toggle="tooltip"
        data-placement="top"
        title={NOTIFICATIONS_MESSAGES.MESSAGE_FOR_EXPORT_DATA}
      >
        <i className="bi bi-box-arrow-down"></i> {CONSTANT_TEXT.EXPORT_TABLE}
      </button>

      <button
        type="button"
        onClick={() => handleActionButtonClick(BUTTON_ACTION.DELETE_COMMENTS)}
        className="btn btn-outline-danger action-button"
        data-toggle="tooltip"
        data-placement="top"
        title={NOTIFICATIONS_MESSAGES.MESSAGE_FOR_DELETE_MAPPED_DATA}
      >
        <i className="bi bi-trash"></i> {CONSTANT_TEXT.DELETE}
      </button>

      <button
        type="button"
        onClick={() => handleActionButtonClick(BUTTON_ACTION.LOAD_VALUES)}
        className="btn btn-outline-success action-button"
        data-toggle="tooltip"
        data-placement="top"
        title={NOTIFICATIONS_MESSAGES.MESSAGE_FOR_SHOW_MAPPING}
      >
        {CONSTANT_TEXT.SHOW_MAPPING}
      </button>
    </div>
  );
}

ActionButton.propTypes = {
  handleActionButtonClick: bool,
  loadingFieldsData: func,
  selectedSources: arrayOf(string),
};

ActionButton.defaultProps = {
  handleActionButtonClick: () => {},
  selectedSources: [],
  loadingFieldsData: false,
};

export default ActionButton;
