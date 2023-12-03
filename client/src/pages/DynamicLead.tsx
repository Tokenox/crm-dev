import { Button, Card, CircularProgress, Container, Grid } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AddCategory from '../components/add-category/AddCategory';
import AddLead from '../components/add-lead/AddLead';
import CustomInput from '../components/input/CustomInput';
import LeadsTable from '../components/csv-table/CsvTable';
import CustomModal from '../components/modals/CustomModal';
import CsvUpload from '../components/upload-file/CsvUpload';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { addNewColumn, createCategory, getCategories } from '../redux/middleware/category';
import { createBulkLead, createLead, deleteLead, getLeads, updateLead } from '../redux/middleware/lead';
import { setAlert } from '../redux/slice/alertSlice';
import { categorySelector, loadingCategory } from '../redux/slice/categorySlice';
import { leadState, leadsList, loadingLead, openModal } from '../redux/slice/leadSlice';
import { CategoryResponseTypes, CategoryTypes, FieldTypes } from '../types';
import createAbortController from '../utils/createAbortController';
import CustomTable from '../components/custom-table/CustomTable';
import CustomDynamicTable from '../components/custom-table/CustomDynamicTable';

const initialCategoryState = {
  name: '',
  description: ''
};
const initialFieldState = {
  name: '',
  type: ''
};

