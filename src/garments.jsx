import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { firestore } from './firebase';
import generatePDF from './pdfGenerator';
import Signout from './SignOut';
import firebase from 'firebase/compat/app';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const GarmentBill = () => {
  const [items, setItems] = useState([]);
  const [selectedGarment, setSelectedGarment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');

  const [garments, setGarments] = useState([]);

  useEffect(() => {
    // Fetch garments from Firestore when the component mounts
    const fetchGarments = async () => {
      const garmentsCollection = await firestore.collection('garments').get();
      const garmentsList = garmentsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGarments(garmentsList);
    };

    fetchGarments();
  }, []);

  const addItem = () => {
    const garment = garments.find(g => g.id === selectedGarment);
    if (!garment) return;

    const newItem = {
      id: Date.now(),
      name: garment.name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      amount: parseInt(quantity) * parseFloat(price),
    };
    setItems([...items, newItem]);
    setTotal(total + newItem.amount);
    setSelectedGarment('');
    setQuantity(1);
    setPrice(0);
  };

  const deleteItem = (id) => {
    const filteredItems = items.filter(item => item.id !== id);
    const removedItem = items.find(item => item.id === id);
    setItems(filteredItems);
    setTotal(total - removedItem.amount);
  };

  const handleGeneratePDF = () => {
    const data = {
      items,
      customerDetails: {
        name: customerName,
        address: `${houseNo}, ${streetName}, ${city}, ${state}, ${pincode}`,
        contact: customerContact,
      },
      total,
      receivedAmount,
    };
    generatePDF(data);
  };

  const handleSaveToFirestore = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      const billRef = firestore.collection("bills").doc();

      await billRef.set({
        items,
        customerDetails: {
          name: customerName,
          address: {
            houseNo,
            streetName,
            city,
            state,
            pincode,
          },
          contact: customerContact,
        },
        total,
        receivedAmount,
        billCreatedBy: currentUser ? currentUser.uid : 'Unknown User',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert('Bill saved to Firestore successfully!');
    } catch (error) {
      console.error('Error saving bill to Firestore:', error);
      alert(`Error saving bill to Firestore: ${error.message}`);
    }
  };

  const nav = useNavigate();

  return (
    <Container style={{ marginTop: 20 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <IconButton onClick={() => nav("/")}><HomeIcon /></IconButton>
        <Typography variant="h4" align="center" fontWeight="bold" color="primary">
          Receipt
        </Typography>
        <Signout />
      </Box>

      {/* Customer Details */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom color="textSecondary">
          Customer Details
        </Typography>
        <TextField label="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Contact Number" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} fullWidth margin="normal" required />
        <TextField label="House No" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Street Name" value={streetName} onChange={(e) => setStreetName(e.target.value)} fullWidth margin="normal" required />
        <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth margin="normal" required />
        <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Received Amount" type="number" value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} fullWidth margin="normal" required />
      </Box>

      {/* Add Item */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom color="textSecondary">
          Add Items
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="garment-select-label">Select Garment</InputLabel>
          <Select
            labelId="garment-select-label"
            id="garment-select"
            value={selectedGarment}
            label="Select Garment"
            onChange={(e) => {
              setSelectedGarment(e.target.value);
              const garment = garments.find(g => g.id === e.target.value);
              setPrice(garment ? garment.price : 0);
            }}
          >
            {garments.map(garment => (
              <MenuItem key={garment.id} value={garment.id}>
                {garment.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <TextField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth margin="normal" required />
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <IconButton onClick={addItem} color="primary">
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Items Table */}
      <TableContainer component={Paper} elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteItem(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Typography variant="h6">Total:</Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="h6">{total.toFixed(2)}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Generate PDF and Save to Firestore */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <IconButton onClick={handleGeneratePDF} color="primary">
          <CreateIcon />
          <Typography variant="body1" ml={1}>
            Generate PDF
          </Typography>
        </IconButton>
        <IconButton onClick={handleSaveToFirestore} color="secondary">
          <SaveIcon />
          <Typography variant="body1" ml={1}>
            Save to Firestore
          </Typography>
        </IconButton>
      </Box>
    </Container>
  );
};

export default GarmentBill;
