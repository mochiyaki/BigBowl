import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CheckPig from './CheckPig';
import config from '../contract/config.json';

const PanelDog = ({ArrowLoad, BtnLoad, connectWalletHandler}:any) => {
    const [kyuri, setKyuri] = useState<any | null>(null);
    const [pigs, setPigs] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const loadShop = async () => {
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
      loadShop();
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
              {loading&&<div className='w-full h-full grid grid-cols-1 grid-rows-1 place-items-center'><ArrowLoad/>Loading...</div>}
              
              <div className='flex-container'>
                  {pigs.filter((pig)=>{
                    if (searchName == ""){
                      return pig
                    } else if (pig.name.toLowerCase().includes(searchName.toLowerCase())){
                      return pig
                    }
                  }).map((pig, index) => (
                  <CheckPig pig={pig} kyuri={kyuri} id={index + 1} key={index} BtnLoad={BtnLoad} connectWalletHandler={connectWalletHandler} loadShop={loadShop} searchName={searchName}/>
                  ))}
              </div>
        </>

    );
};

export default PanelDog;