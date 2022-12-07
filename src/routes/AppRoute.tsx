import {lazy, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import UnProtectedRoute from './UnProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import {FavouriteList, Login, Provider, Identity, TodayList, Acl} from '../pages';
import Dashboard from '../components/Dashboard';
import Loading from '../components/Loading';

export const DashboardRoutes = [
  {path: '/favouriteList', component: <FavouriteList />},
  {path: '/provider', component: <Provider />},
  {path: '/todayList', component: <TodayList />},
  {path: '/identity', component: <Identity />},
  {path: '/acl', component: <Acl />},
];

const renderLoader = () => <Loading />;

function AppRoutes() {
  return (
    <Routes>
      <Route element={<UnProtectedRoute />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path='dashboard/*' element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
