import { useState } from 'react';
import { FaThumbsUp, FaComment, FaTimes } from 'react-icons/fa';
import eventPic from '@/assets/images/event.jpg';
import { GearApi } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { web3FromSource, web3Accounts } from '@polkadot/extension-dapp';
import { idl } from '@/app/utils';
import { useEffect } from 'react';
import { set } from 'react-hook-form';

interface Event {
  event_id: number;
  name: string;
  venue: string;
  start_time: string;
  description: string;
  initial_price: number;
  time: number;
}

const EventsCard = ({ event }: { event: Event }) => {
  const [showForm, setShowForm] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [counter, setCounter] = useState(0);

  const formattedTime = new Date(
    Number(event.start_time) * 1000
  ).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

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

  const handleDetailsClick = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleLike = async (eventId: number) => {
    console.log(eventId);
    const parser = await SailsIdlParser.new();
    const sails = new Sails(parser);
    sails.parseIdl(idl);
    const gearApi = await GearApi.create({
      providerAddress: 'wss://testnet.vara.network',
    });
    sails.setApi(gearApi);
    sails.setProgramId(import.meta.env.VITE_APP_PROGRAM_ID);
    console.log('Program ID:', import.meta.env.VITE_APP_PROGRAM_ID);
    const transaction = sails.services.Common.functions.InteractLike(eventId);

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
  };

  const handleAddComment = async (eventId: number) => {
    if (newComment.trim() === '') return;

    const parser = await SailsIdlParser.new();
    const sails = new Sails(parser);
    sails.parseIdl(idl);
    const gearApi = await GearApi.create({
      providerAddress: 'wss://testnet.vara.network',
    });
    sails.setApi(gearApi);
    sails.setProgramId(import.meta.env.VITE_APP_PROGRAM_ID);
    console.log('Program ID:', import.meta.env.VITE_APP_PROGRAM_ID);
    const transaction = sails.services.Common.functions.InteractComment(
      eventId,
      newComment
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
      setComments([...comments, { id: comments.length + 1, text: newComment }]);
      setNewComment('');
    } catch (error) {
      console.error('Error executing message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, eventId: number) => {
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
        console.log(eventId);
        const transaction = sails.services.Events.functions.PurchaseTicket(
          ticketCount, eventId
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

  const handleCancelEvent = async (eventId: number) => {
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
        const transaction = sails.services.Events.functions.CancelEvent([
          eventId,
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
        setShowDetails(false);
        setCounter(counter + 1);
      }
    }

    State();
  };

  useEffect(() => {
    const initialize = async () => {
      const parser = await SailsIdlParser.new();
      const sails = new Sails(parser);

      async function State() {
        try {
          sails.parseIdl(idl);
          const gearApi = await GearApi.create({
            providerAddress: 'wss://testnet.vara.network',
          });
          sails.setApi(gearApi);
          sails.setProgramId(import.meta.env.VITE_APP_PROGRAM_ID);
          const alice = 'kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW';
          console.log(event.event_id);
          const interactionsData =
            await sails.services.Common.queries.GetInteractions(
              alice,
              null,
              null,
              event.event_id
            );
          console.log(interactionsData);
          setLikes(interactionsData[0]);
          setComments(
            interactionsData[1].map((text: string, index: number) => ({
              id: index + 1,
              text,
            }))
          );
        } catch (e) {
          console.log('error:', e);
        }
      }

      State();
    };

    initialize();
  }, [event.event_id, likes, comments, counter]);

  return (
    <div className='relative' key={event.event_id} id='event.id'>
      <div className='bg-[#6a0dad] text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto transition-transform transform hover:scale-105'>
        <img
          src={eventPic}
          alt='Event'
          className='w-full h-48 object-cover rounded-t-lg mb-4'
        />
        <h1 className='text-2xl font-bold mb-2 border-b-2 border-white pb-2'>
          {event.name}
        </h1>
        <p className='mb-4'>{event.description}</p>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>Ticket Price:</strong>{' '}
            {parseInt(event.initial_price.toString(), 16)}
          </p>
        </div>
        <div className='flex justify-between mb-4'>
          <p>
            <strong>Time:</strong> {formattedTime}
          </p>
        </div>
        <div className='flex justify-between items-center'>
          <button
            className='bg-white text-[#6a0dad] font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors'
            onClick={handleBookClick}
          >
            Book Ticket
          </button>
          <button
            className='bg-white text-[#6a0dad] font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors'
            onClick={handleDetailsClick}
          >
            Details
          </button>
        </div>
      </div>

      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
            <h2 className='text-2xl font-bold mb-4'>Book Tickets</h2>
            <form onSubmit={(e) => handleSubmit(e, event.event_id)}>
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
                <strong>Total Price:</strong> $
                {ticketCount * event.initial_price}
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

      {showDetails && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-screen flex'>
            <div className='w-3/4 pr-4'>
              <h2 className='text-3xl font-bold mb-4 text-center text-[#6a0dad]'>
                {event.name} Details
              </h2>
              <img
                src={eventPic}
                alt='Event'
                className='w-full h-64 object-cover rounded-lg mb-4 shadow-md'
              />
              <p className='mb-4 text-lg'>
                <strong>Description:</strong> {event.description}
              </p>
              <p className='mb-4 text-lg'>
                <strong>Location:</strong> {event.venue}
              </p>
              <p className='mb-4 text-lg'>
                <strong>Time:</strong> {formattedTime}
              </p>
              <p className='mb-4 text-lg'>
                <strong>Price:</strong> $
                {parseInt(event.initial_price.toString(), 16)}
              </p>
            </div>
            <div className='w-1/4 pl-4 border-l border-gray-200 relative'>
              <button
                type='button'
                className='absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700 transition-colors'
                onClick={handleCloseDetails}
                style={{ zIndex: 10 }}
              >
                <FaTimes size={24} />
              </button>
              <div className='mt-10'>
                <h3 className='text-xl font-bold mb-4 text-[#6a0dad]'>
                  Likes & Comments
                </h3>
                <div className='mb-4 flex items-center'>
                  <FaThumbsUp className='text-[#6a0dad] mr-2' />
                  <span className='text-lg font-bold mr-2'>Likes:</span>
                  <span className='text-lg bg-gray-200 px-2 py-1 rounded-full'>
                    {likes}
                  </span>
                  <button
                    className='ml-2 bg-[#6a0dad] text-white font-bold py-1 px-2 rounded hover:bg-[#5a0c9d] transition-colors'
                    onClick={() => handleLike(event.event_id)}
                  >
                    Like
                  </button>
                </div>
                <div className='mb-4 flex items-center'>
                  <FaComment className='text-[#6a0dad] mr-2' />
                  <span className='text-lg font-bold'>Comments:</span>
                  <span className='text-lg bg-gray-200 px-2 py-1 rounded-full ml-2'>
                    {comments.length}
                  </span>
                </div>
                <div className='mb-4'>
                  <strong>Comments:</strong>
                  <ul className='list-disc list-inside mt-2'>
                    {comments.map((comment) => (
                      <li
                        key={comment.id}
                        className='mb-2 text-lg bg-gray-100 p-2 rounded-lg shadow-sm'
                      >
                        {comment.text}
                      </li>
                    ))}
                  </ul>
                  <div className='mt-4'>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(event.event_id);
                      }}
                    >
                      <input
                        type='text'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded mb-2'
                        placeholder='Add a comment...'
                      />
                      <button
                        type='submit'
                        className='bg-[#6a0dad] text-white font-bold py-2 px-4 rounded hover:bg-[#5a0c9d] transition-colors'
                      >
                        Add Comment
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className='absolute bottom-4 right-4'>
                <button
                  className='bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors'
                  onClick={() => handleCancelEvent(event.event_id)}
                >
                  Cancel Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { EventsCard };
