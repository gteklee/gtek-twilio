/**
 * GLOBAL INFORMATION:
 */
let name;				// Customer's Name.
let currentDateTime;	// Current date and time.
let type;				// Type of ticket (Install/Repair).
let number;				// Customer's phone number.
let message;			// Message to be sent.

let _error = false;		// Global error for user input.
let _errorMsg = '';		// Error message generated when _error is updated.

const invalidChars = ['~', '!', '@', '#', '$', '^', '%', '*', '=', '+', '<', '>']; // Non-valid chars for input. 

/**
 * Creates the message to be sent.
 */
function createMessage_Single()
{
	date = $('#datepicker').val();

	message = 'Gtek Communications Appointment for ' + type + ' Reminder:\n-----------------------\nFor: ' + name + '\nDate: ' + date;
	message += '\n-----------------------\nReply with:\n1 to Confirm\n2 to Reschedule\n3 to Cancel\n4 to Request Call';

	clearInput();
	sendMessage(message, number);
}

/**
  * Send message via SMS.
  * @param: message = message being sent to the customer.
  *			to = phone number to send the message to.
  */
function sendMessage(message, to)
{
	client.messages.create({
		body: message,				// Message.
		to: '+1' + to,				// Text to this number.
		from: tokens.twilioNUMBER 	// From a valid Twilio number.
	}, function(err, message) {
		if(err)
		{
/**/		console.error(err.message);
			_failedNumbers += '<p>' + to + '</p>\n';
			failedCount++;
			console.log(failedCount);
		}
		else
		{
/**/		console.log('Message Sent');
			successCount++;
			console.log(successCount);
		}
	});
}

/** Functions **/

/**
 *
 */
function getType(type)
{
	if(type == 0)
	{
		_error = true;
		_errorMessage = 'Type must be selected.';
		$('.lbl_error').text(_errorMessage);
		$('.lbl_error').show(); 
	}
	else if(type == 1 || type == 'repair' || type == 'Repair')
		return 'Repair';
	else if(type == 2 || type == 'install' || type == 'Install')
		return 'Installation';
	else
	{
		_error = true;
		_errorMessage = 'Internal error: Type!';
	}
}

function checkInput()
{
	if(name == undefined || name == '') 	// If name is empty.
	{
		_error = true;
		_errorMsg = "Customer's name is required.";
		$('#lbl_input_name').css('color', 'red');
		$('.lbl_error').text(_errorMsg);
		$('.lbl_error').show();
	}
	else if(number == undefined || number == '')	// If phone number is empty.
	{
		_error = true;
		_errorMsg = "Customer's phone number is required.";
		$('#lbl_input_number').css('color', 'red');
		$('.lbl_error').text(_errorMsg);
		$('.lbl_error').show();
	}
	else if($('#input_type').val() == 0)	// If type not selected.
	{
		_error = true;
		_errorMsg = "The type of appointment is required.";
		$('#lbl_input_type').css('color', 'red');
		$('.lbl_error').text(_errorMsg);
		$('.lbl_error').show(); 
	}
}

function clearInput()
{
	$('#input_name').val('');
	$('#input_number').val('');
	$('#input_type').val('0');
	$('#datepicker').val('');
}

/** EVENTS **/

/**
 * On button click, send message.
 */
$('#btn-send-single').on('click', () => {

	if(!_error)
		checkInput();

	if(!_error)
		createMessage_Single();
	else
	{
		// Inform user of error.
/**/	console.log(_errorMsg);

	}
});

$(() => {
	$('#datepicker').datepicker();
});

/** ERROR CHECKING **/

/**
 * On #input_name text change, continuosly check for any invalid characters.
 */
$('#input_name').keyup(() => {
	let userInput = $('#input_name').val();

	if(userInput.indexOf(' ') == 0)// If first character is not valid.
	{
		$('#lbl_input_name').css('color', 'red');
		_error = true;
		_errorMsg = 'Name cannot start with white space!';
		$('.lbl_error').text(_errorMsg);
		$('.lbl_error').show();
	}
	else
	{
		$('#lbl_input_name').css('color', 'black');
	
		for(let i in invalidChars)
		{
			if(userInput.indexOf(invalidChars[i]) > -1)
			{
				$('#lbl_input_name').css('color', 'red');
				_error = true;
				_errorMsg = 'Name contains invalid character!';
				$('.lbl_error').text(_errorMsg);
				$('.lbl_error').show();
				break;
			}
			else
			{
				$('#lbl_input_name').css('color', 'black');
				_error = false;
				$('.lbl_error').hide();
				name = userInput;
			}
		}
	}
/**/console.log(name);

});

/**
 * On #input_number text change, containuously check for any alpha chars
 * Also check for appropriate char count (max 10)
 * Also auto format phone number as user inputs data -> (xxx) xxx-xxxx
 * 
 * /[^$,.\d]/ -> check for any non-numeric char.
 * Check length of number.
 * Replace any special character and whitespace with ''.
 */
$('#input_number').keyup(event => {
	let userInput = $('#input_number').val();
	userInput = userInput.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '');

	// Check for alpha chars.
	if(userInput.match(/^[a-zA-Z]/))
	{
		$('#lbl_input_number').css('color', 'red');
		_error = true;
		_errorMsg = 'Invalid phone number!';
		$('.lbl_error').text(_errorMsg);
		$('.lbl_error').show();
	}
	else if(userInput.length > 10)
	{
		$('#lbl_input_number').css('color', 'red');
		_error = true;
		_errorMsg = 'Phone Number is too long!';
		$('.lbl_error').text(_errorMsg);
		$('.lbl_error').show();
	}
	else
	{
		$('#lbl_input_number').css('color', 'black');
		_error = false;
		$('.lbl_error').hide();
	}

	if(userInput.length === 10)
		number = userInput;
	else
		number = '';

/**/console.log(number);
});

/**
 * One type dropdown change.
 */
$('#input_type').change(event => {
	type = getType($('#input_type').val());
});


/**
 * Request info from Sonar.
 * https://example.sonar.software/api/v1/accounts/:account_id/addresses/:address_id
 */