import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { dAppContext } from '@/Context/dappContext';
import { useAccount } from '@gear-js/react-hooks';
import { useSailsCalls } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/loader/Loader';
import './examples.css';
import logo from '../../assets/images/icons/bookitnow.svg';

function Home() {
  const sails = useSailsCalls();
  const { account } = useAccount();
  const { currentVoucherId, setCurrentVoucherId, setSignlessAccount } =
    useContext(dAppContext);

  const [pageSignlessMode, setPageSignlessMode] = useState(false);
  const [voucherModeInPolkadotAccount, setVoucherModeInPolkadotAccount] =
    useState(false);
  const [contractState, setContractState] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      setPageSignlessMode(true);
    } else {
      setPageSignlessMode(false);
    }
    if (setCurrentVoucherId) setCurrentVoucherId(null);
    setLoading(false);
  }, [account]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className='w-full h-full flex flex-row justify-between items-center bg-[#0D1B2A]'>
        <div className='left h-full w-3/4 flex flex-col justify-center items-center gap-14'>
          <div className='top leading-tight'>
            <p className='text-[#00ADB5] text-[65px] font-bold'>
              Host <span className='text-[#6A0DAD]'>and</span> Participate
            </p>
            <p className='text-[#6A0DAD] text-[65px] font-bold'>
              in Events Seamlessly
            </p>
            <p className='text-[#6A0DAD] text-[65px] font-bold'>
              with CrowdNet
            </p>
            <p className='text-[#00ADB5] text-[30px] text-center pt-5 font-bold'>
              Secure. Transparent. Decentralized.
            </p>
          </div>
          <div className='flex gap-36'>
            <button
              className='bg-[#FFC947]  text-black font-medium text-[19px] py-[14px] px-7 rounded-lg shadow-md'
              onClick={() => navigate('/explore')}
            >
              Explore Events
            </button>
            <button
              className='bg-[#222831] text-white font-medium text-[19px] py-[14px] px-7 rounded-lg shadow-md'
              onClick={() => navigate('/host')}
            >
              Host an Event
            </button>
          </div>
        </div>
        <div className='right h-full w-1/4 flex justify-center items-center mr-5'>
          <img src={logo} className='h-[400px] w-[400px]' alt='crowdnet' />
        </div>
      </div>
    </>
  );
}

export { Home };
