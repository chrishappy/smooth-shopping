/**
 * The Good Choice App script
 * Generated with help from ChatGPT
 * 
 * @author Nathan Tsai <nathan@thegoodchoice.app>
 * @since 2023-03-09
 */

(function() {

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
        
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    console.log(`The search params are: `, urlParams);
    
    const updateFormValues = () => {
      // Fill in the corresponding form fields with the parameter values, if they exist
      if (givenName && givenName !== 'null') {
        const givenNameInput = document.querySelector('input[name="given-name"]');
        givenNameInput.value = givenName;
          
        givenNameInput.dispatchEvent(event);
      }
      
      if (familyName && familyName !== 'null') {
        const familyNameInput = document.querySelector('input[name="family-name"]');
        familyNameInput.value = familyName;
          
        familyNameInput.dispatchEvent(event);
      }
      
      if (email && email !== 'null') {
        const emailInput = document.querySelector('input[name="email"]');
        emailInput.value = email;
        emailInput.disabled = true
        emailInput.style.backgroundColor = '#ddd';
        emailInput.style.color = '#777';
          
        emailInput.dispatchEvent(event);
      }
      
      if (tel && tel !== 'null') {
        const telInput = document.querySelector('input[name="tel"]');
        telInput.value = tel;
          
        telInput.dispatchEvent(event);
      }
    }
    
    const continueButton = document.querySelector('#am-continue-button');

    continueButton.addEventListener('click', updateFormValues);
  }
  
  window.addEventListener('load', () => {
    // Hide header
    document.querySelector('.inline-header').style.display = 'none';
      
    /**
     * From https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
     */
    
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('.amelia-booking');
    
    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };
    
    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      if (document.querySelector('#am-continue-button').length !== null) {
        autofillFunction();
      
        // Later, you can stop observing
        observer.disconnect();
      }
    };
    
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  })
})()
