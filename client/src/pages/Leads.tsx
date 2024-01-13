// import React, { useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
// import { useState } from 'react';
// import {
//   Card,
//   Table,
//   Stack,
//   Paper,
//   Avatar,
//   Button,
//   Popover,
//   Checkbox,
//   TableRow,
//   MenuItem,
//   TableBody,
//   TableCell,
//   Container,
//   Typography,
//   IconButton,
//   TableContainer,
//   TablePagination,
//   Box,
//   Grid,
//   Select,
//   FormControl,
//   InputLabel,
//   SelectChangeEvent
// } from '@mui/material';

// import Iconify from '../components/iconify';
// import Scrollbar from '../components/scrollbar';
// import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// import USERLIST from '../_mock/user';
// import { CategoryResponseTypes, LeadsTypes } from '../types';
// import axios from 'axios';
// import CustomModal from '../components/modals/CustomModal';
// import CustomInput from '../components/input/CustomInput';
// import CsvUpload from '../components/upload-file/CsvUpload';
// import { getLeads } from '../redux/middleware/lead';
// import { useAppDispatch, useAppSelector } from '../hooks/hooks';
// import { leadsList } from '../redux/slice/leadSlice';
// import createAbortController from '../utils/createAbortController';
// import { categorySelector } from '../redux/slice/categorySlice';
// import { baseURL } from '../libs/client/apiClient';

// const TABLE_HEAD = [
//   { id: 'firstName', label: 'First Name', alignRight: false },
//   { id: 'lastName', label: 'Last Name', alignRight: false },
//   { id: 'email', label: 'Email', alignRight: false },
//   { id: 'phone', label: 'Phone', alignRight: false },
//   { id: '' }
// ];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function applySortFilter(array, comparator, query) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   if (query) {
//     return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }
//   return stabilizedThis.map((el) => el[0]);
// }

// const leadsInitialState = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   phone: '',
//   categoryId: ''
// };

// const categoryInitialState = {
//   name: '',
//   description: ''
// };

// export default function Leads() {
//   const dispatch = useAppDispatch();
//   const leads = useAppSelector(leadsList);
//   const categories: CategoryResponseTypes[] = useAppSelector(categorySelector);
//   const { signal, abort } = createAbortController();

//   const [lead, setLead] = useState<LeadsTypes>(leadsInitialState);
//   const [category, setCategory] = useState(categoryInitialState);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
//   const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
//   const [bulkLeads, setBulkLeads] = useState([]);

//   //!----------------------
//   const [open, setOpen] = useState(null);
//   const [page, setPage] = useState(0);

//   const [order, setOrder] = useState('asc');

//   const [selected, setSelected] = useState([]);

//   const [orderBy, setOrderBy] = useState('name');

//   const [filterName, setFilterName] = useState('');

//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     if (!categories.length) return;
//     (async () => {
//       try {
//         await dispatch(getLeads({ categoryId: categories[0].id, signal }));
//       } catch (error) {
//         console.log('Error:(', error);
//       }
//     })();
//     return () => {
//       abort();
//     };
//   }, []);

//   const submitLead = async () => {
//     try {
//       await axios.post(`${baseURL}/lead`, lead);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.log('Error:(', error);
//     }
//   };
//   const submitCategory = async () => {
//     try {
//       await axios.post(`${baseURL}/category`, category);
//       setIsCategoryModalOpen(false);
//     } catch (error) {
//       console.log('Error:(', error);
//     }
//   };

//   const submitBulkLeads = async () => {
//     try {
//       if (!bulkLeads.length) return;
//       const response = await axios.post(`${baseURL}/lead/bulk`, bulkLeads);
//       if (response?.status === 200) {
//         setIsCsvModalOpen(false);
//       }
//     } catch (error) {
//       console.log('Error:(', error);
//     }
//   };

//   const handleCsvData = (data) => {
//     setBulkLeads(data);
//   };

//   //!----------

