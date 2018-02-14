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

const invalidChars = ['~', '!', '@', '#', '$', '^', '%', '*', '=', '+']; // Non-valid chars for input. 

/**
 * Creates the message to be sent.
 */
function createMessage_Single()
{
	name = $('#input_name').val();
	number = $('#input_number').val();
	type = getType($('#input_type').val());
	date = $('#datepicker').val();

	message = 'Gtek Communications Appointment for ' + type + ' Reminder:\n-----------------------\nFor: ' + name + '\nDate: ' + date;
	message += '\n-----------------------\nIf you have any questions or need to make changes, please contact us at 361-777-1400. Thank you!';

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
			console.error(err.message);
		else
			console.log('Message Sent');
	});
}

/** Functions **/

/**
 *
 */
function getType(type)
{
	if(type == 0)
		return '';
	else if(type == 1)
		return 'Repair';
	else if(type == 2)
		return 'Installation';
	else
		return 'ERROR';
}

/** EVENTS **/

/**
 * On button click, send message.
 */
$('#btn-send-single').on('click', () => {

	

	if(!_error)
		createMessage_Single();
	else
	{
		// Inform user of error.
		console.log(_errorMsg);

	}
});

$(() => {
	$('#datepicker').datepicker();
});

/** ERROR CHECKING **/

/**
 * On #input_name text change, continuosly check for any invalid characters.
 */
$("#input_name").keyup(() => {
	let userInput = $('#input_name').val();

	if(userInput.indexOf(' ') == 0)// If first character is not valid.
	{
		$('#lbl_input_name').css('color', 'red');
		_error = true;
		_errorMsg = 'Name cannot start with white space!';
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
				break;
			}
			else
			{
				$('#lbl_input_name').css('color', 'black');

				_error = false;
			}
		}
	}

});

/**
 * On #input_number text change, containuously check for any alpha chars
 * Also check for appropriate char count (max 10)
 * Also auto format phone number as user inputs data -> (xxx) xxx-xxxx
 * 
 * /[^$,.\d]/ -> check for any non-numeric char.
 */
$("#input_number").keyup(event => {
	let userInput = $('#input_number').val();

	// Check for alpha chars.
	if(userInput.match(/[^$,.\d]/))
	{
		$('#lbl_input_number').css('color', 'red');
		_error = true;
		_errorMsg = 'Invalid phone number!';
	}
	else
	{
		$('#lbl_input_number').css('color', 'black');
		_error = false;
	}
	

});

/**
 * Request info from Sonar.
 * https://example.sonar.software/api/v1/accounts/:account_id/addresses/:address_id
 */