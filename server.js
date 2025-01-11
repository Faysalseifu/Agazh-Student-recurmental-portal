const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // To handle JSON payloads

// Path to the jobs file
const filePath = path.join(__dirname, 'jobs.txt');

// Endpoint to handle form submissions (Write to jobs.txt)
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
Preferred Schedule: ${schedule || 'Not specified'}
Payment: ${payment || 'Not specified'} Birr
Additional Information: ${additionalInfo || 'None'}
----------------------------------------
`;

  // Append the job data to jobs.txt
  fs.appendFile(filePath, jobData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Server Error: Unable to save job data');
    }
    console.log('Job data saved!');
    res.status(201).send('Job data has been successfully saved!');
  });
});

// Route to fetch job data (Read from jobs.txt)
app.get('/jobs', (req, res) => {
  // Read jobs.txt and parse the data
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading jobs file:', err);
      return res.status(500).send('Unable to fetch job data');
    }

    // Split file content into individual jobs
    const jobs = data
      .split('----------------------------------------')
      .filter((job) => job.trim())
      .map((job) => {
        const jobData = {};
        job.split('\n').forEach((line) => {
          const [key, value] = line.split(':').map((str) => str.trim());
          if (key && value) jobData[key] = value;
        });
        return jobData;
      });

    res.json(jobs);
  });
});

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
