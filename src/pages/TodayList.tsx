import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import {useMutation, useQuery, useQueryClient} from 'react-query';
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
import {DeleteFavouritefn, getAllTodayFn} from '../config';

interface Proxy {
  id: string;
  proxy: {
    listenPort: number;
    listenAddr: string;
    status: number;
    id: string;
    outgoingCountry: string;
    identityId: string;
    userIdentity: string;
  };
  note: string;
}

function FavouriteList() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const queryClient = useQueryClient();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {isLoading, data, error} = useQuery({
    queryKey: ['today'],
    queryFn: getAllTodayFn,
  });

  const {mutate: removeFavourite, isLoading: addLoading} = useMutation(
    (identityId: any) => DeleteFavouritefn(identityId),
    {
      onSuccess(data) {
        queryClient.invalidateQueries('today');
        toast.success('proxy removed successfully');
      },
      onError: (error: any) => {
        toast.error(`Something went wrong: ${error.response.data.message}`);
      },
    },
  );

  const onDeleteHandler = (identityId: any) => {
    removeFavourite(identityId);
  };

  if (isLoading) return <Loading />;

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
                  <TableCell>Note</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='tableBody'>
                {data.data.map((row: Proxy) => (
                  <TableRow key={row.proxy.id} className='tableRow'>
                    <TableCell className='text-xs' component='th' scope='row'>
                      {row.proxy.userIdentity}
                    </TableCell>
                    <TableCell>
                      {row.proxy.listenAddr}:{row.proxy.listenPort}
                    </TableCell>
                    <TableCell>
                      <ReactCountryFlag
                        className='relative left-5 text-2xl'
                        countryCode={row.proxy.outgoingCountry}
                        svg
                      />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        {(() => {
                          if (row.proxy.status === 1) {
                            return <button className='rounded-md bg-red-500  py-1 px-2 text-white'>offline</button>;
                          } else if (row.proxy.status === 2) {
                            return <button className='rounded-md bg-green-500 py-1 px-2 text-white'>online</button>;
                          } else {
                            <button className='rounded-md bg-black  py-1 px-2 text-white'>disabled</button>;
                          }
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>{row?.note || 'There is no note fot this proxy'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => onDeleteHandler(row.id)}
                        className='rounded-md bg-red-600 p-2 font-bold text-white'
                      >
                        {addLoading ? (
                          <svg
                            className='mr-2 inline h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                            viewBox='0 0 100 101'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                              fill='currentColor'
                            />
                            <path
                              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                              fill='currentFill'
                            />
                          </svg>
                        ) : null}
                        Remove From TodayList
                      </button>
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
}

export default FavouriteList;
