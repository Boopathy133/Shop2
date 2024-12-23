// import React, { useState } from 'react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import * as XLSX from 'xlsx';
// import { useNavigate } from 'react-router-dom';



// const Login = () => {
//   const [studentID, setStudentID] = useState('2022ETUIT010');
//   const [studentName, setStudentName] = useState('BOOPATHY  M');
//   const [scanning, setScanning] = useState(true);
//   const navigate = useNavigate();

//   const handleScan = (err, result) => {
//     if (result) {
//       setStudentID(result.text);
//       setScanning(false);
//       fetchStudentName(result.text);
//     }
//   };

//   const fetchStudentName = (id) => {
//     const file = '/student-database.xlsx';
//     const fetchData = async () => {
//       const response = await fetch(file);
//       const arrayBuffer = await response.arrayBuffer();
//       const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const data = XLSX.utils.sheet_to_json(worksheet);

//       const student = data.find(student => String(student.studentID).trim() === String(id).trim());
//       if (student) {
//         setStudentName(student.name);
//         navigate('/student-info', { state: { studentID: id, studentName: student.name } });
//       } else {
//         setStudentName('Student not found');
//       }
//     };
//     fetchData();
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       {scanning ? (
//         <BarcodeScannerComponent
//           width={500}
//           height={500}
//           onUpdate={handleScan}
//         />
//       ) : (
//         <p>Student ID: {studentID}</p>
//       )}
//       {studentName && <p>Student Name: {studentName}</p>}
      
//     </div>
//   );
// };

// export default Login;











// import React, { useState, useEffect } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/library';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [userID, setUserID] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [message, setMessage] = useState('');
//   const [isPasswordSet, setIsPasswordSet] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);
//   const [manualEntry, setManualEntry] = useState(false); // Track manual entry mode
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!manualEntry) {
//       const codeReader = new BrowserMultiFormatReader();
//       codeReader
//         .listVideoInputDevices()
//         .then((videoInputDevices) => {
//           const firstDeviceId = videoInputDevices[0].deviceId;
//           codeReader.decodeFromVideoDevice(firstDeviceId, 'video', (result, error) => {
//             if (result) {
//               onScanSuccess(result.getText());
//               codeReader.reset(); // Stop scanning once we have a result
//             }
//             if (error) {
//               console.warn(error); // Handle errors during scanning
//             }
//           });
//         })
//         .catch((err) => console.error(err));

//       // Cleanup on unmount
//       return () => {
//         codeReader.reset();
//       };
//     }
//   }, [manualEntry]);

//   const onScanSuccess = (decodedText) => {
//     console.log(decodedText); // This will print the scanned user ID
//     setUserID(decodedText);
//     fetchUserData(decodedText); // Fetch user data based on scanned ID
//   };

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     console.log('Manually entered userID:', userID); // Log the userID input
//     if (!userID) {
//       setMessage('Please enter a valid User ID.');
//       return;
//     }
//     fetchUserData(userID); // Fetch user data based on manually entered ID
//   };
  
//   const fetchUserData = async (scannedUserID) => {
//     console.log('Fetching user data for userID:', scannedUserID); // Debug log
//     try {
//       const response = await fetch(`http://localhost:5000/getUserData/${scannedUserID}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
  
//       if (!response.ok) {
//         console.error('Failed to fetch user data. Status:', response.status); // Log HTTP status
//       }
  
//       const data = await response.json();
  
//       if (response.ok) {
//         setUsername(data.username);
//         setIsPasswordSet(!!data.password);
//         setMessage('');
//       } else {
//         setMessage(data.message || 'User ID not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       setMessage('Error fetching user data.');
//     }
//   };
  

//   const handleSetPassword = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:5000/setPassword/${userID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('Password set successfully. You can now log in.');
//         setIsPasswordSet(true);
//       } else {
//         setMessage(data.message || 'Error setting password.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('Error setting password.');
//     }
//   };

//   const handlePasswordValidation = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:5000/validatePassword/${userID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('Login successful');
//         setIsLogin(true);
//         navigate('/Dashboard',{ state: { userID: data.userID } }); // Redirect to the dashboard after successful login
//       } else {
//         setMessage(data.message || 'Invalid password.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('Error validating password.');
//     }
//   };


//   return (
//     <div>
//       <h2>User Login</h2>

//       {!manualEntry && (
//         <div id="qr-code-scanner" style={{ width: '50%', height: '50%' }}>
//           <video id="video" style={{ width: '100%', height: '100%' }}></video>
//         </div>
//       )}

//       <button onClick={() => setManualEntry((prev) => !prev)}>
//         {manualEntry ? 'Switch to QR Scan' : 'Enter User ID Manually'}
//       </button>

//       {manualEntry && (
//         <form onSubmit={handleManualSubmit}>
//           <input
//             type="text"
//             value={userID}
//             onChange={(e) => setUserID(e.target.value)}
//             placeholder="Enter User ID"
//             required
//           />
//           <button type="submit">Submit</button>
//         </form>
//       )}

//       {message && <p>{message}</p>}

//       {username && !isPasswordSet && (
//         <div>
//           <h3>Welcome, {username}!</h3>
//           <h4>Please set a password:</h4>
//           <form onSubmit={handleSetPassword}>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter new password"
//               required
//             />
//             <button type="submit">Set Password</button>
//           </form>
//         </div>
//       )}

//       {isPasswordSet && !isLogin && (
//         <div>
//           <h4>Enter your password to login:</h4>
//           <form onSubmit={handlePasswordValidation}>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//             <button type="submit">Login</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;











import React, { useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [manualEntry, setManualEntry] = useState(false); // Track manual entry mode
  const navigate = useNavigate();

  useEffect(() => {
    if (!manualEntry) {
      const codeReader = new BrowserMultiFormatReader();
      codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
          const firstDeviceId = videoInputDevices[0].deviceId;
          codeReader.decodeFromVideoDevice(firstDeviceId, 'video', (result, error) => {
            if (result) {
              onScanSuccess(result.getText());
              codeReader.reset(); // Stop scanning once we have a result
            }
            if (error) {
              console.warn(error); // Handle errors during scanning
            }
          });
        })
        .catch((err) => console.error(err));

      // Cleanup on unmount
      return () => {
        codeReader.reset();
      };
    }
  }, [manualEntry]);

  const onScanSuccess = (decodedText) => {
    console.log(decodedText); // This will print the scanned user ID
    setUserID(decodedText);
    fetchUserData(decodedText); // Fetch user data based on scanned ID
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    console.log('Manually entered userID:', userID); // Log the userID input
    if (!userID) {
      setMessage('Please enter a valid User ID.');
      return;
    }
    fetchUserData(userID); // Fetch user data based on manually entered ID
  };

  const fetchUserData = async (scannedUserID) => {
    console.log('Fetching user data for userID:', scannedUserID); // Debug log
    try {
      const response = await fetch(`http://localhost:5000/getUserData/${scannedUserID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Failed to fetch user data. Status:', response.status); // Log HTTP status
      }

      const data = await response.json();

      if (response.ok) {
        setUsername(data.username);
        setIsPasswordSet(!!data.password);
        setMessage('');
      } else {
        setMessage(data.message || 'User ID not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Error fetching user data.');
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage('Please enter a password.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/setPassword/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password set successfully!');
        setIsPasswordSet(true);
      } else {
        setMessage(data.message || 'Failed to set password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error setting password.');
    }
  };








































  const handlePasswordValidation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/validatePassword/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Login successful');
        setIsLogin(true);
        // Pass username and userID to Dashboard
        navigate('/Dashboard', { state: { userID, username } });
      } else {
        setMessage(data.message || 'Invalid password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error validating password.');
    }
  };
  
















































  return (
    <div>
      <h2>User Login</h2>

      {!manualEntry && (
        <div id="qr-code-scanner" style={{ width: '50%', height: '50%' }}>
          <video id="video" style={{ width: '100%', height: '100%' }}></video>
        </div>
      )}

      <button onClick={() => setManualEntry((prev) => !prev)}>
        {manualEntry ? 'Switch to QR Scan' : 'Enter User ID Manually'}
      </button>

      {manualEntry && (
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            placeholder="Enter User ID"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {message && <p>{message}</p>}

      {username && !isPasswordSet && (
        <div>
          <h3>Welcome, {username}!</h3>
          <h4>Please set a password:</h4>
          <form onSubmit={handleSetPassword}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <button type="submit">Set Password</button>
          </form>
        </div>
      )}

      {isPasswordSet && !isLogin && (
        <div>
          <h4>Enter your password to login:</h4>
          <form onSubmit={handlePasswordValidation}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;


