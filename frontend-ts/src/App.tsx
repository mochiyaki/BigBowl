
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BtnLoad, ArrowLoad } from './components';
import { ethers } from 'ethers';
import config from './contract/config.json';
// import { Navbar, Welcome, Free, Owned, RoleChanger, PanelDog, Bank, Agent, Agent1, Agent2, Agent3, Agent4, Agent5, Super } from './page';
import { Navbar, Welcome, Free, Owned, RoleChanger, PanelDog, Bank, Agent1, Agent2, Agent3, Agent4, Agent5, Super } from './page';
// import { BtnLoad, ArrowLoad, DropZone, ProgressBar } from './components';
// import { Navbar, Welcome, Free, Owned, RoleChanger, PanelDog, Bank, Draw, Edit, EditPlus } from './page';

function App() {
  
  // ordinals indexer***
  const gate = "test.gguf.org";
  // const gate = "gguf.us";
  // content/test
  const nature = "content"
  // const nature = "test";
  // const gate = "ord-testnet.xverse.app";
  // const gate = "testnet-explorer.ordinalsbot.com";

  // ipfs gateway***
  // const nature = "ipfs";
  // const gate = "ipfs.io";
  // const gate = "w3s.link";
  // const gate = "dweb.link";

  const [theme, setTheme] = useState('light');
  // const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // ethers operator***
  const [provider, setProvider] = useState<any | null>(null);
  const [chainID, setChainID] = useState<any | null>(null);
  const [account, setAccount] = useState(null);
  const [ensName, setEnsName] = useState<any | null>(null);
  const [ensAvatar, setEnsAvatar] = useState(null);
  const [accountBalance, setAccountBalance] = useState<any | null>(null);
  const [nftBalance, setNftBalance] = useState<any | null>(null);
  const [contractBalance, setContractBalance] = useState<any | null>(null);
  const [isOwner, setIsOwner] = useState("");
  // const [isAdmin, setIsAdmin] = useState("");
  const [pigFee, setPigFee] = useState("");
  const [isClosed, setIsClosed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      setInstalled(true);
    } else {
      return;
    }
  }, []);

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    try {
    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, provider);
    setChainID(network.chainId.toString());

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0].toLowerCase());

      const accountBalance = await provider.getBalance(accounts[0]);
      setAccountBalance(ethers.formatEther(accountBalance));
      
      const nftBalance = await contract.balanceOf(accounts[0]);
      setNftBalance(parseInt(nftBalance));

      const contractBalance = await contract.getBalance();
      setContractBalance(ethers.formatEther(contractBalance));

      const isOwner = await contract.owner();
      setIsOwner(isOwner.toLowerCase());

      // const isAdmin = await contract.admin();
      // setIsAdmin(isAdmin.toLowerCase());

      const pigFee = await contract.pigFee();
      setPigFee(pigFee);

      const isClosed = await contract.isClosed();
      setIsClosed(isClosed);

    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
   };

  // const [gasFee, setGasFee] = useState<any | null>(null);
  // const getFee = async () =>{
  //   try{
  //     const gasFee = await provider.getFeeData();
  //     setGasFee(ethers.formatUnits(gasFee.gasPrice, 'gwei'));
  //     // setGasFee(ethers.formatEther(gasFee.gasPrice));
  //   } catch(err) {
  //       console.log("cannot estimate gas fee")
  //     }
  //   };
  
   const getEnsName = async () => {
       try {
         const ensName = await provider.lookupAddress(account);
         setEnsName(ensName);
         const resolver =  ensName? await provider.getResolver(ensName) : null;
         const avatar = resolver? await resolver._getAvatar() : null;
         setEnsAvatar(avatar.url);
       } catch(err) {
         console.log("No Avatar Detected!");
       }
     };
 
   useEffect(() => {
     if (account){
    //  getFee();
     getEnsName();
    //  console.log("Loading Avatar..");
     }
   }, [account]);

  function refreshPage() {
    window.location.reload();
  };

  return (
  <HashRouter>
    <Navbar theme={theme} toggleTheme={toggleTheme} installed={installed} isLoading={isLoading} account={account} refreshPage={refreshPage} ensName={ensName} ensAvatar={ensAvatar} accountBalance={accountBalance} connectWalletHandler={connectWalletHandler} BtnLoad={BtnLoad} isOwner={isOwner} nftBalance={nftBalance} contractBalance={contractBalance} chainID={chainID} isClosed={isClosed}/>
    {/* <Navbar theme={theme} toggleTheme={toggleTheme} installed={installed} isLoading={isLoading} account={account} isAdmin={isAdmin} refreshPage={refreshPage} ensName={ensName} ensAvatar={ensAvatar} accountBalance={accountBalance} connectWalletHandler={connectWalletHandler} BtnLoad={BtnLoad} isOwner={isOwner} nftBalance={nftBalance} chainID={chainID} isClosed={isClosed}/> */}
    <Routes>
      <Route path='*' element={<Welcome ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>
      <Route path="/" element={<Welcome ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>

      {/* <Route path="/Agent" element={<Agent/>}/> */}
      
      {/* <Route path="/cgg" element={<Cgg ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>
      <Route path="/connector" element={<Connector ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>
      <Route path="/llama" element={<Lime ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>
      <Route path="/core" element={<Core ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>
      <Route path="/callgg" element={<Callgg ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/>
      <Route path="/selector" element={<Selector ArrowLoad={ArrowLoad} gate={gate} nature={nature}/>}/> */}

      {/* {account&&(!isClosed&&<Route path="/shop" element={<Free ArrowLoad={ArrowLoad} gate={gate} BtnLoad={BtnLoad} theme={theme} connectWalletHandler={connectWalletHandler} accountBalance={accountBalance} chainID={chainID} pigFee={pigFee}/>}/>)} */}
      {/* {account&&(!isClosed&&<Route path="/container" element={<Free ArrowLoad={ArrowLoad} gate={gate} nature={nature} BtnLoad={BtnLoad} theme={theme} connectWalletHandler={connectWalletHandler} accountBalance={accountBalance} chainID={chainID} pigFee={pigFee}/>}/>)} */}
      {/* {account&&(!isClosed&&<Route path="/transformer" element={<Free ArrowLoad={ArrowLoad} gate={gate} nature={nature} BtnLoad={BtnLoad} theme={theme} connectWalletHandler={connectWalletHandler} accountBalance={accountBalance} chainID={chainID} pigFee={pigFee}/>}/>)} */}
      {account&&(!isClosed&&<Route path="/shop" element={<Free ArrowLoad={ArrowLoad} gate={gate} nature={nature} BtnLoad={BtnLoad} theme={theme} connectWalletHandler={connectWalletHandler} accountBalance={accountBalance} chainID={chainID} pigFee={pigFee}/>}/>)}
      {nftBalance>0&&<Route path="/owned" element={<Owned theme={theme} ArrowLoad={ArrowLoad} account={account} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} pigFee={pigFee} nftBalance={nftBalance}/>}/>}

      {account&&(chainID=="1"||chainID=="10"||chainID=="8453"||chainID=="42161"||chainID=="43114"||chainID=="137"||chainID=="56"||chainID=="11155111"||chainID=="17000"||chainID=="84532"||chainID=="421614"||chainID=="11155420"||chainID=="59141"||chainID=="80002"||chainID=="10200"||chainID=="59144"||chainID=="42220"||chainID=="81457"||chainID=="534352"||chainID=="168587773"||chainID=="534351"||chainID=="7777777"||chainID=="2021"||chainID=="7001"||chainID=="7000"||chainID=="250"||chainID=="100"||chainID=="97"||chainID=="560048")&&<Route path="/bank" element={<Bank theme={theme} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} account={account} accountBalance={accountBalance}/>}/>}

      {/* {account&&(!isClosed&&<Route path="/Shop" element={<ShopPig theme={theme} ArrowLoad={ArrowLoad} BtnLoad={BtnLoad} account={account} connectWalletHandler={connectWalletHandler} accountBalance={accountBalance} chainID={chainID}/>} />)}
      {account==isAdmin&&<Route path="/ListPig" element={<ListPig theme={theme} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler}/>} />}
      {account==isAdmin&&<Route path="/PanelEgg" element={<PanelEgg theme={theme} ArrowLoad={ArrowLoad} BtnLoad={BtnLoad} account={account} connectWalletHandler={connectWalletHandler} chainID={chainID}/>} />}
      {account==isOwner&&<Route path="/RoleChanger" element={<RoleChanger theme={theme} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} isOwner={isOwner} isAdmin={isAdmin} isClosed={isClosed}/>} />}
      {account==isOwner&&<Route path="/PanelPig" element={<PanelPig theme={theme} ArrowLoad={ArrowLoad} BtnLoad={BtnLoad} account={account} connectWalletHandler={connectWalletHandler} chainID={chainID}/>} />}
      {account==isOwner&&<Route path="/WithdrawFund" element={<WithdrawFund theme={theme} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} isOwner={isOwner}/>} />} */}

      {/* {nftBalance>0&&(chainID=="11155111"&&<Route path="/Audit" element={<Audit theme={theme} ArrowLoad={ArrowLoad}/>}/>)} */}
      {/* {nftBalance>0&&(chainID=="1"&&<Route path="/Draw" element={<Draw theme={theme} ArrowLoad={ArrowLoad}/>}/>)}
      {nftBalance>0&&(chainID=="1"&&<Route path="/Edit" element={<Edit theme={theme} ArrowLoad={ArrowLoad}/>}/>)}
      {nftBalance>0&&(chainID=="1"&&<Route path="/Plus" element={<EditPlus theme={theme} ArrowLoad={ArrowLoad} DropZone={DropZone}  ProgressBar={ProgressBar}/>}/>)} */}

      {/* <Route path="/Agent" element={<Agent/>}/> */}
      {nftBalance==1&&(chainID=="11155111"&&<Route path="/Agent1" element={<Agent1/>}/>)}
      {nftBalance==2&&(chainID=="11155111"&&<Route path="/Agent2" element={<Agent2/>}/>)}
      {nftBalance==3&&(chainID=="11155111"&&<Route path="/Agent3" element={<Agent3/>}/>)}
      {nftBalance==4&&(chainID=="11155111"&&<Route path="/Agent4" element={<Agent4/>}/>)}
      {nftBalance==5&&(chainID=="11155111"&&<Route path="/Agent5" element={<Agent5/>}/>)}
      {nftBalance>5&&(chainID=="11155111"&&<Route path="/Super" element={<Super/>}/>)}

      {account==isOwner&&<Route path="/Holder" element={<PanelDog ArrowLoad={ArrowLoad} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler}/>} />}
      {account==isOwner&&<Route path="/Panel" element={<RoleChanger theme={theme} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} isOwner={isOwner} isClosed={isClosed} pigFee={pigFee} contractBalance={contractBalance}/>} />}
    </Routes>
  </HashRouter>
  )
}

export default App;