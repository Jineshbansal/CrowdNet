import { useState } from 'react';
import eventPic from '@/assets/images/event.jpg';
import { GearApi } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { web3FromSource, web3Accounts } from '@polkadot/extension-dapp';
import { idl } from '@/app/utils';

const EventsCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 50;

  const handleBookClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleIncrement = () => {
    setTicketCount(ticketCount + 1);
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        const transaction = sails.services.Events.functions.CreateEvent(
          null,
          null,
          [ticketCount, 100]
        );

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
      }
    }

    State();

    setShowForm(false);
  };

  return (
    <div className='relative' key='event.id' id='event.id'>
      <div className='bg-[#6a0dad] text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto transition-transform transform hover:scale-105'>
        <img
          src={eventPic}
          alt='Event'
          className='w-full h-48 object-cover rounded-t-lg mb-4'
        />
        <h1 className='text-2xl font-bold mb-2 border-b-2 border-white pb-2'>
          Event Name
        </h1>
        <p className='mb-4'>
          This is a brief description of the event. It provides an overview of
          what to expect.
        </p>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Place:</strong> Event Location
          </p>
          <p>
            <strong>Time:</strong> Event Time
          </p>
        </div>
        <div className='flex justify-between mb-4'>
          <p>
            <strong>Price:</strong> $50
          </p>
        </div>
        <div className='flex justify-between items-center'>
          <button
            className='bg-white text-[#6a0dad] font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors'
            onClick={handleBookClick}
          >
            Book Ticket
          </button>
          <button className='bg-white text-[#6a0dad] font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors'>
            Details
          </button>
        </div>
      </div>

      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
            <h2 className='text-2xl font-bold mb-4'>Book Tickets</h2>
            <form onSubmit={handleSubmit}>
              <div className='flex items-center mb-4'>
                <button
                  type='button'
                  className='bg-gray-200 text-gray-700 px-2 py-1 rounded-l'
                  onClick={handleDecrement}
                >
                  -
                </button>
                <input
                  type='number'
                  value={ticketCount}
                  readOnly
                  className='w-12 text-center border-t border-b border-gray-200'
                />
                <button
                  type='button'
                  className='bg-gray-200 text-gray-700 px-2 py-1 rounded-r'
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
              <p className='mb-4'>
                <strong>Total Price:</strong> ${ticketCount * ticketPrice}
              </p>
              <button
                type='submit'
                className='bg-[#6a0dad] text-white font-bold py-2 px-4 rounded hover:bg-[#5a0c9d] transition-colors'
              >
                Book Now
              </button>
              <button
                type='button'
                className='ml-4 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors'
                onClick={handleCloseForm}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { EventsCard };
