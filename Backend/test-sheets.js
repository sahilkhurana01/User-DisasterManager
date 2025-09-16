const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');

async function testGoogleSheets() {
  try {
    console.log('Testing Google Sheets connection...');
    
    const SHEET_ID = '1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A';
    const CREDENTIALS_PATH = './disaster-management312-be80c55826f0.json';
    
    console.log('Sheet ID:', SHEET_ID);
    console.log('Credentials path:', CREDENTIALS_PATH);
    
    // Check if credentials file exists
    const fs = require('fs');
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('Credentials file not found at:', CREDENTIALS_PATH);
      return;
    }
    
    console.log('Credentials file exists');
    
    const doc = new GoogleSpreadsheet(SHEET_ID);
    console.log('Created GoogleSpreadsheet instance');
    
    // Check available methods
    console.log('Available methods:', Object.getOwnPropertyNames(doc.__proto__));
    
    // Try the correct API method for version 4.x
    const credentials = require(CREDENTIALS_PATH);
    
    // For version 3.x, use the old authentication method
    console.log('Trying old authentication method...');
    
    await doc.useServiceAccountAuth(credentials);
    console.log('Authenticated with service account');
    
    await doc.loadInfo();
    console.log('Loaded document info');
    console.log('Document title:', doc.title);
    console.log('Sheet count:', doc.sheetCount);
    
    // Try different ways to access sheets
    console.log('sheetsByTitle:', doc.sheetsByTitle);
    console.log('sheetsById:', doc.sheetsById);
    console.log('sheetsByIndex:', doc.sheetsByIndex);
    
    // Check if Users Info sheet exists
    const usersSheet = doc.sheetsById['1515899775']; // Users Info sheet ID
    if (usersSheet) {
      console.log('Users Info sheet found');
      console.log('Sheet properties:', {
        title: usersSheet.title,
        rowCount: usersSheet.rowCount,
        columnCount: usersSheet.columnCount
      });
      
      // Try to get headers
      await usersSheet.loadHeaderRow();
      console.log('Headers:', usersSheet.headerValues);
    } else {
      console.log('Users Info sheet not found');
    }
    
  } catch (error) {
    console.error('Error testing Google Sheets:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testGoogleSheets();
