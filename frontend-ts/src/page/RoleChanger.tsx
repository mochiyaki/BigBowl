import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../contract/config.json';

const RoleChanger = ({theme,BtnLoad,connectWalletHandler,isOwner,isClosed,pigFee,contractBalance}:any) => {
// const RoleChanger = ({theme,BtnLoad,connectWalletHandler,isOwner,isAdmin,isClosed}:any) => {

    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
      ownerAddress: "",
      // adminAddress: "",
      transferAmount: "",
      transferAddressTo: "",
      transferAmountTo: "",
      pig: "",
    };
    
    const [values, setValues] = useState(initialValues);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });
    };

  // const [contractBalance, setContractBalance] = useState<any | null>(null);
  // const loadContractBalance = async () => {
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   const signer = await provider.getSigner();
  //   const network = await provider.getNetwork();
  //   const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
  //   try {
  //     const contractBalance = await contract.getBalance();
  //     setContractBalance(ethers.formatEther(contractBalance));
  //   } catch(err) {
  //     console.log(err)
  //   }
  // };
  // useEffect(() => {
  //   loadContractBalance();
  // }, [])

  const withdrawHandler = async () =>{
    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);

  try{
    const tx = await contract.redeem(isOwner, ethers.parseUnits(contractBalance, "ether"));
    console.log("Submitted! Transaction ID: ", tx.hash);

    await tx.wait();
    console.log('Done! Fund Retrieved!');

    // loadContractBalance();
    connectWalletHandler();

  } catch(err) {
      console.log(err)
    }
    setIsLoading(false);
  };

  
  const transferEtherHandler = async () =>{
    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    try {
    const transaction = await contract.redeem(isOwner, ethers.parseUnits(values.transferAmount, "ether"));
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Ether Transferred!');

    connectWalletHandler();
    // loadContractBalance();
    
  } catch (error) {
    console.log(error);
  }
    setIsLoading(false);
  };

  const transferEtherToToHandler = async () =>{
    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    try {
    const transaction = await contract.redeem(values.transferAddressTo, ethers.parseUnits(values.transferAmountTo, "ether"));
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Ether Transferred!');

    connectWalletHandler();
    // loadContractBalance();
    
  } catch (error) {
    console.log(error);
  }
    setIsLoading(false);
  };

  const [ensAddress, setEnsAddress] = useState<string | null>(null);
  
  const getAddressFromEns = async () =>{
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ensAddress = await provider.resolveName(values.ownerAddress);
      setEnsAddress(ensAddress);
    } catch(err) {
        // console.log(err)
      }
    };
  
    useEffect(() => {
      getAddressFromEns();
    }, [values.ownerAddress]);

    const [ensTransfer, setEnsTransfer] = useState<string | null>(null);
    const getAddressFromEnsTransfer = async () =>{
      try{
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ensTransfer = await provider.resolveName(values.transferAddressTo);
        setEnsTransfer(ensTransfer);
      } catch(err) {
          // console.log(err)
        }
      };
    
      useEffect(() => {
        getAddressFromEnsTransfer();
      }, [values.transferAddressTo]);

    const ownerHandler = async () =>{
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
  
    try{
      const tx = await contract.changeOwner(values.ownerAddress);
      console.log("Submitted! Transaction ID: ", tx.hash);
  
      await tx.wait();
      console.log('Done! Ownership Transferred!');
  
      connectWalletHandler();
  
    } catch(err) {
        console.log(err)
      }
      setIsLoading(false);
    };

    // const adminHandler = async () =>{
    //   setIsLoading(true);
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   const signer = await provider.getSigner();
    //   const network = await provider.getNetwork();
    //   const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    // try{
    //   const tx = await contract.assignAdmin(values.adminAddress);
    //   console.log("Submitted! Transaction ID: ", tx.hash);
    //   await tx.wait();
    //   console.log('Done! Admin Address Assigned!');
    //   connectWalletHandler();
    // } catch(err) {
    //     console.log(err)
    //   }
    //   setIsLoading(false);
    // };
    // const [copyAdmin, setCopyAdmin] = useState(false);

    const [copyOwner, setCopyOwner] = useState(false);

    const closeHandler = async () =>{
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    try{
      const tx = await contract.closeShop(true);
      console.log("Submitted! Transaction ID: ", tx.hash);
  
      await tx.wait();
      console.log('Done! Shop Closed!');
  
      connectWalletHandler();
  
    } catch(err) {
        console.log(err)
      }
      setIsLoading(false);
    };

    const openHandler = async () =>{
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    try{
      const tx = await contract.closeShop(false);
      console.log("Submitted! Transaction ID: ", tx.hash);
  
      await tx.wait();
      console.log('Done! Shop Opened!');
  
      connectWalletHandler();
  
    } catch(err) {
        console.log(err)
      }
      setIsLoading(false);
    };

    const pigFeeHandler = async () =>{
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
  
    try{
      let priceInEth = ethers.parseEther(values.pig);
      const tx = await contract.setPigFee(priceInEth);
      console.log("Submitted! Transaction ID: ", tx.hash);
  
      await tx.wait();
      console.log('Done! Administration Fee Applied!');
  
      connectWalletHandler();
  
    } catch(err) {
        console.log(err)
      }
      setIsLoading(false);
    };

    return(
        <>
        <div className='py-10'></div>

  <div className='flex justify-center'>
    {isOwner&&(isOwner.slice(0, 6)+'...'+isOwner.slice(38, 42))}
      <svg  onClick={() => {navigator.clipboard.writeText(isOwner);setCopyOwner(true)}} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.50282 4.62705L5.5 6.75V17.2542C5.5 19.0491 6.95509 20.5042 8.75002 20.5042L17.3663 20.5045C17.0574 21.3782 16.224 22.0042 15.2444 22.0042H8.75002C6.12667 22.0042 4 19.8775 4 17.2542V6.75C4 5.7693 4.62745 4.93512 5.50282 4.62705ZM17.75 2C18.9927 2 20 3.00735 20 4.25001V17.25C20 18.4926 18.9927 19.5 17.75 19.5H8.75002C7.50736 19.5 6.50002 18.4926 6.50002 17.25V4.25001C6.50002 3.00735 7.50736 2 8.75002 2H17.75ZM17.75 3.50001H8.75002C8.33581 3.50001 8.00002 3.8358 8.00002 4.25001V17.25C8.00002 17.6642 8.33581 18 8.75002 18H17.75C18.1642 18 18.5 17.6642 18.5 17.25V4.25001C18.5 3.8358 18.1642 3.50001 17.75 3.50001Z"/>
      </svg>
    {copyOwner&&"copied"}
  </div>

  <form>
     <input
        name="ownerAddress"
        type="string"
        value={values.ownerAddress}
        onChange={handleInputChange}
        placeholder="Paste Address/ENS"
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
      />{ethers.isAddress(values.ownerAddress)?"✔️":(ensAddress&&"✔️")}
      <br/>
  </form>

  {ethers.isAddress(values.ownerAddress)||ensAddress?
  <button 
    // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
    className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
    onClick={ownerHandler}>{isLoading? <BtnLoad/> : "Transfer"}</button>
  :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Transfer</button>
  }

  {/* <div className='py-2'></div>
  <div className='flex justify-center'>
    {isAdmin&&(isAdmin.slice(0, 6)+'...'+isAdmin.slice(38, 42))}
      <svg  onClick={() => {navigator.clipboard.writeText(isAdmin);setCopyAdmin(true)}} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.50282 4.62705L5.5 6.75V17.2542C5.5 19.0491 6.95509 20.5042 8.75002 20.5042L17.3663 20.5045C17.0574 21.3782 16.224 22.0042 15.2444 22.0042H8.75002C6.12667 22.0042 4 19.8775 4 17.2542V6.75C4 5.7693 4.62745 4.93512 5.50282 4.62705ZM17.75 2C18.9927 2 20 3.00735 20 4.25001V17.25C20 18.4926 18.9927 19.5 17.75 19.5H8.75002C7.50736 19.5 6.50002 18.4926 6.50002 17.25V4.25001C6.50002 3.00735 7.50736 2 8.75002 2H17.75ZM17.75 3.50001H8.75002C8.33581 3.50001 8.00002 3.8358 8.00002 4.25001V17.25C8.00002 17.6642 8.33581 18 8.75002 18H17.75C18.1642 18 18.5 17.6642 18.5 17.25V4.25001C18.5 3.8358 18.1642 3.50001 17.75 3.50001Z"/>
      </svg>
    {copyAdmin&&"copied"}
  </div>
  <form>
     <input
        name="adminAddress"
        type="string"
        value={values.adminAddress}
        onChange={handleInputChange}
        placeholder="Paste Address/ENS"
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
      />{ethers.isAddress(values.adminAddress)?"✔️":(ensAddressAdmin&&"✔️")}
      <br/>
  </form>
  <button 
    // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
    className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
    onClick={adminHandler}>{isLoading? <BtnLoad/> : "Assign Adim"}</button> */}
 <div className='py-2'></div>

🐷{pigFee>0&&parseFloat(ethers.formatEther(pigFee))+"🏷"}
    <br/>
    
    <form>
 <input
    name="pig"
    type="number"
    value={values.pig}
    onChange={handleInputChange}
    placeholder="Enter Amount"
    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
  />
  <br/>
</form>

<button 
  // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
  className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
  onClick={pigFeeHandler}>{isLoading? <BtnLoad/> : "Apply"}</button>
  
  <div className='py-2'></div>

  {isClosed?"🔴":"🟢"}
  <br/>
  {isClosed?
  <button 
  // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
  className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
  onClick={openHandler}>{isLoading? <BtnLoad/> : "Open"}</button>
  :
  <button 
  // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
  className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
  onClick={closeHandler}>{isLoading? <BtnLoad/> : "Close"}</button>
  }

        <>
        <div className='py-2'></div>
        {/* {contractBalance>0&&"💰"+parseFloat(contractBalance)+"🤖"} */}
        🤖{contractBalance>0&&parseFloat(contractBalance)+"💰"}
        <br/>
        {contractBalance>0?<button 
          // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
          className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
          onClick={withdrawHandler}>{isLoading? <BtnLoad/> : "Withdraw All"}</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Unavailable</button>}
        <div className='py-2'></div>
        </>

        <>
        <div className='flex-container'>
        <div className='flex'>
        <input
          name="transferAmount"
          type="number"
          value={values.transferAmount}
          onChange={handleInputChange}
          placeholder="Enter Amount"
          className="shadow appearance-none border rounded py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
        />{parseFloat(values.transferAmount)>0&&parseFloat(values.transferAmount)<=parseFloat(contractBalance)&&"✔️"}
        </div></div>
        {contractBalance>0?<button 
          // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
          className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
          onClick={() => transferEtherHandler()}>{isLoading? <BtnLoad/> : "Withdraw"}</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Unavailable</button>}
        <div className='py-2'></div>
        </>

        <>
        <div className='flex-container'>
        <div className='flex'>
        <input
          name="transferAddressTo"
          type="string"
          value={values.transferAddressTo}
          onChange={handleInputChange}
          placeholder="Paste Address/ENS"
          className="shadow appearance-none border rounded py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
        />{ethers.isAddress(values.transferAddressTo)?"✔️":(ensTransfer&&"✔️")}
        </div></div>
        <div className='flex-container'>
        <div className='flex'>
        <input
          name="transferAmountTo"
          type="number"
          value={values.transferAmountTo}
          onChange={handleInputChange}
          placeholder="Enter Amount"
          className="shadow appearance-none border rounded py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
        />{parseFloat(values.transferAmountTo)>0&&parseFloat(values.transferAmountTo)<=parseFloat(contractBalance)&&"✔️"}
        </div></div>
        {contractBalance>0?<button 
          // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
          className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
          onClick={() => transferEtherToToHandler()}>{isLoading? <BtnLoad/> : "Withdraw"}</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Unavailable</button>}
        </>

        </>
    );
}

export default RoleChanger;