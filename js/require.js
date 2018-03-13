/**
 * For single.js and mass.js
 */
const tokens = require('../js/tokens.js'); 	// Twilio API Credentials
const inspect = require('util').inspect;	// Twilio Modules
const client = require('twilio')(tokens.twilioACCT_SID, tokens.twilioTOKEN); // Twilio Modules
const fs = require('fs');	// Filesystem module
const {dialog} = require('electron').remote;	// Dialogs module
const shell = require('electron').shell;
const remote = require('electron').remote;