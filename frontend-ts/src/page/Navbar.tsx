
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { EthLogo } from '../components';

const Navbar = ({theme, toggleTheme, installed, isLoading, account, refreshPage, ensName, ensAvatar, accountBalance, connectWalletHandler, BtnLoad, isOwner, nftBalance, contractBalance, chainID, isClosed}:any) => {
// const Navbar = ({theme, toggleTheme, installed, isLoading, account, isAdmin, refreshPage, ensName, ensAvatar, accountBalance, connectWalletHandler, BtnLoad, isOwner, nftBalance, chainID, isClosed}:any) => {

  const [toggle, setToggle] = useState(false);
  const connectWalletButton = () => {
    return (
    //   <button onClick={connectWalletHandler}  type="button" className="flex items-center rounded-lg bg-cyan-700 hover:bg-cyan-600 px-4 py-2 text-white btn-width">
      <button onClick={connectWalletHandler}  type="button" className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} flex items-center rounded-lg px-4 py-2 btn-width`}>
        {isLoading? <BtnLoad/> : "Connect"}
      </button>
    )
  };

    return (
    // <nav className="absolute top-6 right-3">
    <nav className="absolute top-3 right-3">
        <ul>
        <li>
        <div className='flex'>

            {theme=='light'?
            <svg onClick={toggleTheme} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
            </svg>
            :
            <svg onClick={toggleTheme} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            }

            {account&&<p className='text-xs'>{chainID=="1"||chainID=="10"||chainID=="8453"||chainID=="42161"||chainID=="56"||chainID=="137"||chainID=="1380012617"||chainID=="7777777"||chainID=="43114"||chainID=="59144"||chainID=="42220"||chainID=="81457"||chainID=="534352"||chainID=="7000"||chainID=="250"||chainID=="100"?"🟢":"🟣"}</p>}
            {account&&<p className='text-sm'>{chainID=="1"&&"Mainnet"}{chainID=="10"&&"Optimism"}{chainID=="42161"&&"Arbitrum"}{chainID=="8453"&&"Base"}{chainID=="5"&&"Görli"}{chainID=="11155111"&&"Sepolia"}{chainID=="17000"&&"Holesky"}{chainID=="59140"&&"Linea"}{chainID=="59141"&&"Linea"}{chainID=="59144"&&"Linea"}{chainID=="84532"&&"Base"}{chainID=="421614"&&"Arbitrum"}{chainID=="11155420"&&"Optimism"}{chainID=="97"&&"Binance"}{chainID=="56"&&"Binance"}{chainID=="168587773"&&"Blast"}{chainID=="81457"&&"Blast"}{chainID=="534351"&&"Scroll"}{chainID=="534352"&&"Scroll"}{chainID=="4002"&&"Fantom"}{chainID=="250"&&"Fantom"}{chainID=="43113"&&"Avalanche"}{chainID=="43114"&&"Avalanche"}{chainID=="80085"&&"Bera"}{chainID=="80002"&&"Amoy"}{chainID=="80001"&&"Mumbai"}{chainID=="137"&&"Polygon"}{chainID=="44787"&&"Celo"}{chainID=="42220"&&"Celo"}{chainID=="1918988905"&&"Rari"}{chainID=="1380012617"&&"Rari"}{chainID=="999999999"&&"Zora"}{chainID=="7777777"&&"Zora"}{chainID=="10200"&&"Gnosis"}{chainID=="100"&&"Gnosis"}{chainID=="1287"&&"Moonbase"}{chainID=="7701"&&"Canto"}{chainID=="1029"&&"Donau"}{chainID=="338"&&"Cronos"}{chainID=="2021"&&"Saigon"}{chainID=="7001"&&"Athens"}{chainID=="7000"&&"Zeta"}{chainID=="111557560"&&"Cyber"}{chainID=="1513"&&"Story"}{chainID=="2810"&&"Morph"}{chainID=="5003"&&"Mantle"}{chainID=="560048"&&"Hoodi"}</p>}
            {/* <p className='text-sm'>{account&&chainID=="1"?"Mainnet":(chainID=="5"?"Görli":(chainID=="59140"?"Linea":(chainID=="11155111"?"Sepolia":((chainID=="84532"?"Base":(chainID=="80001"?"Mumbai":(chainID=="80002"?"Amoy":(chainID=="17000"?"Holesky":""))))))))}</p> */}

            {ensName&&(ensAvatar? <img src={ensAvatar} className='avatar'/> : "")}

            {installed?
            <>
            {account? 
            <button onClick={refreshPage} className={`${theme=='light'?"text-white bg-black hover:bg-gray-700":"text-black bg-gray-200 hover:bg-white"} flex items-center rounded-lg px-4 py-2 btn-width`}>
            {ensName? ensName : account.slice(0, 6) + '...' + account.slice(38, 42)}
            </button>
            : connectWalletButton()}
            </>:""}

            </div>
        </li>
        <li>
        <div className='flex'>
            {account&&(chainID=="1"||chainID=="10"||chainID=="42161"||chainID=="8453"||chainID=="5"||chainID=="11155111"||chainID=="17000"||chainID=="59140"||chainID=="59141"||chainID=="59144"||chainID=="84532"||chainID=="421614"||chainID=="11155420"||chainID=="168587773"||chainID=="81457"||chainID=="534351"||chainID=="534352"||chainID=="1918988905"||chainID=="1380012617"||chainID=="7777777"||chainID=="999999999"||chainID=="560048")&&<EthLogo/>}
            {account&&parseFloat(accountBalance)}
            {nftBalance>0&&"🥣"+parseInt(nftBalance)}
            {/* {nftBalance>0&&"🦆"+parseInt(nftBalance)} */}
            {/* {nftBalance>0&&"🐷"+parseInt(nftBalance)} */}
            {/* {nftBalance>0&&parseInt(nftBalance)} */}
            {account==isOwner&&contractBalance>0&&"💰"+parseFloat(contractBalance)}
            {/* {account==isOwner&&contractBalance>0&&parseFloat(contractBalance)} */}
        </div>
        </li>
        </ul>
        
        <div className="absolute top-16 right-0">
            {toggle
            ? 
            <svg onClick={() => setToggle(!toggle)} className="w-[26px] h-[26px] object-contain" fill="currentColor" viewBox="0 0 145 145" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.84 138.051L136.633 10.8173" stroke="currentColor" strokeWidth="15" strokeMiterlimit="8"/>
                <path d="M134.27 136.988L10.5305 15.6233" stroke="currentColor" strokeWidth="15" strokeMiterlimit="8"/>
            </svg>
            : 
            <svg onClick={() => setToggle(!toggle)} className="w-[26px] h-[26px] object-contain" fill="currentColor" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3v2h-15v-2h15zM1 10h15v-2h-15v2zM1 15h15v-2h-15v2z"/>
            </svg>
            }

            <div className={`${!toggle ? "hidden" : "flex"} p-5 bg-current absolute top-5 right-0 mx-4 my-2 min-w-[100px] rounded-xl z-10`}>
                <ul className={`${theme=='light'?"text-white":"text-black"} list-none flex justify-end items-start flex-1 flex-col`}>

                    <li><Link to='/'>Welcome</Link></li>

                    <li>{nftBalance>0&&<Link to='/owned'>Portfolio</Link>}</li>
                    {/* <li>{account&&(!isClosed&&<Link to='/Free'>FREE</Link>)}</li> */}
                    {/* <li>{account&&(!isClosed&&<Link to='/shop'>lazyShop</Link>)}</li> */}
                    {/* <li>{account&&(!isClosed&&<Link to='/container'>Container</Link>)}</li> */}
                    {/* <li>{account&&(!isClosed&&<Link to='/container'>lazyShop</Link>)}</li> */}
                    {/* <li>{account&&(!isClosed&&<Link to='/transformer'>lazyShop</Link>)}</li> */}
                    <li>{account&&(!isClosed&&<Link to='/shop'>bigShop</Link>)}</li>

                    <li>{account&&(chainID=="1"||chainID=="10"||chainID=="8453"||chainID=="42161"||chainID=="43114"||chainID=="137"||chainID=="56"||chainID=="11155111"||chainID=="17000"||chainID=="84532"||chainID=="421614"||chainID=="11155420"||chainID=="59141"||chainID=="80002"||chainID=="10200"||chainID=="59144"||chainID=="42220"||chainID=="81457"||chainID=="534352"||chainID=="168587773"||chainID=="534351"||chainID=="7777777"||chainID=="2021"||chainID=="7001"||chainID=="7000"||chainID=="250"||chainID=="100"||chainID=="97"||chainID=="560048")&&<Link to='/bank'>bigBank</Link>}</li>

                    {/* <li><Link to='/Agent'>Agent(s)</Link></li> */}
                    <li>{nftBalance==1&&<Link to='/Agent1'>Agent1</Link>}</li>
                    <li>{nftBalance==2&&<Link to='/Agent2'>Agent2</Link>}</li>
                    <li>{nftBalance==3&&<Link to='/Agent3'>Agent3</Link>}</li>
                    <li>{nftBalance==4&&<Link to='/Agent4'>Agent4</Link>}</li>
                    <li>{nftBalance==5&&<Link to='/Agent5'>Agent5</Link>}</li>
                    <li>{nftBalance>5&&<Link to='/Super'>bigBowl</Link>}</li>
                    {/* <li><Link to='/cgg'>cgg</Link></li>
                    <li><Link to='/connector'>Connector</Link></li>
                    <li><Link to='/llama'>Llama</Link></li>
                    <li><Link to='/core'>Core</Link></li>
                    <li><Link to='/callgg'>callgg</Link></li>
                    <li><Link to='/selector'>Selector</Link></li> */}

                    {/* <li>{account&&(!isClosed&&<Link to='/Shop'>Shop</Link>)}</li> */}
                    {/* <li>{account==isAdmin&&<Link to='/PanelEgg'>EditPig</Link>}</li> */}
                    {/* <li>{account==isAdmin&&<Link to='/ListPig'>ListPig</Link>}</li> */}
                    {/* <li>{account==isOwner&&<Link to='/PanelPig'>PriceEditor</Link>}</li> */}
                    {/* <li>{account==isOwner&&<Link to='/WithdrawFund'>FundPanel</Link>}</li> */}
                    
                    {/* <li>{nftBalance>0&&(chainID=="1"&&<Link to='/Edit'>Edit</Link>)}</li>
                    <li>{nftBalance>0&&(chainID=="1"&&<Link to='/Plus'>Plus</Link>)}</li>
                    <li>{nftBalance>0&&(chainID=="1"&&<Link to='/Draw'>Draw</Link>)}</li> */}
                    {/* <li>{nftBalance>0&&(chainID=="11155111"&&<Link to='/Audit'>Audit</Link>)}</li> */}

                    <li>{account==isOwner&&<Link to='/Holder'>Holder</Link>}</li>
                    <li>{account==isOwner&&<Link to='/Panel'>Panel</Link>}</li>
                    
                </ul>
            </div>
        </div>
    </nav>
)
}

export default Navbar;