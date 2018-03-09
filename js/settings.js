const ipcRenderer = require('electron').ipcRenderer; // Renders events through IPC.
let update = false;

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

/**
 * On update ready (new version release) tell the user
 * that a new version is available. Give the user an
 * option to quit and install the update.
 */
ipcRenderer.on('updateReady', (event, text) => {
    $('#update-ready p').text('Update Is Available!');
    $('#update-ready p').css('color', '#4286f4');
    $('#version').css('color', 'red');
    $('#version').addClass('version-update');
    update = true;
});

/**
 * On click of version-update when update is available
 * then update the application.
 */
$('#version').on('click', () => {
    if(update)
        ipcRenderer.send('quitAndInstall');
});