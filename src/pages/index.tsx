import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './home';
import { NotFound } from './not-found';
import path from 'path';
import { HostEvent } from './hostEvent';
import { Explore } from './explore';
import { Tickets } from './tickets';

const routes = [
  { path: '/', Page: Home },
  { path: '/host', Page: HostEvent },
  { path: '/home', Page: Home },
  { path: '/explore', Page: Explore },
  { path: '/*', Page: NotFound },
  { path: '/tickets', Page: Tickets },
];

function Routing() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {routes.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
}

export { Routing };
