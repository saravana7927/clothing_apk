import React, { useState } from 'react';
import { Container, Typography, Button, Grid2, Box, TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { firestore } from './firebase';  // Import your Firestore instance
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';


const Inventory = () => {
  const [garments, setGarments] = useState([]);
  const [newGarment, setNewGarment] = useState({ name: '', size: '', price: '' });
  const navigate = useNavigate();
  // Fetch existing garments from Firebase
  const fetchGarments = async () => {
    const garmentsCollection = await getDocs(collection(firestore, 'garments'));
    const garmentsList = garmentsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGarments(garmentsList);
  };

  // Add a new garment to Firebase and state
  const handleAddGarment = async () => {
    const docRef = await addDoc(collection(firestore, 'garments'), newGarment);
    setGarments([...garments, { id: docRef.id, ...newGarment }]);
    setNewGarment({ name: '', size: '', price: '' });
  };

  // Delete a garment from Firebase and state
  const handleDeleteGarment = async (id) => {
    await deleteDoc(doc(firestore, 'garments', id));
    setGarments(garments.filter(garment => garment.id !== id));
  };

  // Fetch garments when the component mounts
  React.useEffect(() => {
    fetchGarments();
  }, []);

  return (
    <Container>
      <IconButton onClick={() => navigate("/")}>
          <HomeIcon />
        </IconButton>

      <Box textAlign="center" my={4}>
        <Typography variant="h4" component="h2" fontWeight="bold" color="primary">
          Inventory Management
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary" mt={2}>
          Manage your garment inventory with ease.
        </Typography>
      </Box>

      <Box my={4}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Garment Name"
              variant="outlined"
              value={newGarment.name}
              onChange={(e) => setNewGarment({ ...newGarment, name: e.target.value })}
            />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Size"
              variant="outlined"
              value={newGarment.size}
              onChange={(e) => setNewGarment({ ...newGarment, size: e.target.value })}
            />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              type="number"
              value={newGarment.price}
              onChange={(e) => setNewGarment({ ...newGarment, price: e.target.value })}
            />
          </Grid2>
        </Grid2>

        <Box textAlign="center" my={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddGarment}
          >
            Add Garment
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {garments.map((garment, index) => (
              <TableRow key={index}>
                <TableCell>{garment.name}</TableCell>
                <TableCell>{garment.size}</TableCell>
                <TableCell>{garment.price}</TableCell>
                <TableCell align="center">
                  <IconButton color="secondary" onClick={() => handleDeleteGarment(garment.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default Inventory;
