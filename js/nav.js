
/**
 * When user selects menu option, update the page
 * based on user's selection.
 */
$('.other').on('click', event => {
	let option = event.target;
	let section = $(option).attr('id');

	if($(option).hasClass('active'))
	{
		return;
	}
	else
	{
		$('.active').removeClass('active').addClass('other');
		$('.section-active').removeClass('section-active').addClass('section-hidden');
		$('li#'+section).removeClass('other').addClass('active');
		$('section#'+section).removeClass('section-hidden').addClass('section-active');

		/*if(section == 'option-single')
			$('#single').removeClass('section-hidden').addClass('section-active');
		else if(section == 'option-mass')
			$('#mass').removeClass('section-hidden').addClass('section-active');
		else if(section == 'option-settings')
			$('#settings').removeClass('section-hidden').addClass('section-active');
		else
			console.log('Cannot find "' + section + '"');*/
	}
});

/**
 * When an <i> element(font-awesome icon) is clicked, it breaks
 * the jquery click listener. To fix this,
 * I set the option with an onclick in the <i> tag.
 */
function setOption(option)
{
	console.log(option);
	if(option === 0)
		$('#option-single').removeClass('other').addClass('active');
	else if(option === 1)
		$('#option-mass').removeClass('other').addClass('active');
	else if(option === 2)
		$('#option-settings').removeClass('other').addClass('active');
	else
		return;
}

/**
 * Set the first menu option as the active option when
 * DOM window loads.
 */
$(window).on('load', event => {
	$('.other').first().removeClass('other').addClass('active');
	$('.section-hidden').first().removeClass('section-hidden').addClass('section-active');
});