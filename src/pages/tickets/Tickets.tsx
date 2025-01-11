import { Header } from '@/components';
import { useState, useEffect } from 'react';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch tickets from API or context
    setTickets([
      {
        id: 1,
        eventName: 'Blockchain Conference',
        place: 'New York',
        time: '2023-11-01 10:00 AM',
      },
      {
        id: 2,
        eventName: 'Web3 Meetup',
        place: 'San Francisco',
        time: '2023-12-15 02:00 PM',
      },
    ]);
  }, []);

  const handleCancel = (id) => {
    // Handle cancel ticket
  };

  const handleTransfer = (id) => {
    // Handle transfer ticket
  };

  const handleCheckIn = (id) => {
    // Handle check-in ticket
  };

  return (
    <>
      <Header />
      <div className='w-full h-full flex flex-col items-center bg-[#0D1B2A] p-10'>
        <h1 className='text-[#00ADB5] text-[45px] font-bold mb-10'>
          My Tickets
        </h1>
        <div className='w-full flex flex-col gap-5'>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className='ticket-card flex justify-between items-center bg-[#222831] text-white p-5 rounded-lg shadow-md'
            >
              <div>
                <p className='text-[25px] font-bold'>{ticket.eventName}</p>
                <p className='text-[18px]'>{ticket.place}</p>
                <p className='text-[18px]'>{ticket.time}</p>
              </div>
              <div className='flex gap-3'>
                <button
                  className='bg-[#FFC947] text-black font-medium text-[16px] py-2 px-4 rounded-lg shadow-md'
                  onClick={() => handleCancel(ticket.id)}
                >
                  Cancel
                </button>
                <button
                  className='bg-[#00ADB5] text-black font-medium text-[16px] py-2 px-4 rounded-lg shadow-md'
                  onClick={() => handleTransfer(ticket.id)}
                >
                  Transfer
                </button>
                <button
                  className='bg-[#6A0DAD] text-white font-medium text-[16px] py-2 px-4 rounded-lg shadow-md'
                  onClick={() => handleCheckIn(ticket.id)}
                >
                  Check-in
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { Tickets };
