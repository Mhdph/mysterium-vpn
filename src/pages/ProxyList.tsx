import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TablePagination} from '@mui/material';
import {useQuery} from 'react-query';
import {getProxy} from '../config';

interface Proxy {
  listenPort: number;
  listenAddr: string;
  status: number;
  id: string;
}

const ProxyList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {isLoading, isError, data, error} = useQuery({
    queryKey: ['proxy'],
    queryFn: getProxy,
  });

  const rows = [
    {
      ip: '192.168.1.1',
      port: '8888',
      username: 'milad',
      password: '123456789',
      country: 'EN',
      countryImg:
        'data:image/png;base64,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',
      city: 'London',
      status: 'online',
      action: 'online',
      keepAlive: 'unchecked',
    },
    {
      ip: '192.168.1.1',
      port: '5555',
      username: 'Test',
      password: '987456321',
      country: 'USA',
      countryImg: 'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-400.png',
      city: 'NYC',
      status: 'offline',
      action: 'offline',
      keepAlive: 'checked',
    },
  ];

  return (
    <TableContainer component={Paper} className='table'>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead className='tableHead'>
          <TableRow>
            <TableCell className='tabelCell'>‌Ip</TableCell>
            <TableCell className='tabelCell'>Listen Port</TableCell>
            <TableCell className='tabelCell'>Status</TableCell>
            <TableCell className='tabelCell'>Delete Proxy</TableCell>
            <TableCell className='tabelCell'>Add Proxy</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='tableBody'>
          {rows.map((row) => (
            <TableRow key={row.username} className='tableRow'>
              <TableCell component='th' scope='row' className='tabelCell'>
                {row.ip}
              </TableCell>
              <TableCell className='tabelCell'>{row.port}</TableCell>
              <TableCell className='tabelCell'>
                <div className='flex items-center gap-1'>
                  <img src={row.countryImg} alt='' className='h-4 w-4' />
                  {row.country}
                </div>
              </TableCell>
              <TableCell className='tabelCell'>{row.city}</TableCell>
              <TableCell className='tabelCell'>
                <div className={`status ${row.status}`}>{row.status}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component='div'
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default ProxyList;
