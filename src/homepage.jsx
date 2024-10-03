import React from 'react';
import { Container, Typography, Button, Grid2, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Signout from './SignOut';
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Signout></Signout>
      <Box textAlign="center" my={4}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
          Welcome to Light Spot Men's Wear
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary" mt={2}>
          Manage your garments billing with ease.
        </Typography>
      </Box>
      
      <Grid2 container spacing={4} justifyContent="center">
        <Grid2 item xs={12} sm={6} md={4}>
          <Box textAlign="center" p={2} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5" component="h2" color="primary" gutterBottom>
              Create a New Bill
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/garments')}
            >
              Go to Garment Bill
            </Button>
          </Box>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={4}>
          <Box textAlign="center" p={2} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5" component="h2" color="primary" gutterBottom>
              View Saved Bills
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/viewbills')}
            >
              Go to Saved Bills
            </Button>
          </Box>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={4}>
  <Box textAlign="center" p={2} border={1} borderColor="primary.main" borderRadius={2}>
    <Typography variant="h5" component="h2" color="primary" gutterBottom>
      Manage Inventory
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate('/inventory')}
    >
      Go to Inventory
    </Button>
  </Box>
</Grid2>


        {/* Add more sections as needed */}
      </Grid2>
    </Container>
  );
};

export default HomePage;
