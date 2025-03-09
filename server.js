const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');
const schedule = require('node-schedule');  // For scheduling reminders
require('dotenv').config();
const { exec } = require('child_process'); 
const https = require('https');
const fs = require('fs');


const sslOptions = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem'),
};
// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Models
const User = require('./models/User');  // Assuming you have a User model defined

// Define the Medicine schema
const MedicineSchema = new mongoose.Schema({
  name: String,
  dose: String,
  type: String,
  when: [String],  // Times like 'Morning', 'Afternoon', 'Night'
  frequency: String,
  days: [String],  // Days like ['Monday', 'Wednesday', 'Friday']
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
});

const Medicine = mongoose.model('Medicine', MedicineSchema);

// Express app setup
const app = express();
const port = 5000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: '0000',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,      
    secure: true,        
    maxAge: 1000 * 60 * 60 * 24  
  }
}));


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/medtechy', {
}).then(async () => {
  console.log("Connected to MongoDB");

  // Schedule reminders for existing medicines
  try {
    const existingMedicines = await Medicine.find();
    existingMedicines.forEach((medicine) => {
      // Assuming you have user data associated with each medicine
      User.findById(medicine.user)
        .then((user) => {
          if (user && user.phonenumber) {
            scheduleMedicineReminder(medicine, user.phonenumber);
          } else {
            console.warn(`User or phone number not found for medicine: ${medicine.name}`);
          }
        })
        .catch((err) => {
          console.error(`Error fetching user for medicine ${medicine.name}:`, err);
        });
    });
    console.log("Reminders scheduled for existing medicines.");
  } catch (error) {
    console.error("Error scheduling reminders for existing medicines:", error);
  }
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});


// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Ensure the correct path is provided to the HTML file
});

// Serve static files like CSS, JS, images
app.use(express.static(__dirname));

// Helper function to get day of the week
function getDayOfWeek(dayName) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(dayName);
}

// Send SMS reminder
async function sendReminder(medicine, phoneNumber) {
  const message = `Reminder: It's time to take your medicine: ${medicine.name} (${medicine.dose}).`;

  try {
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });
    console.log(`Reminder sent for ${medicine.name}`);
  } catch (error) {
    console.error('Error sending reminder:', error);
  }
}

// Schedule medicine reminder
// Schedule medicine reminder
function scheduleMedicineReminder(medicine, phoneNumber) {
  if (!phoneNumber) {
    throw new Error('Phone number is required to schedule reminders.');
  }

  // Format the phone number to include +91
  if (!phoneNumber.startsWith('+91')) {
    phoneNumber = `+91 ${phoneNumber}`;
  }
  const now = new Date();

  medicine.when.forEach(time => {
    // Set the time for the reminder
    const reminderBaseTime = new Date(now);
    if (time === 'Morning') {
      reminderBaseTime.setHours(8, 0, 0); // 6:30 AM
    } else if (time === 'Afternoon') {
      reminderBaseTime.setHours(13, 0, 0); // 2:00 PM
    } else if (time === 'Night') {
      reminderBaseTime.setHours(20, 0, 0); // 8:30 PM
    }

    if (medicine.frequency === 'Daily') {
      // Daily reminders
      const dailyJob = schedule.scheduleJob({ hour: reminderBaseTime.getHours(), minute: reminderBaseTime.getMinutes() }, () => {
        sendReminder(medicine, phoneNumber);
      });
      console.log(`Daily reminder scheduled for ${medicine.name}`);
    } else if (medicine.frequency === 'Every Other Day') {
      // Reminders every other day
      let reminderTime = new Date(reminderBaseTime);
      reminderTime.setDate(now.getDate() + 1 + (now.getDate() % 2 === 0 ? 0 : 1)); // Skip one day
      schedule.scheduleJob(reminderTime, function scheduleNextReminder() {
        sendReminder(medicine, phoneNumber);
        // Reschedule for two days later
        reminderTime.setDate(reminderTime.getDate() + 2);
        schedule.scheduleJob(reminderTime, scheduleNextReminder);
      });
      console.log(`Every other day reminder scheduled for ${medicine.name}`);
    } else if (medicine.frequency === 'Custom') {
      // Custom reminders on specific days
      medicine.days.forEach(day => {
        const dayOfWeek = getDayOfWeek(day);

        // Schedule reminders for every week on the specified days
        const customJob = schedule.scheduleJob({ dayOfWeek, hour: reminderBaseTime.getHours(), minute: reminderBaseTime.getMinutes() }, () => {
          sendReminder(medicine, phoneNumber);
        });

        console.log(`Custom reminder scheduled for ${medicine.name} on ${day} at ${reminderBaseTime.toTimeString()}`);
      });
    }
  });
}



