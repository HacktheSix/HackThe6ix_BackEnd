import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-b2t3uuljuttljp5w.us.auth0.com"
      clientId="i7krLmM0fGMfZSbvrmIblZg2YLtPo6Xb"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/dashboard",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      skipRedirectCallback={false}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
