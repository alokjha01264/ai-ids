import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Wizard from "./components/Wizard/Wizard";
import AlertsPage from "./components/AlertsPage"; // create if needed
import axios from "axios";

// Set axios to send cookies with every request
axios.defaults.withCredentials = true;

// ProtectedRoute as before
const isAuthenticated = async () => {
  try {
    await axios.get("/profile");
    return true;
  } catch {
    return false;
  }
};

function ProtectedRoute({ children }) {
  const [auth, setAuth] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    isAuthenticated().then(val => mounted && setAuth(val));
    return () => { mounted = false; };
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return auth ? children : <Navigate to="/login" />;
}

// This is the key: useLocation to hide Navbar on login/signup
function AppLayout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/wizard"
            element={
              <ProtectedRoute>
                <Wizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my_alerts"
            element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/wizard" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
