import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import config from '../contract/config.json';

const MyPig = ({pig,kyuri,account,BtnLoad,connectWalletHandler,loadPig,theme,pigFee,searchName}:any) => {
  const [owner, setOwner] = useState<string | null>(null);
  const getOwner = async () => {
    const owner = await kyuri.ownerOf(pig.pigId);
    setOwner(owner.toLowerCase());
  }

  useEffect(() => {
    getOwner();
  }, [searchName]);

  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    targetAddress: "",
    tokenName: "",
    tokenImage: "",
  };
  
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const transferHandler = async () =>{
    setIsLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);
    const transaction = await contract["safeTransferFrom(address,address,uint256)"](account,values.targetAddress,pig.pigId);
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Pig Transferred!');

    connectWalletHandler();
    loadPig();
    getOwner();

  } catch (error) {
    console.log(error);
  }
    setIsLoading(false);
  };
  
  const [ensAddress, setEnsAddress] = useState<string | null>(null);

  const getAddressFromEns = async () =>{
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ensAddress = await provider.resolveName(values.targetAddress);
      setEnsAddress(ensAddress);
    } catch(err) {
        // console.log(err)
      }
    };
    useEffect(() => {
      getAddressFromEns();
    }, [values.targetAddress]);

  const modifyHandler = async () =>{
    setIsLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(config[network.chainId.toString()].gguf.address, config.abi, signer);

    const transaction = await contract.modifyPig(pig.pigId,values.tokenName,values.tokenImage,{value: pigFee});
    console.log("Submitted! Transaction ID: ", transaction.hash);
    await transaction.wait();
    console.log('Done! Pig Modified!');

    connectWalletHandler();
    loadPig();
    getOwner();
    
  } catch (error) {
    console.log(error);
  }
    setIsLoading(false);
  };

  return (
          <>
          {owner==account&&(
            <>
            <div className='m-1'>
              <h3 className='font-bold'>
              <img src={pig.image.slice(8, 12)=="ipfs"?`https://${pig.image.slice(21, 80)}.ipfs.dweb.link/${pig.image.slice(81, 88)}`:pig.image}  className='h-52 rounded-xl'/>
                {pig.name}
              </h3>

              <>
              <form>
                <input
                        name="tokenName"
                        type="string"
                        value={values.tokenName}
                        onChange={handleInputChange}
                        placeholder="Enter New Name"
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                      />
                  <br/>
                <input
                        name="tokenImage"
                        type="string"
                        value={values.tokenImage}
                        onChange={handleInputChange}
                        placeholder="Enter New Image URL"
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                      />
                  <br/>
              </form>
              {values.tokenName&&values.tokenImage?
              <button 
                className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
              onClick={modifyHandler}
              >{isLoading? <BtnLoad/> : "Modify"}</button>
              :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Modify</button>
              }
            </>

            <>
            <div className='py-2'></div>
            <input
              name="targetAddress"
              type="string"
              value={values.targetAddress}
              onChange={handleInputChange}
              placeholder="Paste Address/ENS"
              className="shadow appearance-none border rounded py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
            />{ethers.isAddress(values.targetAddress)?"✔️":(ensAddress&&"✔️")}
            <br/>
            {ethers.isAddress(values.targetAddress)||ensAddress?
              <button 
                className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} justify-center rounded-lg px-4 py-2 btn-width`}
              onClick={transferHandler}
              >{isLoading? <BtnLoad/> : "Send"}</button>
              :<button className='justify-center rounded-lg bg-slate-400 px-4 py-2 text-white btn-width' disabled>Send</button>
              }
            </>

            </div>
            </>
            )
          }
          </>
  );
}

export default MyPig;