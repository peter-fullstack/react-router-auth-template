import { PublicClientApplication } from '@azure/msal-browser'

const msalConfig = {
  auth: {
    clientId: 'bb47349e-e638-4a37-a082-fd2137bee380', // your client ID
    authority:
      'https://myobintegrationcustomers.ciamlogin.com/0dcb505d-c3a8-4a5e-945f-e900363cf2b6', // your tenant ID
    redirectUri: 'http://localhost:3000' // or your app's redirect URI
  },
  cache: {
    cacheLocation: 'localStorage', // or sessionStorage
    storeAuthStateInCookie: false
  }
}

export const msalInstance = new PublicClientApplication(msalConfig)
