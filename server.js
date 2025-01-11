const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Path to jobs.txt
const filePath = path.join(__dirname, 'jobs.txt');

// Endpoint to fetch job data
app.get('/jobs', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading jobs file:', err);
      return res.status(500).send('Unable to fetch job data');
    }

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

// Endpoint to add new job data
app.post('/jobs', (req, res) => {
  const job = req.body;

  // Format the new job data
  const jobData = `
Family Name: ${job.familyName || ''}
Contact Number: ${job.contactNumber || ''}
Email: ${job.email || ''}
Job Title: ${job.jobTitle || ''}
Job Description: ${job.jobDescription || ''}
Job Location: ${job.jobLocation || ''}
Preferred Schedule: ${job.schedule || ''}
Payment: ${job.payment || ''} Birr
Additional Information: ${job.additionalInfo || ''}
----------------------------------------
`;

  fs.appendFile(filePath, jobData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Failed to save job data');
    }
    console.log('Job data saved successfully!');
    res.status(200).send('Job added successfully!');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
