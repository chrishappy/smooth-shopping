/**
 * The Good Choice App script
 * Generated with help from ChatGPT
 * 
 * @author Nathan Tsai <nathan@thegoodchoice.app>
 * @since 2023-03-09
 */

(() => {

  const autofillFunction = () => {
    // Get the URL's search query string
    const queryString = window.location.search;
    
    // Parse the query string into an object of key-value pairs
    const urlParams = new URLSearchParams(queryString);
    
    // Get the values of the parameters, if they exist
    const givenName = urlParams.get('given-name');
    const familyName = urlParams.get('family-name');
    const email = urlParams.get('email');
    const tel = urlParams.get('tel');

    console.log(`The search params are: `, urlParams);
    
    const updateFormValues = () => {
      // Fill in the corresponding form fields with the parameter values, if they exist
      if (givenName) {
        const givenNameInput = document.querySelector('input[name="given-name"]');
        givenNameInput.value = givenName;
      }
      
      if (familyName) {
        const familyNameInput = document.querySelector('input[name="family-name"]');
        familyNameInput.value = familyName;
      }
      
      if (email) {
        const emailInput = document.querySelector('input[name="email"]');
        emailInput.value = email;
      }
      
      if (tel) {
        const telInput = document.querySelector('input[name="tel"]');
        telInput.value = tel;
      }
    }
    
    const continueButton = document.querySelector('#am-continue-button');

    continueButton.addEventListener('click', updateFormValues);
  }

  window.addEventListener('ameliaEventsLoaded', autofillFunction);
})()
