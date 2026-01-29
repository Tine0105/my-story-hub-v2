const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function testConnection() {
  console.log('--- Google Sheets Connection Test ---');

  // 1. Load Credentials
  let creds = null;
  const rawEnv = process.env.GOOGLE_CREDENTIALS;
  if (rawEnv) {
    try {
      creds = JSON.parse(rawEnv);
      console.log('✅ Loaded credentials from ENV');
    } catch (e) {
      console.log('⚠️ Failed to parse ENV credentials:', e.message);
    }
  }

  if (!creds) {
    const credPath = path.join(__dirname, 'credentials.json');
    if (fs.existsSync(credPath)) {
      creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      console.log('✅ Loaded credentials from credentials.json');
    } else {
      console.error('❌ No credentials found!');
      return;
    }
  }

  console.log(`📧 Service Account Email: ${creds.client_email}`);
  console.log('👉 PLEASE ENSURE THIS EMAIL HAS "EDITOR" ACCESS TO YOUR GOOGLE SHEET');

  // 2. Setup Auth
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // 3. Test Write
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const TAB_NAME = process.env.GOOGLE_SHEET_TAB || 'Sheet1';

  if (!SHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID is missing in .env');
    return;
  }

  console.log(`📄 Target Sheet ID: ${SHEET_ID}`);
  console.log(`📑 Target Tab Name: ${TAB_NAME}`);

  try {
    console.log('⏳ Attempting to write test row...');
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${TAB_NAME}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[`Test Connection ${new Date().toISOString()}`, 'Success']],
      },
    });
    console.log('✅ Write Successful!');
    console.log(`Updated Range: ${res.data.updates.updatedRange}`);
  } catch (error) {
    console.error('❌ Write Failed!');
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testConnection();