const DynamicLead = () => {
  const categories: CategoryResponseTypes[] = useAppSelector(categorySelector);
  const categoryLoading = useAppSelector(loadingCategory);
  const leadLoading = useAppSelector(loadingLead);
  const { data: leadsData, isModalOpen } = useAppSelector(leadState);
  const dispatch = useAppDispatch();
  const { signal, abort } = createAbortController();
  const [uploadedLeads, setUploadedLeads] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [addCategory, setAddCategory] = useState<CategoryTypes>(initialCategoryState);
  const [fields, setFields] = useState<FieldTypes[]>([initialFieldState]);
  const [columnFields, setColumnFields] = useState<any>([]);
  const [leadValues, setLeadValues] = useState({});
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryData, setCategoryData] = useState<CategoryResponseTypes>();
  const [isLeadEdit, setIsLeadEdit] = useState<boolean>(false);
  const [isCategoryEdit, setIsCategoryEdit] = useState<boolean>(false);
  const [leadListLoading, setLeadListLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await dispatch(getCategories({ signal }));
    })();
    return () => {
      abort();
    };
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    setSelectedCategoryId(selectedCategoryId || categories[0].id);
    (async () => {
      await dispatch(getLeads({ categoryId: selectedCategoryId || categories[0].id, signal }));
    })();
    // find selected category data
    let updatedFields;
    const categoryData = categories.find((category) => category.id === selectedCategoryId);
    if (categoryData) {
      updatedFields = categoryData.fields.map((field) => {
        return {
          ...field,
          value: ''
        };
      });
    } else {
      updatedFields = categories[0].fields.map((field) => {
        return {
          ...field,
          value: ''
        };
      });
    }
    setColumnFields(updatedFields);
    return () => {
      abort();
    };
  }, [categories]);

  //! get selected category data
  const getSelectedCategoryData = (id) => {
    setLeadListLoading(true);
    const categoryData = categories.find((category) => category.id === id);
    if (categoryData.id === id) {
      (async () => {
        await dispatch(getLeads({ categoryId: id, signal }));
        setLeadListLoading(false);
      })();
    }
    const updatedFields = categoryData.fields.map((field) => {
      return {
        ...field,
        value: ''
      };
    });
    setSelectedCategoryId(categoryData.id);
    setColumnFields(updatedFields);
    setCategoryData(categoryData);
  };

  const handleCsvData = (csvData) => {
    setUploadedLeads(csvData);
  };

  const submitBulkLeads = async () => {
    if (!categoryName) {
      dispatch(setAlert({ message: 'Please add category name', type: 'error' }));
      return;
    }
    if (!uploadedLeads.length) {
      dispatch(setAlert({ message: 'Please upload leads', type: 'error' }));
      return;
    }

    const leadsFormattedData = {
      tableName: categoryName,
      fields: getColumns(uploadedLeads),
      data: uploadedLeads
    };
    await dispatch(createBulkLead({ leads: leadsFormattedData, signal }));
  };

  const getColumns = useCallback((data: any) => {
    const columns = [];
    const keys = Object?.keys(data[0]);
    keys.forEach((key) => {
      columns.push({
        name: key,
        type: 'string'
      });
    });
    return columns;
  }, []);

  const addNewField = () => {
    const updatedField = [...fields];
    updatedField.push({
      name: '',
      type: ''
    });
    setFields(updatedField);
  };

  const removeField = (index) => {
    const updatedField = [...fields];
    updatedField.splice(index, 1);
    setFields(updatedField);
  };

  const getAddLeadData = (value, name, index) => {
    const updatedData = [...columnFields];
    updatedData[index]['value'] = value;
    setColumnFields(updatedData);
    const data = {
      ...leadValues,
      [updatedData[index]['name']]: value
    };
    setLeadValues(data);
  };

  const getFieldsData = (value, name, index) => {
    const updatedField = [...fields];
    updatedField[index][name] = value;
    setFields(updatedField);
  };

  //! Edit lead
  const editLead = async (e, lead) => {
    e.stopPropagation();
    const updatedData = [...columnFields];
    updatedData.forEach((data) => {
      data.value = lead[data.name];
    });
    setColumnFields(updatedData);
    setLeadValues(lead);
    setIsAddLeadModalOpen(true);
    setIsLeadEdit(true);
    await dispatch(getLeads({ categoryId: selectedCategoryId, signal }));
  };

  //! Delete lead
  const deleteDynamicLead = async (e, lead) => {
    e.stopPropagation();
    await dispatch(deleteLead({ id: lead.id, tableId: selectedCategoryId }));
    await dispatch(getLeads({ categoryId: selectedCategoryId, signal }));
  };

  //! Add new column into category
  const updateCategory = async () => {
    debugger;
    if (!selectedCategoryId) return;
    const updatedFields = [...columnFields, ...fields];
    const isInvalid = fields.some((field) => {
      return !field.name || !field.type;
    });
    if (isInvalid) {
      return dispatch(setAlert({ message: 'Please fill all fields', type: 'error' }));
    }
    const isDuplicate = columnFields.some((field) => {
      return fields.find((item) => item.name.toLocaleLowerCase() === field.name.toLocaleLowerCase());
    });
    if (isDuplicate) {
      return dispatch(setAlert({ message: 'Duplicate column name', type: 'error' }));
    }
    await dispatch(addNewColumn({ tableId: selectedCategoryId, fields }));

    await dispatch(getCategories({ signal }));
    setFields([initialFieldState]);
    fields.forEach((field) => {
      field.name = '';
      field.type = '';
    });
    setIsCategoryModalOpen(false);
  };

  const submitAddNewLead = async () => {
    for (const item of columnFields) {
      if (!item.value) {
        return dispatch(setAlert({ message: 'Fields can not be empty.', type: 'error' }));
      }
    }
    const data = {
      tableId: selectedCategoryId,
      data: leadValues
    };
    if (isLeadEdit) {
      await dispatch(updateLead({ lead: data, signal }));
    } else {
      await dispatch(createLead({ lead: data, signal }));
    }
    setIsAddLeadModalOpen(false);
    await dispatch(getLeads({ categoryId: selectedCategoryId, signal }));
    setIsLeadEdit(false);

    columnFields.forEach((field) => {
      field.value = '';
    });
  };

  //! Add new category
  const submitCategory = async () => {
    if (!addCategory.name) {
      return dispatch(setAlert({ message: 'Category name can not be empty.', type: 'error' }));
    }
    const filterCategoryName = categories.find((item) => addCategory.name.toLowerCase() === item.name.toLowerCase());
    if (filterCategoryName) return dispatch(setAlert({ message: 'Category name already exists', type: 'error' }));

    const isInvalid = fields.some((field) => {
      return !field.name || !field.type;
    });
    if (isInvalid) {
      return dispatch(setAlert({ message: 'Please fill all fields', type: 'error' }));
    }
    const isDuplicate = fields.some((field, index) => {
      return fields.findIndex((item) => item.name.toLocaleLowerCase() === field.name.toLocaleLowerCase()) !== index;
    });
    if (isDuplicate) {
      return dispatch(setAlert({ message: 'Fields name should be unique', type: 'error' }));
    }
    const formattedData = {
      name: addCategory.name,
      description: addCategory.description || '',
      fields: fields
    };
    await dispatch(createCategory({ category: formattedData, signal }));
    setIsCategoryModalOpen(false);
    setAddCategory(initialCategoryState);
    setFields([initialFieldState]);
    await dispatch(getCategories({ signal }));
    fields.forEach((field) => {
      field.name = '';
      field.type = '';
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title> Dynamic Leads | Minimal UI </title>
      </Helmet>
      <Container>
        <h1>Dynamic Lead</h1>
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          mb={5}
          pb={2}
          sx={{
            overflowX: 'scroll',
            scrollbarWidth: 'auto',

            '&::-webkit-scrollbar': {
              width: '2px',
              maxHeight: '5px',
              borderRadius: '20px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
              borderRadius: '20px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D3D3D3',
              scrollbarGutter: 'stable',
              borderRadius: '20px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#D3D3D3',
              borderRadius: '20px'
            }
          }}
          width={'100%'}
        >
          {(categories &&
            categories.map((category: CategoryResponseTypes) => (
              <Button
                key={category.name}
                variant={selectedCategoryId === category.id ? 'contained' : 'outlined'}
                sx={{ minWidth: 'auto' }}
                onClick={() => {
                  getSelectedCategoryData(category.id);
                }}
              >
                {category.name}
              </Button>
            ))) ||
            ''}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={() => setIsCategoryModalOpen(true)} variant="contained">
            Add Category
          </Button>
          <Button onClick={() => dispatch(openModal(true))} variant="contained">
            Upload CSV
          </Button>
          <Button onClick={() => setIsAddLeadModalOpen(true)} variant="contained">
            Add Lead
          </Button>
        </Box>
        <Box>
          <CustomModal
            title="Upload Lead CSV"
            open={isModalOpen}
            setOpen={() => dispatch(openModal(false))}
            handleSubmit={submitBulkLeads}
            loading={leadLoading}
            size="lg"
          >
            <CsvUpload handleCsvData={handleCsvData} />
            <Grid sx={{ mt: 2, width: '30%' }}>
              <CustomInput label="Name" name="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </Grid>
            {(uploadedLeads.length && <LeadsTable data={uploadedLeads} headLabel={getColumns(uploadedLeads)} />) || ''}
          </CustomModal>
        </Box>
        <Box>
          <CustomModal
            title={categoryData?.name || 'Add Lead'}
            open={isAddLeadModalOpen}
            setOpen={() => setIsAddLeadModalOpen(false)}
            handleSubmit={submitAddNewLead}
            loading={leadLoading}
          >
            <AddLead leadValue={columnFields} getAddLeadData={getAddLeadData} />
          </CustomModal>
        </Box>
        <Box>
          <CustomModal
            title={`${isCategoryEdit ? 'Edit' : 'Add'} Category`}
            open={isCategoryModalOpen}
            setOpen={() => setIsCategoryModalOpen(false)}
            handleSubmit={isCategoryEdit ? updateCategory : submitCategory}
            setIsEdit={setIsCategoryEdit}
            loading={categoryLoading}
          >
            <AddCategory
              fields={fields}
              getFieldsData={getFieldsData}
              addNewField={addNewField}
              category={addCategory}
              setCategory={setAddCategory}
              removeField={removeField}
              isEdit={isCategoryEdit}
            />
          </CustomModal>
        </Box>
        <Card
          sx={{
            mt: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: 1
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setIsCategoryModalOpen(true);
                setIsCategoryEdit(true);
              }}
            >
              Add New Column
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 1
            }}
          >
            {categoryLoading || leadListLoading ? (
              <CircularProgress />
            ) : (
              <CustomTable
                data={leadsData}
                headLabel={columnFields}
                onEditClick={editLead}
                onDeleteClick={deleteDynamicLead}
                loading={leadListLoading}
              />
            )}
          </Box>
        </Card>
      </Container>
    </Fragment>
  );
};

export default DynamicLead;
