import React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import Loading from '../components/Loading';
import {allUserFn, deleteUserFn} from '../config';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import AddUser from '../components/AddUserModa';
import {toast} from 'react-toastify';

interface UsersProps {
  username: string;
  role: string;
  isEnable: boolean;
  id: string;
}

function Users() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showModal, setShowModal] = React.useState(false);
  const queryClient = useQueryClient();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {isLoading, data, error} = useQuery({
    queryKey: ['userlist'],
    queryFn: allUserFn,
  });

  const {mutate: removeUsers, isLoading: addLoading} = useMutation((userId: any) => deleteUserFn(userId), {
    onSuccess(data) {
      queryClient.invalidateQueries('userlist');
      toast.success('user removed successfully');
    },
    onError: (error: any) => {
      toast.error(`Something went wrong: ${error.response.data.message}`);
    },
  });

  const onDeleteHandler = (userId: any) => {
    removeUsers(userId);
  };

  if (isLoading) return <Loading />;
  return (
    <div>
      <div>
        <div className='flex items-center justify-between'>
          <p className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'>Users List</p>
          <button
            onClick={() => setShowModal(true)}
            className='my-3 w-24 rounded bg-[#111627] p-2 text-center text-white'
          >
            Add User
          </button>
        </div>

        <AddUser showModal={showModal} setShowModal={setShowModal} />
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label='simple table'>
            <TableHead className='tableHead'>
              <TableRow>
                <TableCell>username</TableCell>
                <TableCell>‌role</TableCell>
                <TableCell>isEnable</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='tableBody'>
              {data.data.map((row: UsersProps) => (
                <TableRow key={row.id} className='tableRow'>
                  <TableCell className='text-xs' component='th' scope='row'>
                    {row.username}
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    {' '}
                    <div className='flex items-center gap-1'>
                      {(() => {
                        if (row.isEnable === true) {
                          return <button className='rounded-md bg-green-500  py-1 px-2 text-white'>enable</button>;
                        } else if (row.isEnable === false) {
                          return <button className='rounded-md bg-red-500 py-1 px-2 text-white'>disable</button>;
                        } else {
                          <button className='rounded-md bg-black  py-1 px-2 text-white'>unknowen</button>;
                        }
                      })()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onDeleteHandler(row.id)}
                      className='rounded-md bg-red-600 p-2 font-bold text-white'
                    >
                      Remove User
                    </button>
                  </TableCell>{' '}
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
    </div>
  );
}

export default Users;
