import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../contract/config.json';
import Item from './item';

const Free = ({ArrowLoad,gate,nature,BtnLoad,theme,connectWalletHandler,accountBalance,chainID,pigFee}:any) => {
  const [kyuri, setKyuri] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGasing, setIsGasing] = useState(false);
  const [gasFee, setGasFee] = useState<any | null>(null);
  const getFee = async () =>{
    try{
      setIsGasing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const gasFee = await provider.getFeeData();
      setGasFee(ethers.formatUnits(gasFee.gasPrice, 'gwei'));
    } catch(err) {
        console.log(err)
      }
      setIsGasing(false);
    };

  const loadPig = async () => {
    setIsLoading(true);
    try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const kyuri = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, provider);
    setKyuri(kyuri);

    } catch (error) {
      console.log(error);
    }
      setIsLoading(false);
  };

  useEffect(() => {
    loadPig();
    if (chainID=="1"){
      getFee();
    }
  }, [])

  const [data, setData] = useState([]);

  const callData = async() => {
    try {
    setIsLoading(true);

      const hash = "98cb59ee1d1c0582d9c7252c6e7d033d7f48a7faadfc655efecf4e5d4830ce3di1";
      const data_call = await fetch(`https://${gate}/${nature}/${hash}`);

      const data = await data_call.json();
      setData(data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
    };

    useEffect(() => {
      callData();
    }, []);

  const [searchTitle, setSearchTitle] = useState("");

  return (
    <>
     <div className='py-10'></div>

      <div className='flex justify-center'>
      🔎
      <input
        type="text"
        placeholder="Search..."
        onChange={(event) => {
          setSearchTitle(event.target.value)
        }}
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />{chainID=="5"&&"Görli might not work*"}
      {isGasing&&"⏳Gwei"}
      {gasFee&&"⛽"+parseInt(gasFee)}
      </div>

      {isLoading&&<br/>}
      {isLoading&&<div className='w-full h-full grid grid-cols-1 grid-rows-1 place-items-center'><ArrowLoad/>Loading...</div>}

      <div className="flex-container">
      {data.filter((record: any)=>{
          if (searchTitle == ""){
            return record
          } else if (record.title.toLowerCase().includes(searchTitle.toLowerCase())){
            return record
          }
        }).map((record, index: any) => {
        return(
          <Item record={record} key={index} BtnLoad={BtnLoad} theme={theme} connectWalletHandler={connectWalletHandler} accountBalance={accountBalance} kyuri={kyuri} pigFee={pigFee} loadPig={loadPig} gate={gate} nature={nature} chainID={chainID}/>
        )
        })}
      </div>
    </>
  )
}

export default Free;