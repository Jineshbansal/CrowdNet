import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'react-hot-toast';

function App() {


  return (
    <div className='App w-[100vw] h-[100vh] absolute overflow-x-hidden overflow-y-scroll no-scrollbar'>
      <Toaster position='top-center' />
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
