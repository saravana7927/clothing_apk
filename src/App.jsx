import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Signin';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import GarmentBill from './garments'; // Import the GarmentBill component
import { Home } from '@mui/icons-material';
import HomePage from './homepage';
import ViewBills from './view bills';
import Inventory from './inventory';
import { auth } from './firebase';

const App = () => {
  const [user] = useAuthState(auth);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user?<HomePage/>:<SignIn />} />
        <Route path="/garments" element={<GarmentBill />} />
        <Route path="/viewbills" element={<ViewBills/>} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default App;
