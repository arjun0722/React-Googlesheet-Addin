export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Analyst intelligence Plugin') // edit me!
    .addItem('Analyst intelligence', 'openAboutSidebar');

  menu.addToUi();
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile(
    'SidebarMenuAnalystIntelligence'
  ).setTitle('Analyst intelligence');

  SpreadsheetApp.getUi().showSidebar(html);
};
