import React, { useEffect, useState } from 'react';
import { func, object, arrayOf, shape } from 'prop-types';
import { CONSTANT_TEXT, KEYS_FOR_VISIBILITY_FLAG } from '../../Config/constant';

function DownloadTableColumnSelectionModal({
  fields,
  selectedFields,
  downloadedTableData,
  handleDownloadSourceTable,
}) {
  const [{ table_columns: tableColumnsList }] = fields;

  const [columns, setColumns] = useState(
    downloadedTableData?.tableColumns || []
  );

  const [isFieldsFilterApplied, setFieldsFilter] = useState(
    Object.keys(downloadedTableData || {}).length
      ? downloadedTableData?.isFilterApplied
      : true
  );

  const [searchedTableColumnValue, setSearchTableColumnValue] = useState('');
  const [isSelectAllToggleButton, setIsSelectAllToggleButton] = useState(true);

  /**
   * handle download button click
   */
  const handleDownloadButton = () => {
    handleDownloadSourceTable(isFieldsFilterApplied, columns);
  };

  const getColumnAfterSearchFilter = (tableColumns) => {
    return (tableColumns || []).filter((option) => {
      return option.display_name
        .toLowerCase()
        .indexOf((searchedTableColumnValue || '').toLowerCase()) > -1
        ? option
        : null;
    });
  };

  /**
   * This function will select all the table columns
   */
  const handleSelectAll = () => {
    const allColumns = getColumnAfterSearchFilter(tableColumnsList)
      .filter(({ name, visibility }) => {
        if (visibility !== KEYS_FOR_VISIBILITY_FLAG.SHOW) return null;

        return name;
      })
      .map(({ name }) => name);

    setColumns(allColumns);
  };

  const handleTableColumnSearch = (event) => {
    setSearchTableColumnValue(event.target.value);
  };

  /**
   * This function will clear all the selected table columns
   */
  const handleClearAll = () => setColumns([]);

  const handleSelectAllToggle = () => {
    if (isSelectAllToggleButton) {
      handleClearAll();
    } else {
      handleSelectAll();
    }

    setIsSelectAllToggleButton(!isSelectAllToggleButton);
  };

  /**
   * handle when table column checkbox clicked
   *
   * @param {String} val
   *
   */
  const handleClick = (val) => {
    setColumns((previousData) => {
      if (previousData.includes(val)) {
        return previousData.filter((name) => name !== val);
      }

      return [...previousData, val];
    });
  };

  useEffect(() => {
    if (!Object.keys(downloadedTableData || {}).length) handleSelectAll();
  }, [downloadedTableData, fields]);

  return (
    <div>
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
                {CONSTANT_TEXT.SELECT_TABLE_COLUMNS}{' '}
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-column-headers-button-actions">
                <div className="form-check form-switch">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    {CONSTANT_TEXT.SELECT_ALL}
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onClick={handleSelectAllToggle}
                    id="flexSwitchCheckChecked"
                    checked={isSelectAllToggleButton}
                  />
                </div>
              </div>
              <hr />
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={handleTableColumnSearch}
                  value={searchedTableColumnValue}
                  placeholder="Search Table column"
                />
              </div>
              <>
                {getColumnAfterSearchFilter(tableColumnsList).map(
                  ({
                    name = '',
                    visibility = '',
                    display_name: displayName = '',
                  }) => {
                    if (visibility !== KEYS_FOR_VISIBILITY_FLAG.SHOW) return '';

                    return (
                      <>
                        <div
                          className="form-check input-label"
                          onClick={() => handleClick(name)}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="option1"
                            checked={columns.includes(name)}
                            value="something"
                          />
                          <label className="form-check-label">
                            {displayName}
                          </label>
                        </div>
                      </>
                    );
                  }
                )}
              </>

              {selectedFields.length ? (
                <>
                  <hr />
                  <div
                    className="form-check input-label"
                    onClick={() => setFieldsFilter(!isFieldsFilterApplied)}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isFieldsFilterApplied}
                      name="option1"
                      value="something"
                    />
                    <label className="form-check-label font-weight-700">
                      {CONSTANT_TEXT.APPLY_FILTER_CHECKBOX}
                    </label>
                  </div>{' '}
                </>
              ) : (
                ''
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-dark float-right"
                data-bs-dismiss="modal"
                disabled={!columns.length}
                onClick={handleDownloadButton}
              >
                {CONSTANT_TEXT.DOWNLOAD}
              </button>

              <button
                type="button"
                className="btn btn-outline-dark"
                id="close-login-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSearchTableColumnValue('')}
              >
                {CONSTANT_TEXT.CLOSE}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DownloadTableColumnSelectionModal.propTypes = {
  fields: arrayOf(shape({})),
  selectedFields: arrayOf(shape({})),
  downloadedTableData: object,
  handleDownloadSourceTable: func,
};

DownloadTableColumnSelectionModal.defaultProps = {
  fields: [{}],
  selectedFields: [{}],
  downloadedTableData: {},
  handleDownloadSourceTable: () => {},
};

export default DownloadTableColumnSelectionModal;
