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
import {useMutation, useQuery} from 'react-query';
import {AddFavouritefn, AddTodayfn, getProxy} from '../config';
import Loading from '../components/Loading';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ReactCountryFlag from 'react-country-flag';
import {toast} from 'react-toastify';

interface Proxy {
  listenPort: number;
  listenAddr: string;
  status: number;
  id: string;
  outgoingCountry: string;
  identityId: string;
}

const ProxyList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [note, setNote] = React.useState('');

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {isLoading, data, error} = useQuery({
    queryKey: ['proxy'],
    queryFn: getProxy,
  });

  const {mutate: AddtoFavourite} = useMutation((favourite: any) => AddFavouritefn(favourite), {
    onSuccess: () => {
      toast.success('The proxy added to your favourite list successfully');
      (document.getElementById('noteId') as HTMLInputElement).value = '';
    },
    onError: () => {
      toast.error('Some thing went wrong');
    },
  });

  const {mutate: AddtoToday} = useMutation((today: any) => AddTodayfn(today), {
    onSuccess: () => {
      toast.success('The proxy added to your today list successfully');
      let inputs = document.getElementById('checkId') as HTMLInputElement;
      inputs.checked = false;
      (document.getElementById('noteId') as HTMLInputElement).value = '';
    },
    onError: () => {
      toast.error('Some thing went wrong');
    },
  });

  const onSubmitHandler = (id: any) => {
    if (note === '') {
      const kind = 'favorite';
      const bulk = [
        {
          proxyId: id,
        },
      ];
      const favourite = {bulk, kind};
      AddtoFavourite(favourite);
    } else {
      const kind = 'favorite';
      const bulk = [
        {
          proxyId: id,
          note,
        },
      ];
      const favourite = {bulk, kind};
      AddtoFavourite(favourite);
    }
  };

  const onTodayHandler = (id: any) => {
    if (note === '') {
      const kind = 'today';
      const bulk = [
        {
          proxyId: id,
        },
      ];
      const today = {bulk, kind};
      AddtoToday(today);
    } else {
      const kind = 'today';
      const bulk = [
        {
          proxyId: id,
          note,
        },
      ];
      const today = {bulk, kind};
      AddtoToday(today);
    }
  };

  if (isLoading) return <Loading />;
  if (error instanceof Error) {
    <p>error.message</p>;
  }

  return (
    <div>
      {data?.data ? (
        <div>
          <p className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'>Proxy List</p>

          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead className='tableHead'>
                <TableRow>
                  <TableCell>‌Local Id</TableCell>
                  <TableCell>‌IP:Port</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='tableBody'>
                {data.data.map((row: Proxy) => (
                  <TableRow key={row.id} className='tableRow'>
                    <TableCell component='th' scope='row'>
                      {row.id.slice(0, 4)}***{row.id.slice(32, 36)}
                    </TableCell>
                    <TableCell>
                      {row.listenAddr}:{row.listenPort}
                    </TableCell>
                    <TableCell>
                      <ReactCountryFlag className='relative left-5 text-2xl' countryCode={row.outgoingCountry} svg />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        {(() => {
                          if (row.status === 1) {
                            return <button className='rounded-md bg-red-500  py-1 px-2 text-white'>offline</button>;
                          } else if (row.status === 2) {
                            return <button className='rounded-md bg-green-500 py-1 px-2 text-white'>online</button>;
                          } else {
                            <button className='rounded-md bg-black  py-1 px-2 text-white'>disabled</button>;
                          }
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <StarOutlineIcon
                          onClick={() => onSubmitHandler(row.id)}
                          className='cursor-pointer text-gray-500 '
                        />
                        <input
                          id='checkId'
                          onClick={() => onTodayHandler(row.id)}
                          type='checkbox'
                          className='h-4 w-4 text-black'
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        id='noteId'
                        type='text'
                        className='border-blue-[#F3F4F6] border bg-gray-100 placeholder:pl-2 placeholder:text-xs'
                        onChange={(e) => setNote(e.target.value)}
                      />
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
        </div>
      ) : (
        <p className='flex items-center justify-center text-2xl font-bold'>
          {error instanceof Error && 'Something went wrong'}
        </p>
      )}
    </div>
  );
};

export default ProxyList;
