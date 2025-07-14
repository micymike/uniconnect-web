// Custom Google OAuth implementation using environment variables
export const signInWithGoogleCustom = () => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google SDK not loaded'));
      return;
    }

    // Initialize Google Identity Services with FedCM support
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        try {
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          resolve({
            data: {
              user: {
                email: payload.email,
                name: payload.name,
                photo: payload.picture
              }
            }
          });
        } catch (error) {
          reject(error);
        }
      },
      // Enable FedCM to address the deprecation warnings
      use_fedcm_for_prompt: true
    });

    // Create a button element for Google Sign-In
    // This is a workaround for the prompt() method which is being deprecated
    const googleButton = document.createElement('div');
    googleButton.id = 'google-signin-button';
    googleButton.style.display = 'none';
    document.body.appendChild(googleButton);

    // Render the Google Sign-In button and click it programmatically
    window.google.accounts.id.renderButton(
      googleButton,
      { type: 'standard', theme: 'outline', size: 'large' }
    );
    
    // Simulate a click on the hidden button to trigger the sign-in flow
    setTimeout(() => {
      const buttonElement = googleButton.querySelector('div[role="button"]');
      if (buttonElement) {
        buttonElement.click();
      } else {
        // Fallback to the older prompt method if button rendering fails
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Clean up the temporary element
            document.body.removeChild(googleButton);
            reject(new Error('Google sign-in was cancelled or not displayed'));
          }
        });
      }
    }, 100);

    // Set up a timeout to clean up the temporary element
    setTimeout(() => {
      if (document.body.contains(googleButton)) {
        document.body.removeChild(googleButton);
      }
    }, 5000);
  });
};