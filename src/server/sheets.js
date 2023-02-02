const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

/**
 *
 * Get Sheets Data - name , index , isActive
 *
 */
export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();

  return getSheets().map((sheet, index) => {
    const name = sheet.getName();

    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

/**
 *
 * Add New Sheet to workbook
 *
 * @param {String} sheetTitle
 *
 */
export const addSheet = (sheetTitle) => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

/**
 *
 * Delete Sheet using sheet's index
 *
 * @param {Number} sheetIndex
 *
 */
export const deleteSheet = (sheetIndex) => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

/**
 *
 * Make Active Sheet using name
 *
 * @param {String} sheetName
 *
 */
export const setActiveSheet = (sheetName) => {
  SpreadsheetApp.getActive().getSheetByName(sheetName).activate();
  return getSheetsData();
};

/**
 *
 * Get Active Range of the sheet
 *
 */
export const getActiveRange = () => {
  return SpreadsheetApp.getActive().getActiveRange().getA1Notation();
};

/**
 *
 * Render data on the Sheet's cells
 *
 * @param {Array} data
 * @param {String} rangeArea
 *
 */
export const dumpTableData = (data, rangeArea) => {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();

  const range = sheet.getRange(rangeArea);
  range.setValues(data);
};

/**
 *
 * Map Comment to the cell
 *
 * @param {String} comment
 * @param {String} rangeArea
 *
 */
export const mapCommentToTheActiveCell = (comment) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getSelection();
  const ranges = selection.getActiveRangeList().getRanges();

  for (let index = 0; index < ranges.length; index++) {
    ranges[index].setNote(comment);
  }
};

/**
 *
 * Get Selected range comments
 *
 */
export const getAllCommentWithAddress = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getSelection();
  const ranges = selection.getActiveRangeList().getRanges();

  const address = [];
  const comments = [];

  for (let index = 0; index < ranges.length; index++) {
    const range = sheet.getRange(ranges[index].getA1Notation());

    const results = ranges[index].getNotes();

    for (const i in results) {
      for (const j in results[i]) {
        if (results[i][j]) {
          comments.push(results[i][j]);
          address.push(
            range.getCell(Number(i) + 1, Number(j) + 1).getA1Notation()
          );
        }
      }
    }
  }

  return address.map((address, index) => {
    return { address, comment: comments[index] };
  });
};

/**
 *
 * Delete the selected cell's
 *
 */
export const deleteSelectedRangeCommnets = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getSelection();
  const ranges = selection.getActiveRangeList().getRanges();

  for (let index = 0; index < ranges.length; index++) {
    sheet.getRange(ranges[index].getA1Notation()).setNote('');
  }
};
