/** Global Variables **/
let _Data = '';
let sent = false;
let imported = false;

let _errorMass = false;

/** Functions **/

/**
 * Choose a file 
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
			console.log("No files were selected");
			return;
		}

		console.log(fileNames[0]);
		$('.input_file').val(fileNames[0]);

		fs.readFile(fileNames[0], "utf-8", (err, data) => {
			if(err)
			{
				console.log("Cannot read file ", err);
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
	console.log(rows);

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
		if(checkError(td)) return;
		
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
	if(!_errorMass) table = table + '</table>\n';
	else table = '<div> <h1> ' + _errorMsg + ' </h1> </div>';

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
	if(data.length > 4) // Should only be 4 fields.
	{
		_errorMass = true;
		_errorMsg = 'Invalid .csv : Too many fields!'
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
			message = message + '\n-----------------------\nIf you have any questions or need to make changes, please contact us at 361-777-1400. Thank you!';

			sendMessage(message, info[0]);
		}

		console.log('Mass Messages Sent!');
		sent = true;
	}
}


/** Jquery functions **/
function addTable(table)
{
	$('.tbl-mass').remove();
	$('.table-container').append(table);
	$('.table-container').css('text-align', 'center');

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
	if(!_errorMass)
		createMessage_Mass();
});