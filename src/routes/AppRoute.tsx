import {Route, Routes} from 'react-router-dom';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import {FavouriteList, Login, Provider, ProxyList, TodayList} from '../pages';
import Dashboard from '../components/Dashboard';

export const DashboardRoutes = [
  {path: '/favouriteList', component: <FavouriteList />},
  {path: '/provider', component: <Provider />},
  {path: '/proxyList', component: <ProxyList />},
  {path: '/todayList', component: <TodayList />},
];

function AppRoutes() {
  return (
    <Routes>
      <Route element={<UnProtectedRoute />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Dashboard />} />
        {DashboardRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
