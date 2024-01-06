import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Select,
  SelectChangeEvent,
  InputLabel,
  Dialog
} from '@mui/material';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { getUsers, updateAdmin } from '../redux/middleware/admin';
import createAbortController from '../utils/createAbortController';
import { adminSelector, loadingAdmin } from '../redux/slice/adminSlice';
import { loadingRole, roleList } from '../redux/slice/roleSlice';
import CustomModal from '../components/modals/CustomModal';
import AddUserForm from '../components/add-user-form/AddUserForm';
import { setAlert } from '../redux/slice/alertSlice';
import { createRole, deleteRole, getRoles } from '../redux/middleware/role';
import CustomInput from '../components/input/CustomInput';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', name: 'Name', alignRight: false },
  { id: 'email', name: 'Email', alignRight: false },
  { id: 'company', name: 'Company', alignRight: false },
  { id: 'role', name: 'Role', alignRight: false },
  { id: 'isSuperAdmin', name: 'Super Admin', alignRight: false },
  // { id: 'isVerified', name: 'Verified', alignRight: false },
  // { id: 'status', name: 'Status', alignRight: false },
  { id: '' }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const initialState = {
  id: '',
  name: '',
  role: '',
  isSuperAdmin: false
};

export default function UserPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(adminSelector);
  const roleLoading = useAppSelector(loadingRole);
  const adminLoading = useAppSelector(loadingAdmin);
  const roles = useAppSelector(roleList);
  const { signal, abort } = createAbortController();
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState(initialState);
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    (async () => {
      await dispatch(getUsers({ signal }));
      await dispatch(getRoles({ signal }));
    })();

    return () => {
      abort();
    };
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const getSelectedUser = (userData) => {
    setUser({ ...user, id: userData.id, name: userData.name, role: userData.role, isSuperAdmin: userData.isSuperAdmin });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const updateUser = async () => {
    if (!user.name) {
      return dispatch(setAlert({ message: 'Name can not be empty.', type: 'error' }));
    }
    const response = await dispatch(updateAdmin({ id: user.id, name: user.name, role: user.role, isSuperAdmin: user.isSuperAdmin }));
    if (response && response.payload) {
      await dispatch(getUsers({ signal }));
    }
    setIsModalOpen(false);
    handleCloseMenu();
  };

  const submitRole = async () => {
    if (!newRole) {
      dispatch(setAlert({ message: 'Please add a role', type: 'error' }));
      return;
    }
    const isDuplicate = roles.find((item) => item.name === newRole);

    if (isDuplicate) {
      return dispatch(setAlert({ message: 'Duplicate role name', type: 'error' }));
    }
    await dispatch(createRole({ role: newRole }));

    await dispatch(getRoles({ signal }));

    setIsRoleModalOpen(false);
    handleCloseMenu();
    setNewRole('');
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Box sx={{ display: 'flex', gap: '6px' }}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsRoleModalOpen(true)}>
              Add New Role
            </Button>
            {/* <Button variant="contained" onClick={() => setDeleteRoleModalOpen(true)}>
              Delete Role
            </Button> */}
          </Box>
        </Stack>
        <CustomModal
          title="Add New Role"
          open={isRoleModalOpen}
          setOpen={setIsRoleModalOpen}
          handleSubmit={submitRole}
          loading={roleLoading}
        >
          <CustomInput value={newRole} onChange={(e) => setNewRole(e.target.value)} name="name" label="Role" />
        </CustomModal>
        <CustomModal title="Update User" open={isModalOpen} setOpen={setIsModalOpen} handleSubmit={updateUser} loading={adminLoading}>
          <AddUserForm
            user={user}
            roles={roles}
            getUsersData={(value, name) => {
              setUser({ ...user, [name]: value });
            }}
          />
        </CustomModal>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { name, email, role, company, avatarUrl, isSuperAdmin } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={name} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{company}</TableCell>

                        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
                          {role}
                        </TableCell>
                        {isSuperAdmin ? (
                          <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
                            True
                          </TableCell>
                        ) : (
                          <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
                            False
                          </TableCell>
                        )}

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* 
                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              handleOpenMenu(event);
                              getSelectedUser(row);
                            }}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        <MenuItem onClick={() => setIsModalOpen(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
