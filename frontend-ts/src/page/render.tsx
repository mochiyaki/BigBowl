import { useEffect, useState } from 'react';
import Reader from './reader';

const Render = ({ArrowLoad,hash,gate,nature}:any) => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const callData = async() => {
    try {
    setIsLoading(true);
      // const data_call = await fetch(`https://${gate}/ipfs/${hash}/${file}.json`);
      // const data_call = await fetch(`https://${gate}/content/${hash}`);
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
  // const [copied, setCopied] = useState(false);

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
      />
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
        }).map((record: any) => {
        return(
          <Reader record={record} gate={gate} nature={nature} key={record.id}/>
        // <div className="w-4/5 sm:w-3/5 text-start" key={record.id}>
        //   <p className='text-lg font-bold py-2'>{record.title&&record.title}</p>
        //   {/* {record.command&&
        //     <div className='flex justify-right'>
        //       {record.command}<svg  onClick={() => {navigator.clipboard.writeText(record.command);setCopied(true)}} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //       <path d="M5.50282 4.62705L5.5 6.75V17.2542C5.5 19.0491 6.95509 20.5042 8.75002 20.5042L17.3663 20.5045C17.0574 21.3782 16.224 22.0042 15.2444 22.0042H8.75002C6.12667 22.0042 4 19.8775 4 17.2542V6.75C4 5.7693 4.62745 4.93512 5.50282 4.62705ZM17.75 2C18.9927 2 20 3.00735 20 4.25001V17.25C20 18.4926 18.9927 19.5 17.75 19.5H8.75002C7.50736 19.5 6.50002 18.4926 6.50002 17.25V4.25001C6.50002 3.00735 7.50736 2 8.75002 2H17.75ZM17.75 3.50001H8.75002C8.33581 3.50001 8.00002 3.8358 8.00002 4.25001V17.25C8.00002 17.6642 8.33581 18 8.75002 18H17.75C18.1642 18 18.5 17.6642 18.5 17.25V4.25001C18.5 3.8358 18.1642 3.50001 17.75 3.50001Z"/></svg>
        //       {copied&&"copied"}
        //     </div>}{record.command&&<p className='py-2'/>} */}
        //   {record.sentence1&&record.sentence1}{record.sentence1&&<p className='py-2'/>}
        //   {record.sentence2&&record.sentence2}{record.sentence2&&<p className='py-2'/>}
        //   {record.sentence3&&record.sentence3}{record.sentence3&&<p className='py-2'/>}
        //   {record.sentence4&&record.sentence4}{record.sentence4&&<p className='py-2'/>}
        //   {record.sentence5&&record.sentence5}{record.sentence5&&<p className='py-2'/>}
        //   {/* {record.hash&&record.file&&<img src={`https://${gate}/ipfs/${record.hash}/${record.file}`} className='w-64'/>}{record.hash&&<p className='py-1'/>} */}
        //     {record.hash1&&<div className="flex-container">
        //       {record.hash1&&<img src={`https://${gate}/content/${record.hash1}`} className='w-32'/>}
        //       {record.hash2&&<img src={`https://${gate}/content/${record.hash2}`} className='w-32'/>}
        //       {record.hash3&&<img src={`https://${gate}/content/${record.hash3}`} className='w-32'/>}
        //       {record.hash4&&<img src={`https://${gate}/content/${record.hash4}`} className='w-32'/>}
        //       {record.hash5&&<img src={`https://${gate}/content/${record.hash5}`} className='w-32'/>}
        //       {record.hash6&&<img src={`https://${gate}/content/${record.hash6}`} className='w-32'/>}
        //       {/* {record.hash1&&<img src={`https://${gate}/ipfs/${record.hash1}/${record.file1}`} className='w-32'/>}
        //       {record.hash2&&<img src={`https://${gate}/ipfs/${record.hash2}/${record.file2}`} className='w-32'/>}
        //       {record.hash3&&<img src={`https://${gate}/ipfs/${record.hash3}/${record.file3}`} className='w-32'/>}
        //       {record.hash4&&<img src={`https://${gate}/ipfs/${record.hash3}/${record.file4}`} className='w-32'/>}
        //       {record.hash5&&<img src={`https://${gate}/ipfs/${record.hash3}/${record.file5}`} className='w-32'/>}
        //       {record.hash6&&<img src={`https://${gate}/ipfs/${record.hash3}/${record.file6}`} className='w-32'/>} */}
        //     </div>}{record.hash1&&<p className='py-1'/>}
        //   {record.author&&record.author}{record.author&&<p className='py-2'/>}
        // </div>
        )
        })}
      </div>
    </>
  )
}

export default Render;