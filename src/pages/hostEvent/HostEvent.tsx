import { Header } from '@/components';
import React, { useState } from 'react';
import { SailsIdlParser } from 'sails-js-parser';
import { initializeSails, executeTransaction } from '@/app/utils';
import Loader from '@/components/loader/Loader';
import toast from 'react-hot-toast';
import './HostEvent.css';
import { Sails } from 'sails-js';
import { alice } from '@/app/utils';

const HostEvent = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    event_description: '',
    event_venue: '',
    ticket_price: '',
    duration: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const parser = await SailsIdlParser.new();
    const sails = new Sails(parser);

    try {
      await initializeSails(sails);

      const eventCount = await sails.services.Common.queries.GetEventCount(
        alice
      );
      const transaction = sails.services.Events.functions.CreateEvent([
        eventCount,
        formData.duration,
        BigInt(Math.floor(new Date(formData.event_date).getTime() / 1000)),
        formData.event_name,
        formData.event_venue,
        formData.event_description,
        BigInt(formData.ticket_price),
      ]);

      await executeTransaction(
        transaction,
        'Event created successfully',
        'Failed to create event'
      );
    } catch (e) {
      console.log(e);
      toast.error('Failed to create event');
    } finally {
      setIsLoading(false);
      setFormData({
        event_name: '',
        event_date: '',
        event_description: '',
        event_venue: '',
        ticket_price: '',
        duration: '',
      });
    }
  };

  return (
    <>
      <Header />

      <div className='bg-[#0D1B2A] w-full min-h-screen flex flex-col items-center'>
        <h1 className='text-center py-4 text-[#7f2cbb] font-semibold text-5xl'>
          Host an Event
        </h1>
        <form
          className='m-4 rounded-lg border-2 border-[#00ADB5] flex flex-col w-11/12 md:w-2/5 px-6 md:px-12 py-8 bg-[#1B263B] shadow-lg'
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col md:flex-row gap-6 py-3'>
            <div className='flex flex-col w-full'>
              <label
                htmlFor='event_name'
                className='text-[#00ADB5] font-semibold'
              >
                Event Name
              </label>
              <input
                type='text'
                id='event_name'
                name='event_name'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none'
                onChange={handleChange}
                value={formData.event_name}
                required
              />
            </div>
            <div className='flex flex-col w-full'>
              <label
                htmlFor='event_date'
                className='text-[#00ADB5] font-semibold'
              >
                Date, Time
              </label>
              <input
                type='datetime-local'
                id='event_date'
                name='event_date'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none appearance-none custom-datetime'
                onChange={handleChange}
                value={formData.event_date}
                required
              />
            </div>
          </div>
          <div className='flex flex-col py-3 w-full'>
            <label
              htmlFor='event_description'
              className='text-[#00ADB5] font-semibold'
            >
              Event Description
            </label>
            <textarea
              id='event_description'
              name='event_description'
              className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none w-full h-28 resize-none'
              onChange={handleChange}
              value={formData.event_description}
              required
            />
          </div>
          <div className='flex flex-col py-3 w-full'>
            <label
              htmlFor='event_venue'
              className='text-[#00ADB5] font-semibold'
            >
              Venue
            </label>
            <textarea
              id='event_venue'
              name='event_venue'
              className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none w-full h-28 resize-none'
              onChange={handleChange}
              value={formData.event_venue}
              required
            />
          </div>
          <div className='flex flex-col md:flex-row gap-6 py-3'>
            <div className='flex flex-col w-full md:w-1/2'>
              <label
                htmlFor='ticket_price'
                className='text-[#00ADB5] font-semibold'
              >
                Ticket Price
              </label>
              <input
                type='number'
                id='ticket_price'
                name='ticket_price'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none'
                onChange={handleChange}
                value={formData.ticket_price}
                required
              />
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <label
                htmlFor='duration'
                className='text-[#00ADB5] font-semibold'
              >
                Duration
              </label>
              <input
                type='number'
                id='duration'
                name='duration'
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none'
                onChange={handleChange}
                value={formData.duration}
                required
              />
            </div>
          </div>
          <div className='flex justify-center my-5'>
            <button
              className='px-5 py-3 font-bold text-[#0D1B2A] rounded-lg bg-[#14FF9E] hover:bg-[#12e08c] transition duration-300 flex items-center'
              disabled={isLoading}
            >
              {isLoading ? (
                <div className='flex items-center'>
                  <Loader />
                  <span className='ml-2'>Submitting...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export { HostEvent };
