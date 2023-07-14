import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Navbar/Nav";
import ButtonComponent from "./ButtonComponent/ButtonComponent";
import Web3 from "web3";

interface Custom extends Window {
  ethereum?: any;
  web3?: any;
}

declare let window: Custom;

function App() {
  const [web3Api, setWeb3Api] = useState<{
    provider: null | any;
    web3: null | Web3;
  }>({ provider: null, web3: null });
  useEffect(() => {
    const loadProvider = async () => {
      let provider;
      if (window.ethereum) {
        console.log(window.ethereum);
        provider = window.ethereum;
        try {
          await provider.enable();
          console.log("it opens");
        } catch (e) {
          console.log(e);
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
        console.log(window.web3);
        console.log("it is not ");
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      }
      const web3 = new Web3(provider);
      setWeb3Api({ provider, web3 });
    };
    loadProvider();
  }, []);

  const handleConnection = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const acc = await window.ethereum.enable();
    console.log(acc);
    console.log(accounts);
  };

  console.log(web3Api);

  return (
    <div className="App">
      <Nav />
      <h4>Balance: 20ETH</h4>
      <p>Account Public Address: 0x000000</p>
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
