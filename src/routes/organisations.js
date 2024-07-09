const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// router.use((req, res, next) => {
//   const validRoutes = ['/organisations', `/organisations/${req.params.orgId}`, `/organisations/${req.params.orgId}/users`];
//   if (!validRoutes.includes(req.path)) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Resource not found',
//       statusCode: 404
//     });
//   }
//   next();
// });

router.use((req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

router.post('api/organisations', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(422).json({
      errors: [
        { field: 'name', message: 'Name is required' }
      ]
    });
  }

  try {
    const orgId = uuidv4(); // Generate UUID for orgId
    const org = await db.Organisation.create({ orgId, name, description });
    const user = await db.User.findByPk(req.userId);
    await user.addOrganisation(org);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description
      }
    });
  } catch (error) {
    console.error('Error creating organisation:', error);
    res.status(400).json({
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400
    });
  }
});

router.get('api/organisations', async (req, res) => {
  const user = await db.User.findByPk(req.userId, {
    include: db.Organisation
  });

  res.status(200).json({
    status: 'success',
    message: 'Organisations retrieved successfully',
    data: {
      organisations: user.Organisations
    }
  });
});

router.get('api/organisations/:orgId', async (req, res) => {
  const { orgId } = req.params;
  const user = await db.User.findByPk(req.userId, {
    include: db.Organisation
  });

  const organisation = user.Organisations.find(org => org.orgId === orgId);

  if (!organisation) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Access denied',
      statusCode: 400
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Organisation retrieved successfully',
    data: organisation
  });
});

router.post('api/organisations/:orgId/users', async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  const user = await db.User.findByPk(userId);
  const organisation = await db.Organisation.findByPk(orgId);

  if (!user || !organisation) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'User or Organisation does not exist',
      statusCode: 400
    });
  }

  await organisation.addUser(user);

  res.status(200).json({
    status: 'success',
    message: 'User added to organisation successfully'
  });
});

module.exports = router;