//   const handleOpenMenu = (event) => {
//     setOpen(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setOpen(null);
//   };

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = USERLIST.map((n) => n.name);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (event, name) => {
//     const selectedIndex = selected.indexOf(name);
//     let newSelected = [];
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setPage(0);
//     setRowsPerPage(parseInt(event.target.value, 10));
//   };

//   const handleFilterByName = (event) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

//   const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

//   const isNotFound = !filteredUsers.length && !!filterName;

//   return (
//     <>
//       <Helmet>
//         <title> Lead | Minimal UI </title>
//       </Helmet>

//       <Container>
//         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
//           <Typography variant="h4" gutterBottom>
//             Leads
//           </Typography>
//           <Box sx={{ display: 'flex', gap: '1rem' }}>
//             <Button variant="contained" onClick={() => setIsCategoryModalOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
//               New Category
//             </Button>
//             <Button variant="contained" onClick={() => setIsModalOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
//               New Lead
//             </Button>
//             <Button variant="contained" onClick={() => setIsCsvModalOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
//               Upload Lead CSV
//             </Button>
//           </Box>
//         </Stack>
//         <Stack direction="row" alignItems="center" gap={2} mb={5}>
//           {categories &&
//             categories.map((category: CategoryResponseTypes) => (
//               <Button key={category.id} variant="outlined">
//                 {category.name}
//               </Button>
//             ))}
//         </Stack>
//         <CustomModal title="Add Lead" open={isModalOpen} setOpen={() => setIsModalOpen(false)} handleSubmit={submitLead}>
//           <Grid>
//             <CustomInput
//               label="First Name"
//               name={lead.firstName}
//               value={lead.firstName}
//               onChange={(e) => {
//                 setLead({ ...lead, firstName: e.target.value });
//               }}
//             />
//             <CustomInput
//               label="Last Name"
//               name={lead.lastName}
//               value={lead.lastName}
//               onChange={(e) => {
//                 setLead({ ...lead, lastName: e.target.value });
//               }}
//             />
//             <CustomInput
//               label="Email"
//               name={lead.email}
//               value={lead.email}
//               onChange={(e) => {
//                 setLead({ ...lead, email: e.target.value });
//               }}
//             />
//             <CustomInput
//               label="Phone"
//               name={lead.phone}
//               value={lead.phone}
//               onChange={(e) => {
//                 setLead({ ...lead, phone: e.target.value });
//               }}
//             />
//             <FormControl fullWidth sx={{ mt: '.8rem' }}>
//               <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
//               <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 value={lead.categoryId}
//                 label="Select Category"
//                 onChange={(e: SelectChangeEvent) => {
//                   setLead({ ...lead, categoryId: e.target.value });
//                 }}
//               >
//                 {categories.map((category: CategoryResponseTypes) => (
//                   <MenuItem key={category.id} value={category.id}>
//                     {category.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         </CustomModal>
//         <CustomModal
//           title="Add Category"
//           open={isCategoryModalOpen}
//           setOpen={() => setIsCategoryModalOpen(false)}
//           handleSubmit={submitCategory}
//         >
//           <Grid>
//             <CustomInput
//               label="Name"
//               name={category.name}
//               value={category.name}
//               onChange={(e) => {
//                 setCategory({ ...category, name: e.target.value });
//               }}
//             />
//             <CustomInput
//               label="Description"
//               name={category.description}
//               value={category.description}
//               onChange={(e) => {
//                 setCategory({ ...category, description: e.target.value });
//               }}
//             />
//           </Grid>
//         </CustomModal>
//         <CustomModal
//           title="Upload Lead CSV"
//           open={isCsvModalOpen}
//           setOpen={() => setIsCsvModalOpen(false)}
//           handleSubmit={submitBulkLeads}
//           size="lg"
//         >
//           <CsvUpload handleCsvData={handleCsvData} />
//           <TableContainer sx={{ minWidth: 700, mt: '1rem' }}>
//             <Table>
//               <UserListHead
//                 order={order}
//                 orderBy={orderBy}
//                 headLabel={TABLE_HEAD}
//                 rowCount={USERLIST.length}
//                 numSelected={selected.length}
//                 onRequestSort={handleRequestSort}
//                 onSelectAllClick={handleSelectAllClick}
//               />
//               <TableBody>
//                 {bulkLeads?.map((lead: LeadsTypes, index) => {
//                   const { firstName, lastName, email, phone } = lead;
//                   const selectedUser = selected.indexOf(filterName) !== -1;

//                   return (
//                     <TableRow hover key={firstName} tabIndex={-1} role="checkbox" selected={selectedUser}>
//                       <TableCell padding="checkbox">
//                         <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
//                       </TableCell>

//                       <TableCell component="th" scope="row" padding="none">
//                         <Stack direction="row" alignItems="center" spacing={2}>
//                           <Avatar alt={firstName} src={`/assets/images/avatars/avatar_${index + 1}.jpg`} />
//                           <Typography variant="subtitle2" noWrap>
//                             {firstName}
//                           </Typography>
//                         </Stack>
//                       </TableCell>

//                       <TableCell align="left">{lastName}</TableCell>

//                       <TableCell align="left">{email}</TableCell>

//                       <TableCell align="left">{phone}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//                 {emptyRows > 0 && (
//                   <TableRow style={{ height: 53 * emptyRows }}>
//                     <TableCell colSpan={6} />
//                   </TableRow>
//                 )}
//               </TableBody>

//               {isNotFound && (
//                 <TableBody>
//                   <TableRow>
//                     <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
//                       <Paper
//                         sx={{
//                           textAlign: 'center'
//                         }}
//                       >
//                         <Typography variant="h6" paragraph>
//                           Not found
//                         </Typography>

//                         <Typography variant="body2">
//                           No results found for &nbsp;
//                           <strong>&quot;{filterName}&quot;</strong>.
//                           <br /> Try checking for typos or using complete words.
//                         </Typography>
//                       </Paper>
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               )}
//             </Table>
//           </TableContainer>
//         </CustomModal>
//         <Card>
//           <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
//           <Scrollbar>
//             <TableContainer sx={{ minWidth: 800 }}>
//               <Table>
//                 <UserListHead
//                   order={order}
//                   orderBy={orderBy}
//                   headLabel={TABLE_HEAD}
//                   rowCount={USERLIST.length}
//                   numSelected={selected.length}
//                   onRequestSort={handleRequestSort}
//                   onSelectAllClick={handleSelectAllClick}
//                 />
//                 <TableBody>
//                   {leads?.map((lead: LeadsTypes, index) => {
//                     const { id, firstName, lastName, email, phone } = lead;
//                     const selectedUser = selected.indexOf(filterName) !== -1;

