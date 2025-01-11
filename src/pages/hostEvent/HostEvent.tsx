import { Header } from '@/components';
import React, { useState } from 'react';

const HostEvent = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    event_description: '',
    event_venue: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted');
  };
  return (
    <>
      <Header />
      <div className='bg-[#0D1B2A] w-full h-full flex flex-col items-center'>
        <h1 className='text-center py-4 text-[#7f2cbb] font-semibold text-5xl'>
          Host an Event
        </h1>
        <form
          className='m-4 rounded-lg border-2 border-[#00ADB5] flex flex-col w-1/2 px-20 justify-center'
          onSubmit={handleSubmit}
        >
          <div className='flex gap-16 py-3'>
            <div className='flex flex-col'>
              <label
                htmlFor='event_name'
                className='text-[#00ADB5] font-semibold'
              >
                Event Name
              </label>
              <input
                type='text'
                id='event_name'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-1 px-2 outline-none'
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col'>
              <label
                htmlFor='event_date'
                className='text-[#00ADB5] font-semibold'
              >
                Date, Time
              </label>
              <input
                type='datetime-local'
                id='event_date'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-1 px-2 outline-none'
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='flex justify-start py-3 w-full'>
            <div className='flex flex-col w-full'>
              <label
                htmlFor='event_description'
                className='text-[#00ADB5] font-semibold'
              >
                Event Description
              </label>
              <textarea
                id='event_description'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-1 px-2 outline-none w-full'
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <label
              htmlFor='event_venue'
              className='text-[#00ADB5] font-semibold'
            >
              Venue
            </label>
            <textarea
              id='event_venue'
              className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-1 px-2 outline-none w-full'
              onChange={handleChange}
            />
          </div>
          <div className='flex justify-center my-5'>
            <button className='px-3 py-2 font-bold text-[#0D1B2A] rounded-lg bg-[#14FF9E]'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export { HostEvent };
