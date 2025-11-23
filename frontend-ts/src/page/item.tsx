import { useState } from 'react';
import { ethers } from 'ethers';
import { EthLogo } from '../components';

const Item = ({record,BtnLoad,theme,connectWalletHandler,accountBalance,kyuri,pigFee,loadPig,gate,nature,chainID}:any) => {
  const [buyLoading, setBuyLoading] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const image = `https://${gate}/${nature}/${record.hash}`

  const buyHandler = async () => {
    setBuyLoading(true)
    try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transaction = await kyuri.connect(signer).mint(record.title, image,{value: pigFee});
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Transaction Confirmed!');

    connectWalletHandler();
    loadPig();
    setIsSold(true);
    
  } catch (error) {
    console.log(error);
  }
    setBuyLoading(false);
  };


  return (
  <>
  {record.enable&&
  <div className='m-1' key={record.id}>

      <h3 className='font-bold'>
          {record.hash&&<img src={image} className='h-32 rounded-xl'/>}
          {record.title&&record.title}
      </h3>

      <h4 className='text-slate-500'><strong>{pigFee>0?<div className='flex justify-center'>{(chainID=="1"||chainID=="10"||chainID=="42161"||chainID=="8453"||chainID=="5"||chainID=="11155111"||chainID=="17000"||chainID=="59140"||chainID=="59141"||chainID=="59144"||chainID=="84532"||chainID=="421614"||chainID=="11155420"||chainID=="168587773"||chainID=="534351"||chainID=="534352"||chainID=="1918988905"||chainID=="81457"||chainID=="1380012617"||chainID=="999999999"||chainID=="7777777")&&<EthLogo/>}{parseFloat(ethers.formatEther(pigFee))}</div>:"FREE"}</strong></h4>

      {!isSold?
          accountBalance>0?
          <button
            className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
            onClick={() => buyHandler()}
          >
            {buyLoading ? <BtnLoad/>
                        : (
                          <span>{pigFee>0?"buyME":"Get"}</span>
                          )}
          </button>
          :
          <button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Unavailable</button>
        :
        <button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Minted</button>
      }

  </div>
  }
  </>
  );
}

export default Item;