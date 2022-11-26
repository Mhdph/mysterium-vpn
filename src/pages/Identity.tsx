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
import clsx from 'clsx';
import React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {getIdentityFn, createIdentityFn, deleteIdentityFn} from '../config';
import {toast} from 'react-toastify';
import Loading from '../components/Loading';
import {getNativeSelectUtilityClasses} from '@mui/material';

interface IdentityData {
  identity: string;
  isUse: boolean;
  id: string;
}

function Identity() {
  const fileRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [file, setFile] = React.useState<File | string>('');
  const [fileName, setFileName] = React.useState<any>('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [passphrase, setPassphrase] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const queryClient = useQueryClient();
  const {isLoading, data} = useQuery({
    queryKey: ['identitykey'],
    queryFn: getIdentityFn,
  });
  const {mutate: deleteIdentity} = useMutation((identityId: string) => deleteIdentityFn(identityId), {
    onSuccess(data) {
      queryClient.invalidateQueries('identitykey');
      toast.success('Identity deleted successfully');
    },
  });
  const {mutate: createIdentity, error} = useMutation((identity: FormData) => createIdentityFn(identity), {
    onSuccess: () => {
      queryClient.invalidateQueries(['identitykey']);
      toast.success('Identity created successfully');
    },
    onError: () => {
      setErrorMessage('Passphrase or json file is wrong');
    },
  });

  //function
  const onDeleteHandler = (identityId: string) => {
    deleteIdentity(identityId);
  };
  const onSubmitHandler = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('passphrase', passphrase);
    createIdentity(formData);
  };
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const addImageToPost = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
      console.log(file);
    }
  };

  // show data

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className='border-box  border-b border-gray-200 font-sans text-gray-900'>
        <div className='mx-auto mt-1 flex w-full justify-center pb-8 sm:max-w-lg'>
          <div className=' flex h-auto w-full flex-col items-center justify-center bg-white sm:w-3/4 sm:rounded-lg sm:shadow-2xl'>
            <div className='mt-10 mb-10 text-center'>
              <h2 className='mb-2 text-2xl font-semibold'>Add Identity</h2>
              <p className='text-xs text-gray-500'>File should be of format .json</p>
            </div>
            {file && <p className='mb-2 flex items-center text-xs text-gray-500'>{fileName}</p>}

            <div
              onClick={() => fileRef.current?.click()}
              className='relative h-32 w-4/5 max-w-xs rounded-lg bg-gray-100 shadow-inner'
            >
              <input ref={fileRef} onChange={addImageToPost} type='file' id='file-upload' className='hidden' />
              <label
                htmlFor='file-upload'
                className='z-20 flex h-full w-full cursor-pointer flex-col-reverse items-center justify-center'
              >
                <p className='z-10 text-center text-xs font-light text-gray-500'>
                  Drag & Drop your files here or click file to upload
                </p>
                <svg
                  className='z-10 h-8 w-8 text-indigo-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'></path>
                </svg>
              </label>
            </div>
            <div className='mt-2 mb-6 flex flex-col items-center justify-center '>
              <input
                type='password'
                placeholder='Passphrase'
                onChange={(e) => setPassphrase(e.target.value)}
                className=' border-blue-[#F3F4F6] border bg-gray-100 placeholder:pl-2 placeholder:text-xs'
              />
              {errorMessage ? <p className='mt-1 text-sm text-red-600'>{errorMessage}</p> : null}
              <button
                onClick={() => onSubmitHandler()}
                className='mt-2 rounded bg-[#818CF8] p-1 px-2 text-sm text-white'
              >
                Add Identity
              </button>
            </div>
          </div>
        </div>
      </div>
      {data?.data ? (
        <TableContainer component={Paper} className='mt-6'>
          <Table sx={{minWidth: 650}} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>‌Identity</TableCell>
                <TableCell>In Use</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((row: IdentityData) => (
                <TableRow key={row.id}>
                  <TableCell component='th' scope='row'>
                    {row.identity}
                  </TableCell>
                  <TableCell>
                    <p className={clsx(row.isUse === false ? 'text-green-600' : 'text-red-500')}>
                      {row.isUse === false ? 'No' : 'Yes'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onDeleteHandler(row.id)}
                      className='rounded-md bg-red-600 p-2 font-bold text-white'
                    >
                      Delete Identity
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
      ) : (
        <p className='flex items-center justify-center text-2xl font-bold'>
          {error instanceof Error && 'Something went wrong'}
        </p>
      )}
    </div>
  );
}

export default Identity;
