import React, { useState } from 'react';

import Papa from 'papaparse';

// const CsvUpload = (props) => {
interface CsvUploadProps {
  handleCsvData: (data: any) => void;
}

function CsvUpload({ handleCsvData }: CsvUploadProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    console.log('Lead Submitted!');
  };

  const handleFileUpload = (event) => {
    //  alert('File uploaded!');
    const file = event.target.files[0];
    setLoading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
        //  console.log(results.data);
        handleCsvData(results.data);
      }
    });
  };

  const handleUpload = () => {
    setLoading(true);

    // Check Uploaded EALERTS

    data.forEach((lead) => {
      console.log(lead);
    });
    alert('File uploaded!');

    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {loading && <p>Loading...</p>}
      {data && <button onClick={handleFileUpload}>Upload</button>}
    </div>
  );
}

export default CsvUpload;
