import clsx from 'clsx';
import * as React from 'react';
import {useMutation} from 'react-query';
import {toast} from 'react-toastify';
import Loading from '../components/Loading';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '../components/mui';
import ProviderConnected from '../components/ProviderConnected';
import {api, connectProviderFn, disconnectProviderFn} from '../config';
interface Data {
  ip: string;
  country: string;
  quality: number;
  bandwidth: number;
  latency: number;
  id: string;
  isRegister: boolean;
  providerStatus: string;
  proxyCount: number;
}

export default function Provider() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getAllProviderFn = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/provider/myst?filters[country]=GB', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllProviderFn();
  }, []);

  const {mutate: disconnectProvider} = useMutation((providerId: string) => disconnectProviderFn(providerId), {
    onSuccess() {
      getAllProviderFn();
      toast.success('Provider disconnected successfully');
    },
  });

  const {mutate: connectProvider} = useMutation((providerId: string) => connectProviderFn(providerId), {
    onSuccess: () => {
      toast.success('Provider created successfully');
    },
  });

  //function

  const onDisconnectHandler = (providerId: string) => {
    disconnectProvider(providerId);
  };

  const onConnectHandler = (providerId: string) => {
    connectProvider(providerId);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <Loading />;
  return (
    <div>
      <p className='my-3 w-40 rounded bg-[#111627] p-2 text-center text-white'>Provider List</p>

      <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{maxHeight: 440}}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell>‌Id</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Quality</TableCell>
                <TableCell>‌Bandwidth</TableCell>
                <TableCell>Latency</TableCell>
                <TableCell>Connected clients</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Data) => {
                return (
                  <TableRow key={row.id} className='tableRow'>
                    <TableCell component='th' scope='row'>
                      {row.id.slice(0, 4)}*****{row.id.slice(32, 36)}
                    </TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.quality.toFixed(2)}</TableCell>
                    <TableCell>{row.bandwidth.toFixed(2)}</TableCell>
                    <TableCell>{row.latency.toFixed(2)}</TableCell>
                    <TableCell className='px-0'>
                      <p className='relative right-10 text-center'>{row.proxyCount}</p>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={row.isRegister ? () => onDisconnectHandler(row.id) : () => onConnectHandler(row.id)}
                        className={clsx(
                          row.isRegister ? 'bg-red-500' : ' bg-green-500 ',
                          'rounded px-2 py-1 text-white',
                        )}
                      >
                        {row.isRegister ? 'Disconnect' : 'Connect'}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <p className='my-3 w-40 rounded bg-[#111627] p-2 text-center text-white'>Connected Provider</p>

      <ProviderConnected />
    </div>
  );
}
