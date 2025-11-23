
import { useEffect, useState } from 'react';

const CheckPig = ({pig,kyuri,searchName}:any) => {
  const [owner, setOwner] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const getOwner = async () => {
      const owner = await kyuri.ownerOf(pig.pigId);
      setOwner(owner);
  }
  useEffect(() => {
    getOwner();
  }, [searchName]);

  return (
    <>
    <div className='m-1'>
        <h3 className='font-bold'>
            <img src={pig.image.slice(8, 12)=="ipfs"?`https://${pig.image.slice(21, 80)}.ipfs.dweb.link/${pig.image.slice(81, 88)}`:pig.image}  className='h-32 rounded-xl'/>
            {pig.name}
        </h3>

        <small>
             <div className='flex justify-center'>
                Owner: {owner&&(owner.slice(0, 6)+'...'+owner.slice(38, 42))}
                <svg  onClick={() => {navigator.clipboard.writeText(owner);setCopied(true)}} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.50282 4.62705L5.5 6.75V17.2542C5.5 19.0491 6.95509 20.5042 8.75002 20.5042L17.3663 20.5045C17.0574 21.3782 16.224 22.0042 15.2444 22.0042H8.75002C6.12667 22.0042 4 19.8775 4 17.2542V6.75C4 5.7693 4.62745 4.93512 5.50282 4.62705ZM17.75 2C18.9927 2 20 3.00735 20 4.25001V17.25C20 18.4926 18.9927 19.5 17.75 19.5H8.75002C7.50736 19.5 6.50002 18.4926 6.50002 17.25V4.25001C6.50002 3.00735 7.50736 2 8.75002 2H17.75ZM17.75 3.50001H8.75002C8.33581 3.50001 8.00002 3.8358 8.00002 4.25001V17.25C8.00002 17.6642 8.33581 18 8.75002 18H17.75C18.1642 18 18.5 17.6642 18.5 17.25V4.25001C18.5 3.8358 18.1642 3.50001 17.75 3.50001Z"/>
                </svg>
                {copied&&"copied"}
             </div>
        </small>

    </div>
    </>
  );
}

export default CheckPig;