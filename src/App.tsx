import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Navbar/Nav";
import ButtonComponent from "./ButtonComponent/ButtonComponent";
import Web3 from "web3";
// import detectEthereumProvider from "@metamask/detect-provider";

interface Custom extends Window {
  ethereum?: any;
  web3?: any;
}
// interface MetaMaskEthereumProviderExtended extends EthereumProvider {
//   request?: (args: any) => Promise<any>;
// }

declare let window: Custom;

function App() {
  const [userAccount, setUserAccount] = useState<string>("");

  const [userBalance, setUserBalance] = useState<string>("");

  const [contractBalance, setContractBalance] = useState("");

  const [web3Api, setWeb3Api] = useState<{
    provider: any;
    web3: Web3 | null;
  }>({ provider: null, web3: null });
  useEffect(() => {
    const loadProvider = async () => {
      // const provider = await detectEthereumProvider();
      // if (provider) {
      //   provider.request({ method: "eth_requestAccounts" });
      //   const web3 = new Web3(provider);
      //   setWeb3Api({ provider, web3 });
      // }
      let provider = null;
      if (window.ethereum) {
        console.log(window.ethereum);
        provider = window.ethereum;
        try {
          await provider.request({ method: "eth_requestAccounts" });
        } catch (e) {
          console.log(e);
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
        console.log(window.web3);
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545");
      }
      const web3 = new Web3(provider);
      setWeb3Api({ provider, web3 });
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAndSetAccount = async () => {
      if (web3Api.web3 === null) {
        console.log("provider is not set");
        return;
      }
      const accounts = await web3Api.web3.eth.getAccounts();
      console.log(web3Api.web3);
      console.log(accounts);
      console.log(accounts[0]);
      setUserAccount(accounts[0]);
      const balance = await web3Api.web3.eth.getBalance(accounts[0]);
      const balanceInEther = Web3.utils.fromWei(balance, "ether");
      console.log(typeof balanceInEther);
      setUserBalance(balanceInEther.substring(0, 6));
    };

    getAndSetAccount();
  }, [web3Api.web3]);

  const handleConnection = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  };

  console.log(web3Api);
  console.log(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"));

  return (
    <div className="App">
      <Nav />
      <h4>Balance: 20ETH</h4>
      <p>
        Account's Public Address:{" "}
        {userAccount ? userAccount : "Not Connected (Plz install metamask.)"}
      </p>
      <p>Account's Balance: {userBalance}</p>
      <ButtonComponent
        title="Connect to Wallet"
        handleOnClick={handleConnection}
      />
      <ButtonComponent title="Transfer" handleOnClick={handleConnection} />
      <ButtonComponent title="Withdraw" handleOnClick={handleConnection} />
    </div>
  );
}

export default App;
