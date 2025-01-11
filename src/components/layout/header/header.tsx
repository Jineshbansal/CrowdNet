import { Wallet } from '@gear-js/wallet-connect';
import logo from '../../../assets/images/icons/bookitnow.svg';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EventsCard } from '@/components/eventsCard';
import { GearApi } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { idl } from '@/app/utils';
import Loader from '@/components/loader/Loader';

interface Props {
  isAccountVisible: boolean;
}

export function Header({ isAccountVisible }: Props) {
  const location = useLocation();
  const isExplorePage = location.pathname === '/explore';

  const [contractBalance, setContractBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    const initialize = async () => {
      const parser = await SailsIdlParser.new();
      const sails = new Sails(parser);

      async function State() {
        console.log('hello');
        try {
          sails.parseIdl(idl);
          const gearApi = await GearApi.create({
            providerAddress: 'wss://testnet.vara.network',
          });
          sails.setApi(gearApi);
          sails.setProgramId(import.meta.env.VITE_APP_PROGRAM_ID);
          console.log('Program ID:', import.meta.env.VITE_APP_PROGRAM_ID);
          const alice = 'kGg5hTfRcyaYX6wUdpNi7hpbYLQPGdF85q96fGn21w6pkJu4w';
          const contractBalanceShow: any =
            await sails.services.Events.queries.GetContractBalance(
              alice,
              null,
              null
            );
          const tokenBalanceShow: any =
            await sails.services.Events.queries.GetMyBalance(alice, null, null);

          setContractBalance(parseInt(contractBalanceShow.toString(), 16));
          setTokenBalance(parseInt(tokenBalanceShow.toString(), 16));
        } catch (e) {
          console.log('error:', e);
        }
      }

      State();
    };

    initialize();
  }, [setContractBalance, setTokenBalance]);

  return (
    <header className='w-full h-[80px] flex flex-row justify-between items-center bg-[#0D1B2A]'>
      <div className='left flex items-center text-[#00adb5] gap-5 pl-8'>
        <img src={logo} alt='bookitnow' />
        <Link to='/' className='text-[28px]'>
          BookItNow
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
            Contract Balance: {contractBalance} TVARA
          </span>
          <span className='text-[20px]'>
            Token Balance: {tokenBalance} TOKENS
          </span>
        </div>
        <Wallet theme='gear' />
        {/* {isAccountVisible && <Wallet theme='vara' />} */}
        {/* <button className='bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-[19px] py-[14px] px-7 rounded-lg shadow-md'>
         
        </button> */}
      </div>
    </header>
  );
}

// Mock functions to simulate fetching balances
async function getContractBalance(): Promise<number> {
  return 10; // Replace with actual logic
}

async function getTokenBalance(): Promise<number> {
  return 100; // Replace with actual logic
}
