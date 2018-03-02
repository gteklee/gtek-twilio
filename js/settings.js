/**
 * Set single page as default setting if local-storage
 * does not contain any custom user settings.
 */
 $(()=>{ setDefaultPageRadioButton(); });
/**
 * Local Storage Settings Format:
 * 1) Default Page = settings_DefaultPage
 * 2) ...
 */

 /**
  * If user has not changed the settings already, 
  * then the default selection is Single.
  */
function setDefaultPageRadioButton()
{
    if(localStorage.settings_DefaultPage === undefined)
     {
         $('#settings-page-single').prop('checked', true);
     }
     else
     {
        if(localStorage.settings_DefaultPage == 0) // Single
            $('#settings-page-single').prop('checked', true);
        else if(localStorage.settings_DefaultPage == 1) // Mass
            $('#settings-page-mass').prop('checked', true);
        else if(localStorage.settings_DefaultPage == 2) // Settings
            $('#settings-page-settings').prop('checked', true);
        else
            console.log("Error: settings.js 12 - set default page radio button")
     }
}

/**
 * Updates the user's default page that is
 * selected upon start of the program.
 */
function updateDefaultPage(page)
{
    // Store selected page in local storage.
    localStorage.settings_DefaultPage = page;
/**/console.log(localStorage.settings_DefaultPage);
}

/**
 * Listener for when the user changes the default page.
 * Stores the newly selected setting in local storage.
 */
$('input[name="settings-page"]').change(()=> {
    let page = $('input[name="settings-page"]:checked').val();
/**/console.log(page);
    updateDefaultPage(page);
});
