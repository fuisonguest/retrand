# Firebase Authentication Setup Guide

This guide provides comprehensive instructions for setting up Firebase Authentication in your application, replacing the previous Google OAuth implementation.

## Overview

The authentication system consists of two parts:
1. **Client-side**: Firebase Authentication for Google Sign-In
2. **Server-side**: Firebase Admin SDK for token verification

## Prerequisites

1. A Google account
2. A Firebase project
3. Node.js and npm installed

## Setup Steps

### 1. Client-Side Setup

#### 1.1 Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on "Add project" and follow the steps to create a new project.
3. Give your project a name and follow the setup wizard.

#### 1.2 Register Your Web App

1. In the Firebase Console, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings".
2. Scroll down to the "Your apps" section and click on the web icon (</>) to add a web app.
3. Register your app with a nickname (e.g., "OLX Clone").
4. Click "Register app".

#### 1.3 Get Your Firebase Configuration

After registering your app, Firebase will provide you with a configuration object. Copy this configuration.

#### 1.4 Update the Firebase Configuration in Your App

1. Open the file `client/src/firebase.js` in your project.
2. Replace the placeholder values in the `firebaseConfig` object with your actual Firebase configuration values.

#### 1.5 Enable Google Authentication

1. In the Firebase Console, go to "Authentication" from the left sidebar.
2. Click on the "Sign-in method" tab.
3. Click on "Google" in the list of providers.
4. Toggle the "Enable" switch to enable Google authentication.
5. Add your authorized domain (e.g., localhost for development).
6. Click "Save".

### 2. Server-Side Setup

#### 2.1 Generate a Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click on the gear icon (⚙️) next to "Project Overview" and select "Project settings".
4. Go to the "Service accounts" tab.
5. Click on "Generate new private key" button.
6. Save the JSON file securely. This file contains sensitive information.

#### 2.2 Set Up Environment Variables

For security reasons, it's recommended to use environment variables instead of directly including the service account key in your code.

1. Create a `.env` file in the root of your server directory (if it doesn't exist already).
2. Add the following environment variables:

```
GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account-key.json
```

Alternatively, you can set up the environment variable in your system:

- **Windows (PowerShell):**
  ```
  $env:GOOGLE_APPLICATION_CREDENTIALS="path\to\your-service-account-key.json"
  ```

- **Linux/macOS:**
  ```
  export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-service-account-key.json"
  ```

## Testing the Authentication

After completing the setup, you should be able to:

1. Start your client and server applications.
2. Click the "Sign in with Google" button in your application.
3. Select a Google account to sign in with.
4. Be redirected back to your application as an authenticated user.

## Troubleshooting

### Client-Side Issues

- If the Google Sign-In button doesn't appear, check your Firebase configuration in `firebase.js`.
- If authentication fails, check the browser console for error messages.
- Ensure that Google is enabled as a sign-in provider in your Firebase project.

### Server-Side Issues

- If you encounter an error like "Error: Failed to determine project ID", make sure your service account key file is correctly set up and the environment variable is pointing to the right file.
- If token verification fails, check that the token is being correctly passed from the client to the server.
- Ensure that the Firebase project used for the Admin SDK is the same as the one used for client-side authentication.

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Web SDK Documentation](https://firebase.google.com/docs/web/setup)
- [Google Sign-In Documentation](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Verify ID Tokens Documentation](https://firebase.google.com/docs/auth/admin/verify-id-tokens) 