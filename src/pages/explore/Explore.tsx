import { Header } from '@/components';
import { EventsCard } from '@/components/eventsCard';

const Explore = () => {
  return (
    <>
      <Header />
      <div className='bg-[#0D1B2A] w-full min-h-screen flex flex-col items-center'>
        <div className='top text-center my-8'>
          <h1 className='text-4xl text-purple-700 font-bold mb-4'>
            All Events
          </h1>
          <div className='flex items-center border-2 border-purple-500 rounded-lg px-4 py-2 w-80 bg-[#13131a]'>
            <span className='text-purple-500 mr-2'>🔍</span>
            <input
              type='text'
              placeholder='Search by name, venue'
              className='bg-transparent outline-none text-white placeholder:text-purple-500 placeholder:opacity-80 flex-1'
            />
          </div>
        </div>
        <div className='events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4'>
          <EventsCard />
          <EventsCard />
          <EventsCard />
          <EventsCard />
          <EventsCard />
          <EventsCard />
        </div>
      </div>
    </>
  );
};
export { Explore };
