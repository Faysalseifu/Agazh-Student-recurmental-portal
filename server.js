const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Use promises for async/await support
const path = require('path');

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'jobs.txt');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//  Fetch job listings
app.get('/jobs', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    if (!data.trim()) return res.json({ message: 'No jobs available', jobs: [] });

    const jobs = data
      .split('----------------------------------------')
      .filter(job => job.trim())
      .map(job => {
        const jobData = {};
        job.split('\n').forEach(line => {
          const [key, value] = line.split(':').map(str => str.trim());
          if (key && value) jobData[key] = value;
        });
        return jobData;
      });

    console.log(`Fetched ${jobs.length} jobs`);
    res.json({ message: 'Jobs retrieved successfully', jobs });
  } catch (error) {
    console.error('Error reading jobs file:', error);
    res.status(500).json({ error: 'Unable to fetch job data' });
  }
});

//  Add a new job listing
app.post('/jobs', async (req, res) => {
  const { familyName, contactNumber, email, jobTitle, jobDescription, jobLocation, schedule, payment, additionalInfo } = req.body;

  // Validate required fields
  if (!familyName || !contactNumber || !email || !jobTitle || !jobDescription || !jobLocation) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

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

  try {
    await fs.appendFile(filePath, jobData);
    console.log('New job added successfully');
    res.status(201).json({ message: 'Job added successfully!' });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ error: 'Failed to save job data' });
  }
});

//  Start the server
app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});
