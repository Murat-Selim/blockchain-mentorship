import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import GlobalStyles from "./styles/GlobalStyles";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <GlobalStyles />
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />
          <Route
            path="/"
            element={<HomePage />}
          />
        </Routes>
      </Router>
    </Web3ReactProvider>
  );
};

export default App;
