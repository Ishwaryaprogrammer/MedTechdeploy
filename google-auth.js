const { google } = require('googleapis');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');  // Downloaded from Google Cloud Console
 // Ensure this path is correct


 // Check if the file is being read correctly
 fs.readFile(CREDENTIALS_PATH, (err, content) => {
   if (err) {
     console.log('Error reading credentials file:', err);
     return;
   }
   try {
     const credentials = JSON.parse(content);
      // Add this line to check the content of the file
   } catch (err) {
     console.log('Error parsing credentials JSON:', err);
   }
 });
 
// Load OAuth2 credentials
function getCredentials() {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    return JSON.parse(content);
}

// Create an OAuth2 client
function authorize(callback) {
    const credentials = getCredentials();
    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    // Check if we have a stored token
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

// Get a new token if we don't have one
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const code = readlineSync.question('Enter the code from that page here: ');
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        callback(oAuth2Client);
    });
}

module.exports = { authorize };
