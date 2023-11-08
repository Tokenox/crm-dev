import { Button, Container, Grid } from '@mui/material';
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
import { createCategory, getCategories } from '../redux/middleware/category';
import { createBulkLead, createLead, getLeads, updateLead } from '../redux/middleware/lead';
import { setAlert } from '../redux/slice/alertSlice';
import { categorySelector } from '../redux/slice/categorySlice';
import { leadState, openModal } from '../redux/slice/leadSlice';
import { CategoryResponseTypes, CategoryTypes, FieldTypes } from '../types';
import createAbortController from '../utils/createAbortController';
import CustomTable from '../components/custom-table/CustomTable';

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
    setSelectedCategoryId(categories[0].id);
    (async () => {
      await dispatch(getLeads({ categoryId: categories[0].id, signal }));
    })();
    const updatedFields = categories[0].fields.map((field) => {
      return {
        ...field,
        value: ''
      };
    });
    setColumnFields(updatedFields);
    return () => {
      abort();
    };
  }, [categories]);

  //! get selected category data
  const getSelectedCategoryData = (id) => {
    const categoryData = categories.find((category) => category.id === id);
    const updatedFields = categoryData.fields.map((field) => {
      return {
        ...field,
        value: ''
      };
    });
    setSelectedCategoryId(categoryData.id);
    setColumnFields(updatedFields);
    setCategoryData(categoryData);
    if (categoryData.id === id) {
      (async () => {
        await dispatch(getLeads({ categoryId: id, signal }));
      })();
    }
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
  const editLead = (e, lead) => {
    e.stopPropagation();
    const updatedData = [...columnFields];
    updatedData.forEach((data) => {
      data.value = lead[data.name];
    });
    setColumnFields(updatedData);
    setLeadValues(lead);
    setIsAddLeadModalOpen(true);
    setIsLeadEdit(true);
  };

  const submitAddNewLead = async () => {
    const data = {
      tableId: selectedCategoryId,
      data: leadValues
    };
    debugger;
    if (isLeadEdit) await dispatch(updateLead({ lead: data, signal }));
    else await dispatch(createLead({ lead: data, signal }));
    setIsAddLeadModalOpen(false);
  };

  const submitCategory = async () => {
    try {
      const formattedData = {
        name: addCategory.name,
        description: addCategory.description || '',
        fields: fields
      };
      await dispatch(createCategory({ category: formattedData }));
      setIsCategoryModalOpen(false);
      setAddCategory(initialCategoryState);
      setFields([initialFieldState]);
    } catch (error) {
      console.log('Error:(', error);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title> Dynamic Leads | Minimal UI </title>
      </Helmet>
      <Container>
        <h1>Dynamic Lead</h1>
        <Stack direction="row" alignItems="center" gap={2} mb={5} overflow="scroll" width={'100%'}>
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
          >
            <AddLead leadValue={columnFields} getAddLeadData={getAddLeadData} />
          </CustomModal>
        </Box>
        <Box>
          <CustomModal
            title="Add Category"
            open={isCategoryModalOpen}
            setOpen={() => setIsCategoryModalOpen(false)}
            handleSubmit={submitCategory}
          >
            <AddCategory
              fields={fields}
              getFieldsData={getFieldsData}
              addNewField={addNewField}
              category={addCategory}
              setCategory={setAddCategory}
              removeField={removeField}
            />
          </CustomModal>
        </Box>
        {(categories.length && leadsData.length && <CustomTable data={leadsData} headLabel={columnFields} onEditClick={editLead} />) ||
          'Loading'}
      </Container>
    </Fragment>
  );
};

export default DynamicLead;
