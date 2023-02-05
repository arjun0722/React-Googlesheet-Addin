import React, { useEffect, useState } from 'react';

import {
  refreshTheData,
  getSourceTableListingViaApi,
  deleteSelectedRangeComments,
  mappedContentToTheCellComment,
  downloadAndRenderDataOnActiveCell,
  loadSourceTableDataForParticularId,
  getCommentAfterAddingPrefixAndConvertingTheContentIntoString,
  getCommentAfterRemovingPrefixAndConvertingTheStringIntoObject,
} from '../Utils/helper';
import Heading from './DataSelection/Heading';
import {
  BUTTON_ACTION,
  MAX_FIELDS_LENGTH_TO_SHOW_DOWNLOAD_BUTTON,
  PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION,
} from '../Config/constant';
import ActionButton from './DataSelection/ActionButton';
import FieldsDropDownTree from './DataSelection/FieldsDropDownTree';
import SourceTableSelection from './DataSelection/SourceTableSelection';
import ProgressIndicatorBar from './SharedComponenet/ProgressIndicatorBar';
import { serverFunctions } from '../../utils/serverFunctions';
import DownloadTableColumnSelectionModal from './DataSelection/DownloadTableColumnSelectionModal';

const SourceTableCachedData = {};

function DataSelectionMenu() {
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [sourceTablesList, setSourceTablesList] = useState([]);
  const [loadingFieldsData, setLoadingFieldsData] = useState(false);
  const [downloadedTableData, setDownloadedTableData] = useState({});
  const [showLoadingScreenView, setLoadingScreenView] = useState(false);
  const [progressBarCustomMessage, setProgressBarCustomMessage] = useState('');

  /**
   * load required data for dropdowns
   */
  const loadRequiredData = async () => {
    try {
      setLoadingScreenView(true);

      const [sourceTablesData = []] = await Promise.all([
        getSourceTableListingViaApi(),
      ]);

      setSourceTablesList(sourceTablesData);
      setLoadingScreenView(false);
    } catch (error) {
      setLoadingScreenView(false);
    }
  };

  /**
   * load data In Case source table data is not cached
   *
   * @param {Array} sources
   *
   */
  const handleIfSourceDataIsNotPresentInStore = async (sources) => {
    try {
      const alredadyCachedData = [];

      const pendingPromise = sources
        .filter(({ value }) => {
          if (SourceTableCachedData[value]) {
            alredadyCachedData.push(SourceTableCachedData[value]);

            return null;
          }

          return value;
        })
        .map(({ value }) => loadSourceTableDataForParticularId(value));

      const data = await Promise.all(pendingPromise);

      data.forEach((field) => {
        if (field) SourceTableCachedData[field.id] = field;
      });

      const getArrWithValues = data.filter((value) => value);

      setFields([...getArrWithValues, ...alredadyCachedData]);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  useEffect(() => {
    loadRequiredData();
  }, []);

  /**
   * set states to its default value In case no mapping found
   */
  const handleInCaseNoCommentMappedToTheCells = () => {
    setSelectedSources([]);
    setSelectedSource('');
    setSelectedFields([]);
    setFields([]);
    setDownloadedTableData({});
    setLoadingScreenView(false);
  };

  /**
   * load mapped value from commnent and set states
   */
  const loadCommentValueInTheState = async () => {
    try {
      setLoadingScreenView(true);

      const mappedData = await serverFunctions.getAllCommentWithAddress();

      if (!mappedData.length) {
        handleInCaseNoCommentMappedToTheCells();

        return;
      }

      let downloadData = {};
      const selectedFieldsData = [];

      const allSources = (mappedData || []).map((data) => {
        const { content } =
          getCommentAfterRemovingPrefixAndConvertingTheStringIntoObject(
            data.comment
          );

        downloadData = content.downloadTableData;

        selectedFieldsData.push(...content.selectedFields);

        return content.source;
      });

      setSelectedSources(allSources);
      setSelectedSource(allSources[0]);
      setDownloadedTableData(downloadData);
      setSelectedFields(selectedFieldsData);
      await handleIfSourceDataIsNotPresentInStore(allSources);
      setLoadingScreenView(false);
    } catch (error) {
      setLoadingScreenView(false);

      console.error(error);
    }
  };

  /**
   * handle Save Data
   *
   */
  const handleSaveData = async () => {
    setLoadingScreenView(true);
    setProgressBarCustomMessage(
      PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION.MAP_DATA
    );

    await mappedContentToTheCellComment(
      getCommentAfterAddingPrefixAndConvertingTheContentIntoString(
        selectedSource,
        selectedFields,
        downloadedTableData
      )
    );

    setProgressBarCustomMessage('');
    setLoadingScreenView(false);
  };

  /**
   * handle Save Data
   *
   */
  const deleteMappedComments = async () => {
    setLoadingScreenView(true);
    setProgressBarCustomMessage(
      PROGRESS_BAR_MESSAGE_ACCORDING_TO_ACTION.DELETE_COMMENT
    );

    await deleteSelectedRangeComments();

    setProgressBarCustomMessage('');
    setLoadingScreenView(false);
  };

  /**
   * handle Refresh Data
   *
   */
  const refreshSelectedRangeData = async () => {
    setLoadingScreenView(true);
    await refreshTheData();
    setLoadingScreenView(false);
  };

  /**
   * handle action button click and perform operations according to key
   *
   * @param {String} actionName
   *
   */
  const handleActionButtonClick = async (actionName) => {
    const { LOAD_VALUES, SAVE_DATA, REFRESH_DATA, DELETE_COMMENTS } =
      BUTTON_ACTION;

    switch (actionName) {
      case REFRESH_DATA:
        refreshSelectedRangeData();
        break;

      case SAVE_DATA:
        handleSaveData();

        break;

      case LOAD_VALUES:
        loadCommentValueInTheState();
        break;

      case DELETE_COMMENTS:
        deleteMappedComments();
        break;

      default:
        break;
    }
  };

  /**
   * get the source table details from the API and render in the cells
   *
   * @param {Boolean} applyFilters
   * @param {Array} tableColumns
   *
   */
  const handleDownloadSourceTable = async (applyFilters, tableColumns) => {
    try {
      setLoadingScreenView(true);
      setDownloadedTableData({ isFilterApplied: applyFilters, tableColumns });

      await mappedContentToTheCellComment(
        getCommentAfterAddingPrefixAndConvertingTheContentIntoString(
          selectedSource,
          selectedFields,
          { isFilterApplied: applyFilters, tableColumns }
        )
      );

      await downloadAndRenderDataOnActiveCell({
        source: selectedSource,
        selectedFields,
        downloadTableData: { isFilterApplied: applyFilters, tableColumns },
      });

      setLoadingScreenView(false);
    } catch (error) {
      console.error(error);
      setLoadingScreenView(false);
    }
  };

  /**
   * handle when source table is selected from the dropdown
   *
   * @param {Object} sourceTable
   *
   */
  const handleSourceTableSelection = async (sourceTable) => {
    setSelectedSource(sourceTable);
    setSelectedSources([sourceTable]);
    setSelectedFields([]);
    setDownloadedTableData({});

    setLoadingFieldsData(true);

    if (SourceTableCachedData[sourceTable.value]) {
      setFields([SourceTableCachedData[sourceTable.value]]);

      return;
    }

    await handleIfSourceDataIsNotPresentInStore([sourceTable]);
  };

  return (
    <>
      {showLoadingScreenView ? (
        <ProgressIndicatorBar message={progressBarCustomMessage} />
      ) : (
        <>
          <Heading />

          {fields.length === MAX_FIELDS_LENGTH_TO_SHOW_DOWNLOAD_BUTTON && (
            <DownloadTableColumnSelectionModal
              fields={fields}
              selectedFields={selectedFields}
              downloadedTableData={downloadedTableData}
              handleDownloadSourceTable={handleDownloadSourceTable}
            />
          )}

          <ActionButton
            loadingFieldsData={loadingFieldsData}
            selectedSources={selectedSources}
            handleActionButtonClick={handleActionButtonClick}
          />

          <SourceTableSelection
            sourceTablesList={sourceTablesList}
            selectedSource={selectedSource}
            handleSourceTableSelection={handleSourceTableSelection}
          />

          <FieldsDropDownTree
            fields={fields}
            selectedFields={selectedFields}
            loadingFieldsData={loadingFieldsData}
            setSelectedFields={setSelectedFields}
            setLoadingFieldsData={setLoadingFieldsData}
          />
        </>
      )}
    </>
  );
}

export default DataSelectionMenu;
