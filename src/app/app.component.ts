import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular JWT App';

  // Method to send a simulated JWT to the Vite LIT app
  sendJwtToLitApp() {
    console.log('Button clicked, trying to open new tab');
    const jwtToken = 'sample-jwt-token';
    const litAppUrl = 'http://localhost:5173'; // Vite-LIT app URL
  
    const litWindow = window.open(litAppUrl, '_blank'); // Open Vite-LIT app in a new tab
    if (!litWindow) {
      console.error('Failed to open the Vite-LIT app. Check popup blocker.');
      return;
    }
  
    let retries = 5; // Number of retries for sending the token
    let retryInterval = 1000; // 1 second interval between retries
  
    // Listen for messages from the Vite-LIT app to know when it's ready
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:5173') return; // Ensure message is from the correct app
  
      if (event.data === 'ready-for-jwt') {
        console.log('Vite-LIT app is ready, sending JWT...');
        litWindow.postMessage({ jwt: jwtToken }, 'http://localhost:5173'); // Send JWT when the app is ready
      }
    });
  
    // Retry mechanism to resend the JWT if the Vite-LIT app is not ready
    const resendJwt = () => {
      if (retries > 0) {
        console.log('Retrying to send JWT...');
        litWindow.postMessage({ jwt: jwtToken }, 'http://localhost:5173');
        retries--;
        setTimeout(resendJwt, retryInterval); // Retry after 1 second
      } else {
        console.error('Failed to send JWT after retries.');
      }
    };
  
    // Start retrying to send the JWT
    setTimeout(resendJwt, retryInterval);
  }
  
  
  
}
