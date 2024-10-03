import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "./assets/light_spot_profile.png";

const generatePDF = (data) => {
  const { items, customerDetails, total, receivedAmount, date } = data;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Company Header
  doc.addImage(logo, "PNG", 10, 10, 30, 30);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Light Spot Mens Wear", 50, 20);

  // Date at the top right
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  doc.setFontSize(12);
  doc.text(`Date: ${formattedDate}`, pageWidth - 60, 20);

  // Company Address
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  const companyAddress = [
    "182, Street No. 4, Periyar Nagar, TNHB Colony,",
    "Vanchi Nagar, Korattur, Chennai, Tamil Nadu,",
    "600080",
    "Mobile: 6374366480",
  ];
  companyAddress.forEach((line, index) => {
    doc.text(line, 50, 25 + index * 5);
  });

  // Horizontal line
  doc.line(10, 45, pageWidth - 10, 45);

  // Customer Details Box
  const nameY = 55;
  const addressY = nameY + 6;
  const contactY = addressY + 10;
  const boxPadding = 4;
  const customerBoxHeight = 25;
  const boxWidth = pageWidth - 20;

  // Draw box
  doc.setFontSize(16);
  doc.setFont("Helvetica", "normal");
  doc.rect(10, nameY - boxPadding, boxWidth, customerBoxHeight);

  // Add text inside the box
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.text(`Bill To: ${customerDetails.name}`, 15, nameY);

  // Split address into multiple lines
  const customerAddressLines = splitAddress(customerDetails.address);
  let addressLineY = addressY;
  customerAddressLines.forEach((line) => {
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(line, 15, addressLineY);
    addressLineY += 6;
  });

  // Add contact number
  doc.setFontSize(16);
  doc.setFont("Helvetica", "normal");
  doc.text(`Contact: ${customerDetails.contact}`, 15, addressLineY);

  // Table Headers
  const tableColumn = ["S.No", "Items", "QTY.", "Rate", "Tax", "Amount"];
  const tableRows = items.map((item, index) => [
    index + 1,
    item.name,
    item.quantity,
    item.price.toFixed(2),
    item.tax ? `${item.tax}%` : "0%",
    (item.price * item.quantity).toFixed(2),
  ]);

  // Ensure the table has at least 15 rows
  while (tableRows.length < 4) {
    tableRows.push(["", "", "", "", "", ""]);
  }

  // Table Footer for Total
  tableRows.push(["", "", "", "", "Total", total.toFixed(2)]);

  // Draw Table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: addressLineY + 10,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: [0, 0, 0],
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      halign: "center",
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      halign: "right",
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    margin: { top: addressLineY + 20, bottom: 10, left: 10, right: 10 },
    didDrawCell: (data) => {
      const { column, row, table } = data;
      const isFirstColumn = column.index === 0;
      const isLastColumn = column.index === table.columns.length - 1;
      const isFirstRow = row.index === 0;
      const isLastRow = row.index === table.body.length - 1;

      if (isFirstColumn) {
        doc.rect(data.cell.x, data.cell.y, 0.5, data.cell.height);
      }
      if (isLastColumn) {
        doc.rect(
          data.cell.x + data.cell.width - 0.5,
          data.cell.y,
          0.5,
          data.cell.height
        );
      }
      if (isFirstRow) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, 0.5);
      }
      if (isLastRow) {
        doc.rect(
          data.cell.x,
          data.cell.y + data.cell.height - 0.5,
          data.cell.width,
          0.5
        );
      }
      if (column.index !== 0 && column.index !== table.columns.length) {
        doc.rect(data.cell.x, data.cell.y, 0.5, data.cell.height);
      }
    },
  });

  // Add "Received Amount" and "Balance Amount" sections
  const received = parseFloat(receivedAmount) || 0;
  const balance = total - received;

  const totalY = doc.lastAutoTable.finalY + 7;
  doc.setFont("Helvetica", "bold");
  doc.text("Received Amount", 10, totalY);
  doc.text(`INR ${received.toFixed(2)}`, pageWidth - 10, totalY, {
    align: "right",
  });

  const balanceY = totalY + 7;
  doc.text("Balance Amount", 10, balanceY);
  doc.text(`INR ${balance.toFixed(2)}`, pageWidth - 10, balanceY, {
    align: "right",
  });

  // Add "Total Amount in Words" section
  const totalWords = toWords(total);
  const totalWordsY = balanceY + 10;
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text("Total Amount (in words):", 10, totalWordsY);

  // Add the bold part in capital letters next to normal text
  const boldText = `${totalWords.toUpperCase()} RUPEES`;
  doc.setFont("Helvetica", "bold");
  doc.text(
    boldText,
    doc.getStringUnitWidth("Total Amount (in words): ") * 3.3 + 10,
    totalWordsY
  );

  // Terms and Conditions
  const termsY = totalWordsY + 20;
  doc.setFont("Helvetica", "normal");
  doc.text("Terms and Conditions:", 10, termsY);
  doc.setFontSize(8);
  doc.text("1. Goods once sold will not be taken back.", 10, termsY + 5);
  doc.text("2. Goods sold once will not be replaced.", 10, termsY + 10);

  // Customer Address Box after Terms and Conditions
  // Customer Address Box after Terms and Conditions
  const addressBoxY = termsY + 30;
  const addressBoxHeight = 40;

  // Fit address box to the whole width
  doc.setFillColor(255, 255, 204); // Light yellow highlight
  doc.rect(10, addressBoxY, pageWidth - 20, addressBoxHeight, "FD");
  doc.setFontSize(22);
  doc.setFont("Helvetica", "bold");
  doc.text(`Bill To: ${customerDetails.name}`, 15, addressBoxY + 8);

  let adjustedAddressY = addressBoxY + 15;
  customerAddressLines.forEach((line) => {
    doc.text(line, 15, adjustedAddressY);
    adjustedAddressY += 8; // Increased line spacing for address lines
  });
  doc.text(`Contact: ${customerDetails.contact}`, 15, adjustedAddressY);

  // Save PDF
  doc.save(`invoice_${customerDetails.name}.pdf`);
};

// Function to split address into multiple lines
const splitAddress = (address) => {
  if (typeof address === "object") {
    const combinedAddress = `${address.houseNo}, ${address.streetName}, ${address.city}, ${address.state} - ${address.pincode}`;

    const lines = [];
    let line = "";
    const addressParts = combinedAddress.split(", ");

    addressParts.forEach((part) => {
      if ((line + part).length > 40) {
        lines.push(line.trim());
        line = part + ", ";
      } else {
        line += part + ", ";
      }
    });

    if (line) lines.push(line.trim());

    return lines;
  } else {
    return [address]; // Return as is if address is already a string
  }
};

// Convert number to words function (simplified)
const toWords = (num) => {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 20) return a[num];
  if (num < 100)
    return b[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + a[num % 10] : "");
  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " hundred" +
      (num % 100 !== 0 ? " and " + toWords(num % 100) : "")
    );
  return num;
};

export default generatePDF;