// Routes
app.post('/signup', async (req, res) => {
  try {
    const { username, phonenumber, emergencycontact, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, phonenumber, emergencycontact, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Server error");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // Set session data for login
    req.session.userId = user._id;
    req.session.userphonenumber = user.phonenumber;
    // Check if emergency contact starts with '+91'
    if (!user.emergencycontact.startsWith('+91')) {
      user.emergencycontact = '+91' + user.emergencycontact;
    }

    // Save the emergency contact to the session
    req.session.useremergencycontact = user.emergencycontact;


    res.status(200).send("Login successful");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// Fetch user profile data
app.get('/userprofile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send("Unauthorized");
    }

    const user = await User.findById(req.session.userId).select('username phonenumber emergencycontact email');
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Server error");
  }
});

// Add new medicine
app.post('/api/medicines', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const phoneNumber = req.session.userphonenumber; // Fetch from session
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is not available' });
    }

    const medicine = new Medicine({
      ...req.body,
      user: req.session.userId,
    });

    await medicine.save();

    // Pass phone number to the scheduleMedicineReminder function
    scheduleMedicineReminder(medicine, phoneNumber);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add medicine' });
  }
});


// Get user's medicines
app.get('/api/medicines', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const medicines = await Medicine.find({ user: req.session.userId });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// Delete medicine
app.delete('/api/medicines/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    if (medicine.user.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});



const { spawn } = require('child_process');

app.get('/run-python', (req, res) => {
    // Spawn a child process to run the Python script
    const python = spawn('python', ['Recommendation/main.py']);  // Replace with your script name
    
    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    python.on('close', (code) => {
        console.log(`Python script finished with code ${code}`);
        res.send('Python script finished running!');
    });
});



const { authorize } = require('./google-auth');
const { createMeetLink } = require('./createMeetLink');
const { sendSMS } = require('./sendSMS');


// API route to create and send a Google Meet link
app.post('/send-meet-link', (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    authorize((auth) => {
        createMeetLink(auth, (meetLink) => {
            console.log('Google Meet link created:', meetLink);

            sendSMS(phoneNumber, meetLink)
                .then(() => {
                    res.json({ success: true, meetLink });
                })
                .catch((error) => {
                    console.error('Error sending SMS:', error);
                    res.status(500).json({ success: false, error: 'Failed to send SMS' });
                });
        });
    });
});


// Endpoint to send SOS
app.post("/send-sos", (req, res) => {
  const { message, location } = req.body;
  
  // Sending SMS
  client.messages
    .create({
      body: `${message} Location: ${location}`,
      from: twilioPhoneNumber,
      to: req.session.useremergencycontact,
    })
    .then(() => {
      console.log("SOS message sent");
    })
    .catch((err) => {
      console.error("Error sending SOS:", err);
    });

  // Triggering an alert call
  client.calls
    .create({
      twiml: `<Response>
      <Say voice="alice" language="en-IN">
        ${message} and the location has been sent to your message.
      </Say></Response>`,
      to: req.session.useremergencycontact,
      from: twilioPhoneNumber,
    })
    .then((call) => {
      console.log(`Call initiated: ${call.sid}`);
    })
    .catch((error) => {
      console.error("Error making call:", error);
    });

  res.json({ status: "SOS Sent" });
});
app.post('/logout', (req, res) => {
  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error during logout");
      }
      res.clearCookie('connect.sid');
      res.status(200).send({ status: "Logout successful" });  // Send JSON response
    });
  } else {
    res.status(400).send({ status: "No user is logged in" });
  }
});



// Start HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server running at https://192.168.0.102:${port}`);
    // Automatically open the URL in the default web browser
    const url = `https://192.168.0.102:${port}`;

    // Check the operating system and run the appropriate command
    if (process.platform === 'win32') {
      exec(`start ${url}`);  // Windows
    } else if (process.platform === 'darwin') {
      exec(`open ${url}`);   // macOS
    } else {
      exec(`xdg-open ${url}`);  // Linux
    }
});

  
