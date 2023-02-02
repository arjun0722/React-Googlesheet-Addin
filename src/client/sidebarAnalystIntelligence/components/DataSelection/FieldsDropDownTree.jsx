/* eslint-disable */

import React, { Component } from 'react';

import DropdownTreeSelect from 'react-dropdown-tree-select';

import { CONSTANT_TEXT, PLACEHOLDER_VALUES } from '../../Config/constant';
import ProgressIndicatorBar from '../SharedComponenet/ProgressIndicatorBar';

import 'react-dropdown-tree-select/dist/styles.css';
import '../ReactDropdown.css';
import { setHeightOfTheDropDownAccordingToScreenSize } from '../../Utils/helper';

export default class FieldsDropDownTree extends Component {
  needReRendering = true;

  constructor(props) {
    super(props);
    this.state = { filedsTree: [] };
  }

  componentDidMount() {
    const dropdownTreeViewMasterList = (this.props?.fields || []).map(
      (data = []) => {
        return this.createFieldsTree(data);
      }
    );

    this.setState({ filedsTree: dropdownTreeViewMasterList });
    this.props.setLoadingFieldsData(false);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (!this.needReRendering) {
      this.needReRendering = true;

      return false;
    }

    return true;
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (
      JSON.stringify(nextProps?.fields) !==
        JSON.stringify(this.props?.fields) ||
      JSON.stringify(nextProps?.selectedFields) !==
        JSON.stringify(this.props?.selectedFields)
    ) {
      const dropdownTreeViewMasterList = (nextProps?.fields || []).map(
        (data = []) => {
          return this.createFieldsTree(data);
        }
      );

      this.setState({ filedsTree: dropdownTreeViewMasterList });
      this.props.setLoadingFieldsData(false);
    }
  };

  checkIfDimensionMemberIsCheckedOrNot = (selectedValue, branch) => {
    return (
      selectedValue?.findIndex(
        (selectedDimension) =>
          selectedDimension.columnName === branch?.columnName &&
          selectedDimension.tableName === branch?.tableName &&
          selectedDimension.dimensionId === branch?.dimension_id
      ) !== -1
    );
  };

  /**
   * create tree with children data as branches
   *
   * @param params
   *
   */
  getTreeWithChildData = (params) => {
    const { rootLevelData, columnName, tableName } = params;

    return rootLevelData.map((member) => {
      const displayValue =
        member.display_name || PLACEHOLDER_VALUES.EMPTY_VALUE;

      return {
        data: { ...member, columnName, tableName },
        disabled: false,
        children: null,
        label: displayValue,
        value: displayValue,
        checked: this.checkIfDimensionMemberIsCheckedOrNot(
          this.props.selectedFields,
          {
            ...member,
            columnName,
            tableName,
          }
        ),
      };
    });
  };

  /**
   * Get Data according to level
   *
   * @param members
   *
   */
  getLevelWiseData = (members) => {
    const levelWiseData = {};

    (members || []).forEach((obj) => {
      if (levelWiseData[obj.level]) {
        levelWiseData[obj.level].push(obj);
        return obj;
      }

      levelWiseData[obj.level] = [obj];

      return obj;
    });

    return levelWiseData;
  };

  /**
   * create tree data strcture for react-dropdown-tree-select
   *
   * @param {Object} data
   *
   * @returns {Object}
   *
   */
  createFieldsTree = (data) => {
    const [hierarchiesInfo = {}] = data?.hierarchy_infos || [];

    const dimensionTreeWithBranches = (hierarchiesInfo?.hierarchies || []).map(
      (hierarchy) => {
        const {
          members = [],
          display_name: displayName = '',
          level_columns: levelColumns = '',
          leaf_column: leafColumn = '',
        } = hierarchy || {};

        const levelWiseData = this.getLevelWiseData(members) || {};

        const [rootLevelData = [], ...restMembers] =
          Object.values(levelWiseData) || [];

        const params = {
          restMembers,
          levelColumns,
          rootLevelData,
          columnName: leafColumn,
          tableName: data.name,
        };

        const childrenData = this.getTreeWithChildData(params);

        return {
          disabled: true,
          children: childrenData,
          label: displayName,
          value: displayName,
        };
      }
    );

    if (hierarchiesInfo?.hierarchies.length > 1) {
      const labelName = data.display_name;

      return {
        disabled: true,
        children: dimensionTreeWithBranches,
        label: labelName,
        value: labelName,
      };
    }

    return dimensionTreeWithBranches[0];
  };

  onFieldsDropdownChange = (clickedNode) => {
    const nodeObj = {
      tableName: clickedNode?.data?.tableName,
      columnName: clickedNode?.data?.columnName,
      dimensionId: clickedNode?.data?.dimension_id,
      parentId: clickedNode?.data?.parent_folder_member_id,
    };

    if (clickedNode.checked)
      this.props.setSelectedFields((pre) => [...pre, nodeObj]);

    if (!clickedNode.checked)
      this.props.setSelectedFields((pre) => {
        return pre.filter((field) => {
          if (
            field.columnName === nodeObj?.columnName &&
            field.tableName === nodeObj?.tableName &&
            field.dimensionId === nodeObj?.dimensionId
          )
            return null;

          return field;
        });
      });

    this.needReRendering = false;
  };

  render() {
    return (
      <div className="field-dropdown-section">
        {this.props.loadingFieldsData ? (
          <ProgressIndicatorBar message={this.props.progressBarCustomMessage} />
        ) : (
          <>
            <label className="dropdown-labels">{CONSTANT_TEXT.FIELDS}</label>
            <DropdownTreeSelect
              keepTreeOnSearch={true}
              mode="hierarchical"
              keepChildrenOnSearch={true}
              data={this.state.filedsTree}
              onChange={this.onFieldsDropdownChange}
              onFocus={setHeightOfTheDropDownAccordingToScreenSize}
              className="mdl-style"
            />
          </>
        )}
      </div>
    );
  }
}
