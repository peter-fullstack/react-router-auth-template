import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "ef135db6-4729-4c5e-a0cc-0318be619a8f", // your client ID
    authority: "https://login.microsoftonline.com/77d7974c-b578-4225-bcfa-7907a2ed40bf", // your tenant ID
    redirectUri: "http://localhost:3000", // or your app's redirect URI
  },
  cache: {
    cacheLocation: "localStorage", // or sessionStorage
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);