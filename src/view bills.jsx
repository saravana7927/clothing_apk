import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { firestore } from "./firebase"; // Import Firestore configuration
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import generatePDF from "./pdfGenerator"; // Import the generatePDF function

const ViewBills = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const billsCollection = await firestore
          .collection("bills")
          .orderBy("timestamp", "desc")
          .get();
        const billsData = billsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBills(billsData);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchBills();
  }, []);

  return (
    <Container style={{ marginTop: 20 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <IconButton onClick={() => navigate("/")}>
          <HomeIcon />
        </IconButton>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="primary"
        >
          All Bills
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ mb: 4, borderRadius: 2 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                S.No
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Customer Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Contact
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Items Bought
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Created By
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill, index) => (
              <TableRow key={bill.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{bill.customerDetails.name}</TableCell>
                <TableCell>
                  {`${bill.customerDetails.address.houseNo}, ${bill.customerDetails.address.streetName}, ${bill.customerDetails.address.city}, ${bill.customerDetails.address.state} - ${bill.customerDetails.address.pincode}`}
                </TableCell>
                <TableCell>{bill.customerDetails.contact}</TableCell>
                <TableCell>{bill.total.toFixed(2)}</TableCell>
                <TableCell>
                  {bill.items
                    .map((item) => `${item.name} (${item.quantity})`)
                    .join(", ")}
                </TableCell>
                <TableCell>{bill.billCreatedBy}</TableCell>
                <TableCell>
                  {bill.timestamp?.toDate().toLocaleString() || "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      generatePDF({
                        ...bill,
                        date: bill.timestamp?.toDate().toISOString() // Ensure the date is passed
                      })
                    }
                    color="primary"
                  >
                    <CreateIcon />
                    <Typography variant="body1" ml={1}>
                      Generate PDF
                    </Typography>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ViewBills;
