// import React from "react";
// import "./App.css";
// import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <header className="App-header">
//         <h1>Your Path to Blockchain Mastery: Connect with Expert Mentors.</h1>
//         <p>Welcome to the Blockchain Mentorship Platform</p>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/"
            element={<HomePage />}
          />
        </Routes>
        <Footer />
      </Router>
    </Web3ReactProvider>
  );
};

export default App;
