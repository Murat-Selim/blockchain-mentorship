import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connectors";
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

const LogoContainer = styled.div`
  background-color: #61dafb;
  border-radius: 100%;
  width: 1.3rem;
`;
const Logo = styled.a`
  font-family: "Mountains of Christmas", serif !important;
  font-weight: 400;
  font-size: 1.5rem;
  width: 1rem;
  text-decoration: none;
  letter-spacing: 2px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Buttons = styled.div`
  display: flex;
  gap: 1rem;
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
      await activate(injected, undefined, true);
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

  // const handleSignUp = () => {
  //   navigate("/signup");
  // };

  return (
    <NavbarContainer>
      <LogoContainer>
        <Logo href="/">Mentorship Platform</Logo>
      </LogoContainer>
      <Buttons>
        {/* <Button onClick={handleSignUp}>Sign Up</Button> */}
        <button onClick={handleLogin}>Login</button>
        {active ? (
          <button
            className="disconnectwallet"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            className="connectwallet"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </Buttons>
    </NavbarContainer>
  );
};

export default Navbar;
