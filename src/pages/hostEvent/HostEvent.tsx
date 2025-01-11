import { Header } from '@/components';
import React, { useState } from 'react';
import { GearApi } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { web3FromSource, web3Accounts } from '@polkadot/extension-dapp';
import { idl } from '@/app/utils';

const HostEvent = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    event_description: '',
    event_venue: '',
    ticket_price: '',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted');

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
        const alice = 'kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW';
        const eventCount = await sails.services.Common.queries.GetEventCount(
          alice
        );
        console.log(eventCount);
        const transaction = sails.services.Events.functions.CreateEvent([
          eventCount,
          formData.event_name,
          formData.event_venue,
          formData.event_date,
          formData.event_description,
          BigInt(formData.ticket_price),
        ]);

        const allAccounts = await web3Accounts();
        const account = allAccounts[0];
        const injector = await web3FromSource(account.meta.source);
        transaction.withAccount(account.address, { signer: injector.signer });

        transaction.withGas(100_000_000_000n);
        const fee = await transaction.transactionFee();
        console.log('Transaction fee:', fee.toString());
        const { msgId, blockHash, txHash, response, isFinalized } =
          await transaction.signAndSend();

        console.log('Message ID:', msgId);
        console.log('Transaction hash:', txHash);
        console.log('Block hash:', blockHash);

        // Check if the transaction is finalized
        const finalized = await isFinalized;
        console.log('Is finalized:', finalized);

        // Get the response from the program
        try {
          const result = await response();
          console.log('Program response:', result);
        } catch (error) {
          console.error('Error executing message:', error);
        }
      } catch (e) {
        console.log('error:', e);
      } finally {
        // Clear form data after submission attempt
        setFormData({
          event_name: '',
          event_date: '',
          event_description: '',
          event_venue: '',
          ticket_price: '',
        });
      }
    }

    State();
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
                className='border border-[#00ADB5] rounded-lg bg-[#0D1B2A] my-1 text-white py-2 px-3 outline-none'
                onChange={handleChange}
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
            />
          </div>
          <div className='flex flex-col py-3 w-full'>
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
            />
          </div>
          <div className='flex justify-center my-5'>
            <button className='px-5 py-3 font-bold text-[#0D1B2A] rounded-lg bg-[#14FF9E] hover:bg-[#12e08c] transition duration-300'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export { HostEvent };
