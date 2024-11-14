import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const [studentID, setStudentID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

  const handleScan = (err, result) => {
    if (result) {
      setStudentID(result.text);
      setScanning(false);
      fetchStudentName(result.text);
    }
  };

  const fetchStudentName = (id) => {
    const file = '/student-database.xlsx';
    const fetchData = async () => {
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const student = data.find(student => String(student.studentID).trim() === String(id).trim());
      if (student) {
        setStudentName(student.name);
        navigate('/student-info', { state: { studentID: id, studentName: student.name } });
      } else {
        setStudentName('Student not found');
      }
    };
    fetchData();
  };

  return (
    <div>
      <h1>Login</h1>
      {scanning ? (
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={handleScan}
        />
      ) : (
        <p>Student ID: {studentID}</p>
      )}
      {studentName && <p>Student Name: {studentName}</p>}
      
    </div>
  );
};

export default Login;
