import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../contract/bank.json';

const Bank = ({theme,BtnLoad,connectWalletHandler,account,accountBalance}:any) => {

    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
      depositAmount: "",
      transferAmount: "",
      transferAddressTo: "",
      transferAmountTo: "",
    };
    
    const [values, setValues] = useState(initialValues);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });
    };

  const [isFetching, setIsFetching] = useState(false);
  const [bankBalance, setBankBalance] = useState<any | null>(null);
  const loadBankBalance = async () => {
    setIsFetching(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    try {
      const bankBalance = await contract.balances(account);
      setBankBalance(ethers.formatEther(bankBalance));
    } catch(err) {
      console.log(err)
    }
    setIsFetching(false);
  };
  useEffect(() => {
    loadBankBalance();
  }, [])

  const depositHandler = async () =>{
    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    try {
    const transaction = await contract.deposit({value: ethers.parseUnits(values.depositAmount, "ether")});
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Deposit Order Completed!');

    connectWalletHandler();
    loadBankBalance();
    
  } catch (error) {
    console.log(error);
  }
    setIsLoading(false);
  };

  const withdrawHandler = async () =>{
    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);

  try{
    const tx = await contract.withdraw(account, ethers.parseUnits(bankBalance, "ether"));
    console.log("Submitted! Transaction ID: ", tx.hash);

    await tx.wait();
    console.log('Done! Fund Retrieved!');

    loadBankBalance();
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
    const transaction = await contract.withdraw(account, ethers.parseUnits(values.transferAmount, "ether"));
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Fund Transferred!');

    connectWalletHandler();
    loadBankBalance();
    
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
    const transaction = await contract.withdraw(values.transferAddressTo, ethers.parseUnits(values.transferAmountTo, "ether"));
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Fund Transferred!');

    connectWalletHandler();
    loadBankBalance();
    
  } catch (error) {
    console.log(error);
  }
    setIsLoading(false);
  };

  const [ensAddress, setEnsAddress] = useState<string | null>(null);

  const getAddressFromEns = async () =>{
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ensAddress = await provider.resolveName(values.transferAddressTo);
      setEnsAddress(ensAddress);
    } catch(err) {
        // console.log(err)
      }
    };
    useEffect(() => {
      getAddressFromEns();
    }, [values.transferAddressTo]);

    return(
        <>
        <div className='py-10'></div>

        <>
        💰
        <div className='flex-container'>
        <div className='flex'>
        <input
          name="depositAmount"
          type="number"
          value={values.depositAmount}
          onChange={handleInputChange}
          placeholder="Enter Amount"
          className="shadow appearance-none border rounded py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
        />{parseFloat(values.depositAmount)>0&&parseFloat(values.depositAmount)<=parseFloat(accountBalance)&&"✔️"}
        </div></div>
        {accountBalance>0?
        parseFloat(values.depositAmount)>0&&parseFloat(values.depositAmount)<=parseFloat(accountBalance)?<button 
          // className='justify-center rounded-lg bg-orange-600 hover:bg-orange-500 px-4 py-2 text-white btn-width'
          className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
          onClick={() => depositHandler()}>{isLoading? <BtnLoad/> : "Deposit"}</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Deposit</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Unavailable</button>}
        </>


        <>
        <div className='py-2'></div>
        {/* {bankBalance>0&&"🔐"+parseFloat(bankBalance)+"🤖"} */}
        🔐
        {isFetching&&"Fetching⏳"}
        {bankBalance>0&&parseFloat(bankBalance)+"🤖"}
        <br/>
        {/* {contractBalance>0&&"💰"+parseFloat(contractBalance)+"🤖"}<br/> */}

        {bankBalance>0?<button 
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
        />{parseFloat(values.transferAmount)>0&&parseFloat(values.transferAmount)<=parseFloat(bankBalance)&&"✔️"}
        </div></div>

        {bankBalance>0?
        parseFloat(values.transferAmount)>0&&parseFloat(values.transferAmount)<=parseFloat(bankBalance)?<button 
          className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
          onClick={() => transferEtherHandler()}>{isLoading? <BtnLoad/> : "Withdraw"}</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Withdraw</button>
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
        />{ethers.isAddress(values.transferAddressTo)?"✔️":(ensAddress&&"✔️")}
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
        />{parseFloat(values.transferAmountTo)>0&&parseFloat(values.transferAmountTo)<=parseFloat(bankBalance)&&"✔️"}
        </div></div>

        {bankBalance>0?
        (ethers.isAddress(values.transferAddressTo)||ensAddress)&&parseFloat(values.transferAmountTo)>0&&parseFloat(values.transferAmountTo)<=parseFloat(bankBalance)?
        <button 
          className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
          onClick={() => transferEtherToToHandler()}>{isLoading? <BtnLoad/> : "Send"}</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Send</button>
        :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Unavailable</button>}
        </>

        </>
    );
}

export default Bank;