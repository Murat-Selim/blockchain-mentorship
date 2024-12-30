import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

// Contract ABI - Deploy edildikten sonra güncellenecek
const MentorshipSystemABI = [];

interface Web3ContextType {
  account: string | null;
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  loading: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  contract: null,
  provider: null,
  connectWallet: async () => {},
  loading: false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [loading, setLoading] = useState(false);

  // Contract address - Deploy edildikten sonra güncellenecek
  const contractAddress = "";

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        
        const contract = new ethers.Contract(
          contractAddress,
          MentorshipSystemABI,
          signer
        );

        setAccount(accounts[0]);
        setContract(contract);
        setProvider(provider);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider value={{ account, contract, provider, connectWallet, loading }}>
      {children}
    </Web3Context.Provider>
  );
}; 