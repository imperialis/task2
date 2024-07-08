
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [
        { field: 'required', message: 'Missing required fields' }
      ]
    });
  }

  console.table(config)
  console.log("this is the result",config.jwtSecret)


  const userId = uuidv4(); // Generate UUID for userId

  try {
    
      // Check if user already exists
      const existingUser = await db.User.findOne({ where: { email } });
      console.log(existingUser)
      if (existingUser) {
        return res.status(400).json({
          status: 'Bad request',
          message: 'Registration unsuccessful',
        });
      }
    const user = await db.User.create({ userId, firstName, lastName, email, password, phone });

    // Create organization for the user
    const orgId = uuidv4(); // Generate UUID for orgId
    const org = await db.Organisation.create({ orgId, name: `${firstName}'s Organisation` });
    await user.addOrganisation(org);

    // Generate token with expiry
    const expiresIn = '30s'; // Token expires in 1 hour
    // const token = jwt.sign({ userId: user.userId }, config.jwtSecret, { expiresIn });
    const token = jwt.sign({ userId: user.userId }, config.jwtSecret, { expiresIn });


    console.log("this is the data >>>>>>>>>>>>>>>>>>>>>>>>>>.",process.env.JWT_SECRET)

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401
      });
    }

    // Generate token with expiry
    const expiresIn = '30s'; // Token expires in 1 hour
    const token = jwt.sign({ userId: user.userId }, config.jwtSecret, { expiresIn });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Login unsuccessful',
      statusCode: 500
    });
  }
});

module.exports = router;