//                     return (
//                       <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
//                         <TableCell padding="checkbox">
//                           <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
//                         </TableCell>

//                         <TableCell component="th" scope="row" padding="none">
//                           <Stack direction="row" alignItems="center" spacing={2}>
//                             <Avatar alt={firstName} src={`/assets/images/avatars/avatar_${index + 1}.jpg`} />
//                             <Typography variant="subtitle2" noWrap>
//                               {firstName}
//                             </Typography>
//                           </Stack>
//                         </TableCell>

//                         <TableCell align="left">{lastName}</TableCell>

//                         <TableCell align="left">{email}</TableCell>

//                         <TableCell align="left">{phone}</TableCell>
//                         <TableCell align="right">
//                           <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
//                             <Iconify icon={'eva:more-vertical-fill'} />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}

//                   {emptyRows > 0 && (
//                     <TableRow style={{ height: 53 * emptyRows }}>
//                       <TableCell colSpan={6} />
//                     </TableRow>
//                   )}
//                 </TableBody>

//                 {isNotFound && (
//                   <TableBody>
//                     <TableRow>
//                       <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
//                         <Paper
//                           sx={{
//                             textAlign: 'center'
//                           }}
//                         >
//                           <Typography variant="h6" paragraph>
//                             Not found
//                           </Typography>

//                           <Typography variant="body2">
//                             No results found for &nbsp;
//                             <strong>&quot;{filterName}&quot;</strong>.
//                             <br /> Try checking for typos or using complete words.
//                           </Typography>
//                         </Paper>
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 )}
//               </Table>
//             </TableContainer>
//           </Scrollbar>

//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={USERLIST.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Card>
//       </Container>

//       <Popover
//         open={Boolean(open)}
//         anchorEl={open}
//         onClose={handleCloseMenu}
//         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         PaperProps={{
//           sx: {
//             p: 1,
//             width: 140,
//             '& .MuiMenuItem-root': {
//               px: 1,
//               typography: 'body2',
//               borderRadius: 0.75
//             }
//           }
//         }}
//       >
//         <MenuItem>
//           <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
//           Edit
//         </MenuItem>

//         <MenuItem sx={{ color: 'error.main' }}>
//           <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
//           Delete
//         </MenuItem>
//       </Popover>
//     </>
//   );
// }
