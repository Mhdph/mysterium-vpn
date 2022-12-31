import Cookies from 'js-cookie';
import {Outlet, Navigate} from 'react-router-dom';

const AdminRoute = () => {
  const token = Cookies.get('tokenexpire');
  const role = localStorage.getItem('user');
  return token && role === 'admin' ? <Outlet /> : <Navigate to='/' />;
};

export default AdminRoute;
