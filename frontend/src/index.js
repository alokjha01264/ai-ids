import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";

// Set axios to send cookies with every request
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
