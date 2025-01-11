import React from 'react';

const Loader = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='loader border-8 border-t-8 border-t-[#00ADB5] border-gray-200 rounded-full w-10 h-10 animate-spin'></div>
    </div>
  );
};

export default Loader;
