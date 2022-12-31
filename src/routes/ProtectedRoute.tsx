import Cookies from 'js-cookie';
import {Outlet, Navigate} from 'react-router-dom';

const ProtectedRoute = () => {
  const token = Cookies.get('tokenexpire');
  return token ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
