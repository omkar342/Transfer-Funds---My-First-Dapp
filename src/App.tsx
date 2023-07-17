import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Navbar/Nav";
import ButtonComponent from "./ButtonComponent/ButtonComponent";
import Web3 from "web3";
// import detectEthereumProvider from "@metamask/detect-provider";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./Config/smartContractConfig";

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

  const [contractBalance, setContractBalance] = useState<string>("");

  const [contract, setContract] = useState<any>(null);

  const [contractAddress, setContractAddress] = useState<string | undefined>(
    ""
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [reload, setReload] = useState<boolean>(false);

  const [web3Api, setWeb3Api] = useState<{
    provider: any;
    web3: Web3 | null;
  }>({ provider: null, web3: null });

  const reloadEffect = () => setReload(!reload);

  useEffect(() => {
    const loadProvider = async () => {
      setLoading(true);
      // const provider = await detectEthereumProvider();
      // if (provider) {
      //   provider.request({ method: "eth_requestAccounts" });
      //   const web3 = new Web3(provider);
      //   setWeb3Api({ provider, web3 });
      //

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
        provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
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
      const fundsTransferContract = new web3Api.web3.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
      setContract(fundsTransferContract);
      setContractAddress(fundsTransferContract.options.address); // we can also adssign contract address in this way.
      const smartContractBalance = await web3Api.web3.eth.getBalance(
        CONTRACT_ADDRESS
      );
      const smartContractBalanceInEther = Web3.utils.fromWei(
        smartContractBalance,
        "ether"
      );
      console.log(smartContractBalanceInEther);
      setContractBalance(smartContractBalanceInEther.substring(0, 6));
      const accounts = await web3Api.web3.eth.getAccounts();
      setUserAccount(accounts[0]);
      const balance = await web3Api.web3.eth.getBalance(accounts[0]);
      const balanceInEther = Web3.utils.fromWei(balance, "ether");
      setUserBalance(balanceInEther.substring(0, 6));
      setLoading(false);
    };

    getAndSetAccount();
  }, [web3Api.web3, reload]);

  const handleConnection = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  };

  console.log(contractBalance);
  console.log(web3Api);
  console.log(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
  console.log(contract);
  console.log(typeof contract);
  {
    contract && console.log(contract._address);
  }
  console.log(contractAddress);
  {
    contract && console.log(contract.methods);
  }

  const transferFunds = async () => {
    if (contract !== null) {
      await contract.methods.transfer(CONTRACT_ADDRESS).send({
        from: userAccount,
        value: Web3.utils.toWei("2", "ether"),
      });
      reloadEffect();
    }
  };

  const withdrawFunds = async () => {
    if (contract !== null) {
      const withdrawAmount = Web3.utils.toWei("2", "ether");
      await contract.methods.withdraw(withdrawAmount).send({
        from: userAccount,
      });
      reloadEffect();
    }
  };

  const renderContent = (loading: boolean, value: string) => {
    if (loading) {
      return <span>Loading...</span>;
    } else if (value) {
      return <span>{value}</span>;
    } else {
      return <span>Not Connected (Please install MetaMask.)</span>;
    }
  };

  return (
    <div className="App">
      <Nav />
      <h4>Balance: 20ETH</h4>
      <p>Account's Public Address: {renderContent(loading, userAccount)}</p>
      <p>Account's Balance: {renderContent(loading, userBalance)}</p>
      <p>Contract's Balance: {renderContent(loading, contractBalance)}</p>
      <ButtonComponent
        title="Connect to Wallet"
        handleOnClick={handleConnection}
      />
      <ButtonComponent title="Transfer" handleOnClick={transferFunds} />
      <ButtonComponent title="Withdraw" handleOnClick={withdrawFunds} />
    </div>
  );
}

export default App;
