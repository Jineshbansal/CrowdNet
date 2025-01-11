import { Logo } from './logo';
import { Wallet } from '@gear-js/wallet-connect';
import styles from './header.module.scss';
import logo from '../../../assets/images/icons/bookitnow.svg';
import { Link } from 'react-router-dom';

interface Props {
  isAccountVisible: boolean;
}

export function Header({ isAccountVisible }: Props) {
  return (
    <header className='w-full h-[80px] flex flex-row justify-between items-center bg-[#0D1B2A]'>
      <div className='left flex items-center text-[#00adb5] gap-5 pl-8'>
        <img src={logo} alt='bookitnow' />
        <Link to='/' className='text-[28px]'>
          BookItNow
        </Link>
      </div>
      <div className='flex items-center gap-[100px] pr-8'>
        <Link to='/explore' className='text-[28px] text-[#FFC947]'>
          Explore
        </Link>
        <Wallet theme='gear' />
        {/* {isAccountVisible && <Wallet theme='vara' />} */}
        {/* <button className='bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-[19px] py-[14px] px-7 rounded-lg shadow-md'>
         
        </button> */}
      </div>
    </header>
  );
}
