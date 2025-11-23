import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MyPig from './MyPig';
import config from '../contract/config.json';

const Owned = ({theme,ArrowLoad,account,BtnLoad,connectWalletHandler,pigFee}:any) => {
    const [kyuri, setKyuri] = useState<any | null>(null);
    const [pigs, setPigs] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const loadPig = async () => {
      setLoading(true);
      try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const kyuri = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, provider);
      setKyuri(kyuri);
      const maxSupply = await kyuri.totalSupply();
      const pigs = [];
      for (var i = 1; i <= maxSupply; i++) {
        const pig = await kyuri.getPig(i);
        pigs.push(pig);
      };
      setPigs(pigs);

      } catch (error) {
        console.log(error);
      }
        setLoading(false);
    };
  
    useEffect(() => {
      loadPig();
    }, [])

    const [searchName, setSearchName] = useState("");

    return (
      <>
          <div className='py-10'></div>
          🔎
            <input
              type="text"
              placeholder="Search..."
              onChange={(event) => {
                setSearchName(event.target.value);
              }}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {/* {gasFee&&"⛽"+Math.round(gasFee*10)/10+"Gwei"} */}
            {loading&&<div className='w-full h-full grid grid-cols-1 grid-rows-1 place-items-center'><ArrowLoad/>Loading...</div>}
            
            <div className='flex-container'>
                {pigs.filter((pig)=>{
                  if (searchName == ""){
                    return pig
                  } else if (pig.name.toLowerCase().includes(searchName.toLowerCase())){
                    return pig
                  }
                }).map((pig, index) => (
                <MyPig pig={pig} kyuri={kyuri} id={index + 1} key={index} account={account} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} loadPig={loadPig} theme={theme} pigFee={pigFee} searchName={searchName}/>
                ))}
            </div>
      </>

  );
};

export default Owned;