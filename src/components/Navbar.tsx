// import React, { useEffect } from "react";
// import { useWeb3React } from "@web3-react/core";
// import { injected } from "./wallet/connectors";

// const Navbar: React.FC = () => {
//   const { activate, account, deactivate, active, chainId, library } =
//     useWeb3React();

//   useEffect(() => {
//     const handleAccountsChanged = (accounts: string[]) => {
//       console.log("accountsChanged", accounts);
//       if (accounts.length > 0) {
//         activate(injected);
//       } else {
//         deactivate();
//       }
//     };

//     const handleChainChanged = (chainId: string) => {
//       console.log("chainChanged", chainId);
//       activate(injected);
//     };

//     if (library?.provider?.on) {
//       library.provider.on("accountsChanged", handleAccountsChanged);
//       library.provider.on("chainChanged", handleChainChanged);
//     }

//     return () => {
//       if (library?.provider?.removeListener) {
//         library.provider.removeListener(
//           "accountsChanged",
//           handleAccountsChanged
//         );
//         library.provider.removeListener("chainChanged", handleChainChanged);
//       }
//     };
//   }, [library, activate, deactivate]);

//   const connectWallet = async () => {
//     try {
//       await activate(injected, undefined, true); // The third parameter ensures a sign-in prompt
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   };

//   const disconnectWallet = () => {
//     try {
//       deactivate();
//     } catch (error) {
//       console.error("Error disconnecting wallet:", error);
//     }
//   };

//   const handleLogin = () => {
//     console.log("Login button clicked!");
//     // Implement login functionality
//   };

//   const handleSignUp = () => {
//     console.log("Sign-Up button clicked!");
//     // Implement sign-up functionality
//   };

//   return (
//     <nav className="Navbar">
//       <div className="logo">Mentorship Platform</div>
//       <div className="buttons">
//         <button onClick={handleSignUp}>Sign Up</button>
//         <button onClick={handleLogin}>Login</button>
//         {active ? (
//           <button
//             className="disconnectwallet"
//             onClick={disconnectWallet}
//           >
//             Disconnect Wallet
//           </button>
//         ) : (
//           <button
//             className="connectwallet"
//             onClick={connectWallet}
//           >
//             Connect Wallet
//           </button>
//         )}
//       </div>
//       {/* {active && (
//           <>
//             <span className="account">{account}</span>
//             <br />
//             <br />
//             <span className="chainid">{chainId}</span>
//           </>
//         )} */}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./wallet/connectors";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #282c34;
  color: white;
`;

const Logo = styled.div`
  font-size: 1.5rem;
`;

const Buttons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: #61dafb;
  border: none;
  padding: 0.5rem 1rem;
  color: black;
  cursor: pointer;

  &:hover {
    background-color: #21a1f1;
  }
`;

const Navbar: React.FC = () => {
  const { activate, account, deactivate, active, chainId, library } =
    useWeb3React();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      console.log("accountsChanged", accounts);
      if (accounts.length > 0) {
        activate(injected);
      } else {
        deactivate();
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log("chainChanged", chainId);
      activate(injected);
    };

    if (library?.provider?.on) {
      library.provider.on("accountsChanged", handleAccountsChanged);
      library.provider.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (library?.provider?.removeListener) {
        library.provider.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        library.provider.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [library, activate, deactivate]);

  const connectWallet = async () => {
    try {
      await activate(injected, undefined, true); // The third parameter ensures a sign-in prompt
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    console.log("Sign-Up button clicked!");
    // Implement sign-up functionality
  };

  return (
    <NavbarContainer>
      <Logo>Mentorship Platform</Logo>
      <Buttons>
        <Button onClick={handleSignUp}>Sign Up</Button>
        <Button onClick={handleLogin}>Login</Button>
        {active ? (
          <Button
            className="disconnectwallet"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        ) : (
          <Button
            className="connectwallet"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </Buttons>
    </NavbarContainer>
  );
};

export default Navbar;
