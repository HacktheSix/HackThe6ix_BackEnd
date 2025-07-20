import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { supabase } from "./lib/supabase";
import "./App.css";

function App() {
  const { loginWithRedirect, logout } = useAuth0();
  const { user, supabaseUser, isAuthenticated, isLoading, error } =
    useSupabaseAuth();
  const [status, setStatus] = React.useState("checking...");

  React.useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from("users").select("count");
        if (error) throw error;
        setStatus("connected");
      } catch (error) {
        setStatus("connection failed");
        console.error(error);
      }
    }
    checkConnection();
  }, []);

  // Redirect to frontend dashboard after successful authentication
  React.useEffect(() => {
    if (isAuthenticated && user && supabaseUser) {
      // Pass user info to frontend via URL parameters
      const userParams = new URLSearchParams({
        name: user.name || '',
        email: user.email || '',
        picture: user.picture || '',
        auth0_id: user.sub || '',
        auth: 'true'
      });
      
      setTimeout(() => {
        window.location.href = `http://localhost:3001/dashboard?${userParams.toString()}`;
      }, 3000);
    }
  }, [isAuthenticated, user, supabaseUser]);

  if (isLoading) return <div className="loading">Loading...</div>;

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="error-section">
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <p>Please check your Supabase configuration.</p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Auth0 + Supabase Demo</h1>

        {!isAuthenticated ? (
          <div className="login-section">
            <h2>Welcome!</h2>
            <p>Please log in to access your profile and database.</p>
            <button className="login-btn" onClick={() => loginWithRedirect()}>
              Log In with Auth0
            </button>
          </div>
        ) : (
          <div className="profile-section">
            <div className="success-message">
              <h2>🎉 Login Successful!</h2>
              <p>
                Welcome back, <strong>{user.name}</strong>!
              </p>
              <p>✅ Authentication complete</p>
              <p>✅ User data synced with database</p>
              <p className="redirect-message">
                🚀 Redirecting to dashboard in 3 seconds...
              </p>
              <div className="user-preview">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="profile-picture-small"
                />
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
        <p>Connection status: {status}</p>
      </header>
    </div>
  );
}

export default App;
