import { Wallet } from '@gear-js/wallet-connect';
import logo from '../../../assets/images/icons/bookitnow.svg';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { getAccountAddress, idl, initializeSails } from '@/app/utils';
import Loader from '@/components/loader/Loader';

export function Header() {
  const location = useLocation();
  const isExplorePage = location.pathname === '/explore';

  const [contractBalance, setContractBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    const initialize = async () => {
      const parser = await SailsIdlParser.new();
      const sails = new Sails(parser);

      try {
        await initializeSails(sails);
        const accountAddress = await getAccountAddress();
        const contractBalanceShow: any =
          await sails.services.Events.queries.GetContractBalance(
            accountAddress
          );
        const tokenBalanceShow: any =
          await sails.services.Events.queries.GetMyBalance(accountAddress);

        setContractBalance(parseInt(contractBalanceShow.toString(), 16));
        setTokenBalance(parseInt(tokenBalanceShow.toString(), 16));
      } catch (e) {
        console.log('error:', e);
      }
    };

    initialize();
  }, [contractBalance, tokenBalance]);

  return (
    <header className='w-full h-[80px] flex flex-row justify-between items-center bg-[#0D1B2A]'>
      <div className='left flex items-center text-[#00adb5] gap-5 pl-8'>
        <img src={logo} alt='CrowdNet' />
        <Link to='/' className='text-[28px]'>
          CrowdNet
        </Link>
      </div>
      <div className='flex items-center gap-8 pr-8'>
        <Link
          to={isExplorePage ? '/host' : '/explore'}
          className='text-[28px] text-[#FFC947]'
        >
          {isExplorePage ? 'Host' : 'Explore'}
        </Link>
        <Link to='/tickets' className='text-[28px] text-[#FFC947]'>
          My Tickets
        </Link>
        <div className='flex flex-col items-end text-[#FFC947]'>
          <span className='text-[20px]'>
            Contract Balance: {contractBalance} TOKENS
          </span>
          <span className='text-[20px]'>My Balance: {tokenBalance} TOKENS</span>
        </div>
        <Wallet theme='gear' />
        {/* {isAccountVisible && <Wallet theme='vara' />} */}
        {/* <button className='bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-[19px] py-[14px] px-7 rounded-lg shadow-md'>

        </button> */}
      </div>
    </header>
  );
}
