import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {Divider, Drawer, Toolbar, Typography, IconButton} from '../components/mui';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {ArrowSmallLeftIcon, ArrowSmallRightIcon, Bars4Icon} from '@heroicons/react/24/solid';
import {Route, Routes} from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import {ProxyList} from '../pages';
import {DashboardRoutes} from '../routes/AppRoute';
import DashboardList from './DashboardList';
import peoxypic from '../assets/proxy.png';

const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
  open?: boolean;
}>(({theme, open}) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar
        sx={{
          backgroundColor: 'white',
        }}
        position='fixed'
        open={open}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{mr: 2, ...(open && {display: 'none'})}}
          >
            <Bars4Icon className='h-5 w-5 text-gray-500' />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#111627',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader className='flex justify-between'>
          <p className='text-sm font-semibold text-gray-500'>Mysterium Proxy</p>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ArrowSmallLeftIcon className='h-5 w-5 text-gray-500' />
            ) : (
              <ArrowSmallRightIcon className='h-5 w-5 text-gray-500' />
            )}
          </IconButton>
        </DrawerHeader>
        <div className='flex items-center justify-center'>
          <img src={peoxypic} className=' h-32 w-32' alt='' />
        </div>
        <Divider className='mt-2 text-dashboard-hover' />
        <DashboardList />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route index element={<ProxyList />} />
            {DashboardRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.component} />
            ))}
          </Route>
        </Routes>
      </Main>
    </Box>
  );
}
