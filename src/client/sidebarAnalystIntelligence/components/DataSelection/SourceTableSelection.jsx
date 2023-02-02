import React from 'react';
import { func, object, shape, arrayOf } from 'prop-types';
import Select from 'react-select';

import {
  CONSTANT_TEXT,
  PLACEHOLDER_VALUES,
  TABLE_TYPES,
  TABLE_TYPE_LABELS,
} from '../../Config/constant';

import { getSourceTableListingOptions } from '../../Utils/helper';

function SourceTableSelection({
  sourceTablesList,
  selectedSource,
  handleSourceTableSelection,
}) {
  const showOptionsWithLabels = (param) => {
    if (param.data.tableType && param.data.tableType !== TABLE_TYPES.SOURCE) {
      const label =
        param.data.labelName || TABLE_TYPE_LABELS[param?.data?.tableType]?.name;

      if (label) {
        return (
          <>
            <div
              {...param}
              className="source-table-listing-div"
              onClick={() => param.innerProps.onClick()}
            >
              {param.data.label} -
              <span
                className="label-text"
                style={{
                  color:
                    param.data.tableType === TABLE_TYPES.SCENARIO
                      ? TABLE_TYPE_LABELS[param.data.tableType]?.color[
                          param.data.labelName
                        ] ||
                        TABLE_TYPE_LABELS[param.data.tableType]?.color.others
                      : TABLE_TYPE_LABELS[param.data.tableType]?.color,
                  backgroundColor:
                    param.data.tableType === TABLE_TYPES.SCENARIO
                      ? TABLE_TYPE_LABELS[param.data.tableType]
                          ?.backgroundColor[param.data.labelName] ||
                        TABLE_TYPE_LABELS[param.data.tableType]?.backgroundColor
                          .others
                      : TABLE_TYPE_LABELS[param.data.tableType]
                          ?.backgroundColor,
                  border: TABLE_TYPE_LABELS[param.data.tableType]?.border,
                }}
              >
                {label}
              </span>
            </div>
          </>
        );
      }
    }

    return (
      <div
        className="source-table-listing-div"
        {...param}
        onClick={() => param.innerProps.onClick()}
      >
        {' '}
        {param.data.label}
      </div>
    );
  };

  return (
    <>
      <label className="dropdown-labels">
        {CONSTANT_TEXT.SELECT_TABLE_LABEL}
      </label>
      <Select
        value={selectedSource}
        components={{ Option: showOptionsWithLabels }}
        onChange={(val) => handleSourceTableSelection(val)}
        options={getSourceTableListingOptions(sourceTablesList)}
        placeholder={PLACEHOLDER_VALUES.SOURCE_TABLE_SELECTION_DROPDOWN}
      />
    </>
  );
}

SourceTableSelection.propTypes = {
  sourceTablesList: arrayOf(shape({})),
  selectedSource: object,
  handleSourceTableSelection: func,
};

SourceTableSelection.defaultProps = {
  sourceTablesList: [],
  selectedSource: {},
  handleSourceTableSelection: () => {},
};

export default SourceTableSelection;
