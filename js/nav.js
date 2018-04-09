
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
 * Set the first menu option as the active option when
 * DOM window loads.
 */
$(window).on('load', event => {
	if(localStorage.settings_DefaultPage == 0)
	{
		$('li#option-single').removeClass('other').addClass('active');
		$('section#option-single').removeClass('section-hidden').addClass('section-active');
	}
	else if(localStorage.settings_DefaultPage == 1)
	{
		$('li#option-mass').removeClass('other').addClass('active');
		$('section#option-mass').removeClass('section-hidden').addClass('section-active');
	}
	else if(localStorage.settings_DefaultPage == 2)
	{
		$('li#option-settings').removeClass('other').addClass('active');
		$('section#option-settings').removeClass('section-hidden').addClass('section-active');
	}
	else
	{
		$('.other').first().removeClass('other').addClass('active');
		$('.section-hidden').first().removeClass('section-hidden').addClass('section-active');
	}
});