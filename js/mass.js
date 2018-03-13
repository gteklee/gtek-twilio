/** Global Variables **/
let _Data = '';
let successCount = 0;
let failedCount = 0;
let sent = false;
let imported = false;

let _errorMass = false;
let _failedNumbers = '';

$(()=> { 
	$('.csv-link').css('text-decoration', 'underline');
	$('.csv-link p').css('font-family', "'Rubik', sans-serif");
	$('.csv-link p').hover(() => { $('.csv-link p').css('cursor', 'pointer'); }, () => { $('.csv-link p').css('cursor', 'default'); });
});

// Make all urls open in browser
$('.csv-link').on('click', (event) => {
	$('.csv-link p').css('color', 'blue');
    event.preventDefault();
    shell.openExternal('https://docs.google.com/spreadsheets/d/1Qr7eTld0B0fssDjl4L0AVeajfx3sKjhqKGtRZ9cSpRY/export?format=csv');
});
/** Functions **/

/**
 * Choose a file.
 */
function chooseFile()
{
	dialog.showOpenDialog({
		filters: [{
			name: 'Spreadsheet File (*.csv)', extensions: ['csv']
		}]
	}, (fileNames) => {
		if(fileNames === undefined)
		{
/**/		console.log("No files were selected");
			return;
		}

/**/	console.log(fileNames[0]);
		$('.input_file').val(fileNames[0]);

		fs.readFile(fileNames[0], "utf-8", (err, data) => {
			if(err)
			{
/**/			console.log("Cannot read file ", err);
				return;
			}

			readData(data);

		});
	});
}

/**
 * Read the Data imported from the .CSV file.
 */
function readData(data)
{
	let rows = data.split('\n'); // Split row by new line char.
	rows.shift(); // Remove first element of array.
/**/console.log(rows);

	// Check that there is not an empty cell.
	if(rows[rows.length - 1] == "")
		rows.pop();

	_Data = rows;

	// Create preview based on data in .csv.
	let table = '<table class="tbl-mass">\n<tr>\n<th></th>\n<th> Number </th>\n<th> Name </th>\n<th> Type </th>\n<th> Date </th>\n</tr>\n';
	for(let i = 0; i < rows.length; i++)
	{
		table = table + '	<tr>\n';
		
		let td = rows[i].split(','); // Split data by ,

		// Check for an error.
		// If there is an error exit loop, and inform user by displaying
		// error message instead of table of data.
		if(checkCSV(td)) return;
		
		for(let j = 0; j < td.length + 1; j++)
		{
			if(j == 0)
				table = table + '		<td> ' + (i + 1) + ' </td>\n'; 
			else
				table = table + '		<td> ' + td[j - 1] + ' </td>\n';
		}

		table = table + '	</tr>\n';
	}

	// Provide user with appropriate data.
	if(!_errorMass) 
	{
		table = table + '</table>\n';
		sent = false;
	}
	else table = '<div id="error-mass-msg"> <h1> ' + _errorMsg + ' </h1> </div>';

	addTable(table); // Add table to html.
	showPreview();	// Show preview of data.
}

/**
 * Checks the imported .csv file for the correct format.
 * If error is found, returns true.
 * @param {*} data -> an array that contains the fields of a record.
 */
function checkCSV(data)
{
	console.log('Before .CSV check: ' + data, 'Length: ' + data.length);
	if(data.length > 4) // Should only be 4 fields.
	{
		_errorMass = true;
		_errorMsg = 'Invalid .csv : Too many fields!';
	}
	else if(data.length < 4)
	{
		if(data[data.length-1] == '')
		{
			_errorMass = true;
			_errorMsg = 'Invalid .csv : Cell with empty string';
		}
		else
		{
			_errorMass = true;
			_errorMsg = 'Invalid .csv : Not enough fields!';
		}
	}
	else
	{
		_errorMass = false;
	}
	/**
	 * number = data[0]
	 * name = 	data[1]
	 * type = 	data[2]
	 * date = 	data[3]
	 *
	for(let i = 0; i < data.length; i++)
	{
	
		if(data[i].match(/^[a-zA-Z]/) && i == 0) // Check for alphas in number field.
		{
			_errorMass = true;
			_errorMsg = 'Invalid format: Field 1 should be a phone number.'
		}
		else if(data[i].match(/^[a-zA-Z]/) && i == 3) // Check for alphas in date field.
		{
			_errorMass = true;
			_errorMsg = 'Invalid format: Field 3 should be a data in "mm/DD/yyyy" format.'
		}
	}*/
}

/**
 * Creates a message based on data provided to the readData function.
 * Looks for a phone number, name, type, and date.
 * Based on type, the message is created.
 */
function createMessage_Mass()
{
	if(!sent)
	{
		for(let i = 0; i < _Data.length; i++)
		{
			/**
			 * number = info[0]
			 * name = 	info[1]
			 * type = 	info[2]
			 * date = 	info[3]
			 */

			let info = _Data[i].split(','); // Split data by ','.

			let message = 'Gtek Communications Appointment for ' + getType(info[2]) + ' Reminder:\n-----------------------\nFor: ' + info[1] + '\nDate: ' + info[3];
			message = message + '\n-----------------------\nReply with:\n1 to Confirm\n2 to Reschedule\n3 to Cancel\n4 to Request Call';

			sendMessage(message, info[0]);
		}
		sent = true;
		setTimeout(generateSendMessage, 3000);
	}
}

/**
 * Generate a message to inform the user how many messages were successfuly sent
 * and how many failed to send.
 */
function generateSendMessage()
{
	console.log(successCount, failedCount);
	console.log(_failedNumbers);
	let message = '';
	if(successCount > 0)
		message  = '<div id="send-msg"> <h1 id="send-msg-succ"> Messages Sent: ' + successCount + ' </h1> <h1 id="send-msg-fail"> Failed to Send: ' + failedCount + '</div>';
	else
		message  = '<div id="send-msg"> <h1 id="send-msg-fail"> All Failed to Send: ' + failedCount + '</div>';

	$('#send-msg').remove();
	$('.msg-results').append(message);
	$('#send-msg-succ').css('color', '#4286f4');
	$('#send-msg-fail').css('color', 'red');
	$('#send-msg').css('font-family', 'arial');
}

/** Jquery functions **/
function addTable(table)
{
	$('.tbl-mass').remove();
	$('#error-mass-msg').remove();
	$('#send-msg').remove();
	$('.table-container').append(table);
	$('.table-container').css('text-align', 'center');
	$('#error-mass-msg').css('color', 'red');
	$('#error-mass-msg').css('font-family', 'arial');
}

function showPreview()
{
	if(!imported)
	{
		$('.message-preview').toggle();
		imported = true;
	}
}

/** Events **/

$('#btn-file').on('click', () => {
	chooseFile();
});

$('#btn-send-mass').on('click', () => {
	successCount = 0;
	failedCount = 0;
	if(!_errorMass)
	{
		createMessage_Mass();
	}
});