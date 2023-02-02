import {
  onOpen,
  onSelectionChange,
  openDialog,
  openDialogBootstrap,
  openDialogTailwindCSS,
  openAboutSidebar,
  
} from './ui';

import { getSheetsData, addSheet, deleteSheet, setActiveSheet , getActiveRange , dumpTableData , mapCommentToTheActiveCell , getAllCommentWithAddress , deleteSelectedRangeCommnets } from './sheets';

// Public functions must be exported as named exports
export {
  onOpen,
  onSelectionChange,
  openDialog,
  openDialogBootstrap,
  openDialogTailwindCSS,
  openAboutSidebar,
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  getActiveRange,
  dumpTableData,
  mapCommentToTheActiveCell,
  getAllCommentWithAddress,
  deleteSelectedRangeCommnets
};
