import eventPic from '@/assets/images/event.jpg';

const EventsCard = () => {
  return (
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
      <p className='mb-2'>
        <strong>Place:</strong> Event Location
      </p>
      <p className='mb-4'>
        <strong>Time:</strong> Event Time
      </p>
      <button className='bg-white text-[#6a0dad] font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors'>
        Book Ticket
      </button>
    </div>
  );
};
export { EventsCard };
