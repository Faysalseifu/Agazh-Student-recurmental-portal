const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submissions
app.post('/submit-job', (req, res) => {
  const {
    familyName,
    contactNumber,
    email,
    jobTitle,
    jobDescription,
    jobLocation,
    schedule,
    payment,
    additionalInfo,
  } = req.body;

  // Format the job data
  const jobData = `
Family Name: ${familyName}
Contact Number: ${contactNumber}
Email: ${email}
Job Title: ${jobTitle}
Job Description: ${jobDescription}
Job Location: ${jobLocation}
Preferred Schedule: ${schedule}
Payment: ${payment} Birr
Additional Information: ${additionalInfo}
----------------------------------------
`;

  // Path to jobs.txt
  const filePath = path.join(__dirname, 'jobs.txt');

  // Append the job data to jobs.txt
  fs.appendFile(filePath, jobData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Server Error: Unable to save job data');
    }
    console.log('Job data saved!');
    res.send('Job data has been successfully saved!');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});