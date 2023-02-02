const { initializeApp } = require('firebase/app');

export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Analyst intelligence Plugin') // edit me!
    .addItem('Analyst intelligence', 'openAboutSidebar');

  menu.addToUi();
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile(
    'sidebarAnalystIntelligence'
  ).setTitle('Analyst intelligence');

  SpreadsheetApp.getUi().showSidebar(html);
};
