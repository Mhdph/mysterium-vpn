import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '../components/mui';
import {useQuery} from 'react-query';
import {getProxy} from '../config';
import Loading from '../components/Loading';
import ProviderConnected from '../components/ProviderConnected';

interface Proxy {
  listenPort: number;
  listenAddr: string;
  status: number;
  id: string;
  outgoingCountry: string;
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

  const {isLoading, data} = useQuery({
    queryKey: ['proxy'],
    queryFn: getProxy,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      {data.data ? (
        <div>
          <p className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'>Proxy List</p>

          <TableContainer component={Paper} className='table'>
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead className='tableHead'>
                <TableRow>
                  <TableCell>‌Id</TableCell>
                  <TableCell>‌Ip:Port</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='tableBody'>
                {data.data.map((row: Proxy) => (
                  <TableRow key={row.id} className='tableRow'>
                    <TableCell component='th' scope='row'>
                      {row.id.slice(0, 4)}*****{row.id.slice(32, 36)}
                    </TableCell>
                    <TableCell>
                      {row.listenAddr}:{row.listenPort}
                    </TableCell>
                    <TableCell>{row.outgoingCountry}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>{row.status}</div>
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
          <p className='my-3 w-40 rounded bg-[#111627] p-2 text-center text-white'>Connected Provider</p>
          <ProviderConnected />
        </div>
      ) : (
        <p className='flex items-center justify-center text-2xl font-bold'>No proxy created yet</p>
      )}
    </div>
  );
};

export default ProxyList;
