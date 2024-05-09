const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors');

// Replace with the actual path to your service account key JSON file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lmis-f3fb0-default-rtdb.firebaseio.com"
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
const firestore = admin.firestore();

const YOUR_FIREBASE_API_KEY = "AIzaSyBupJ6WVoUv818heRupAiNA4aRT6n--oe0";

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const signUpEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${YOUR_FIREBASE_API_KEY}`;

    const signUpData = {
      email,
      password,
      returnSecureToken: true,
    };

    const signUpResponse = await axios.post(signUpEndpoint, signUpData);
    const { idToken, email: userEmail, refreshToken, expiresIn, localId } = signUpResponse.data;
    console.log('User Signed Up Successfully:', { userEmail, localId });

    let userData;

    switch (role) {
      case 'candidate':
      case 'employer':
        userData = {
          name,
          email: userEmail,
          role,
          createdAt: new Date(),
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    await firestore.collection('users').doc(localId).set(userData);
    const userRef = firestore.collection(role + 's').doc(localId);
    await userRef.set(userData);
    await userRef.update({ userId: localId });

    return res.status(200).json({
      idToken,
      email: userEmail,
      refreshToken,
      expiresIn,
      localId,
      role,
    });
  } catch (error) {
    console.error('Error signing up user:', error.response.data.error);
    return res.status(500).json({ error: 'Failed to sign up' });
  }
});

const handleSigninError = (res, error) => {
  console.error('Signin error:', error.message);
  if (error.response) {
    console.error('Response data:', error.response.data);
  }
  return res.status(500).json({ error: 'Failed to sign in', details: error.message });
};

app.post('/signin', async (req, res) => {
  try {
    const signInEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${YOUR_FIREBASE_API_KEY}`;
    const { email, password } = req.body;

    const requestBody = {
      email,
      password,
      returnSecureToken: true,
    };

    const response = await axios.post(signInEndpoint, requestBody);
    const { idToken, refreshToken, expiresIn, localId } = response.data;

    const role = await getUserRole(localId);

    const expiresInMs = expiresIn * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresInMs });

    const options = {
      maxAge: expiresInMs,
      httpOnly: true,
      secure: true,
    };

    res.cookie('session', sessionCookie, options);

    return res.status(200).send({
      message: 'Signed in successfully',
      idToken,
      refreshToken,
      role,
      localId,
    });
  } catch (error) {
    handleSigninError(res, error);
  }
});

// Function to get the user role from Firestore
async function getUserRole(userId) {
  try {
    const candidateDoc = await firestore.collection('candidates').doc(userId).get();
    if (candidateDoc.exists) {
      return 'candidate';
    }

    const employerDoc = await firestore.collection('employers').doc(userId).get();
    if (employerDoc.exists) {
      return 'employer';
    }

    throw new Error('User document not found');
  } catch (error) {
    console.error('Error retrieving user role:', error);
    throw error;
  }
}

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
    }
    const idToken = authHeader.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};


// Post Job Endpoint
app.post('/postjob', authenticateUser,async (req, res) => {
  try {
    const {  job_title, job_description, job_location, job_employment_type, job_qualification, job_work_preference, age, experience, gender, salary } = req.body;

    // Construct the job object
    const jobData = {
      job_title,
      job_description,
      job_location,
      job_employment_type,
      job_qualification,
      job_work_preference,
      age,
      experience,
      gender,
      salary,
      createdAt: admin.firestore.FieldValue.serverTimestamp()// Use server timestamp for createdAt field
       // Store the UID of the user who created the job
    };

    // Save the job data to Firestore
    const jobRef = await firestore.collection('jobs').add(jobData);

    // Respond with success message and job ID
    res.status(200).send({ message: 'Job posted successfully', jobId: jobRef.id });
  } catch (error) {
    console.error('Failed to post job:', error);
    res.status(500).send({ message: 'Failed to post job', error: error.message });
  }
});

const handlePostJobError = (res, error) => {
  if (error.code === 'auth/argument-error') {
    res.status(400).send({ error: 'Invalid token argument' });
  } else if (error.code === 'auth/invalid-id-token') {
    res.status(401).send({ error: 'Invalid ID token' });
  } else {
    res.status(500).send({ error: 'Failed to post job' });
  }
};





exports.app = functions.https.onRequest(app);
