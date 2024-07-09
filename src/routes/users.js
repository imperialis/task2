const express = require('express');
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

router.use((req, res, next) => {
  const validRoutes = ['/:id'];
  const routePath = req.path.split('/').filter(Boolean).join('/');
  if (!validRoutes.some(route => route === '/' + routePath)) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found',
      statusCode: 404
    });
  }
  next();
});

// Middleware to verify JWT token
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
    console.error('JWT verification error:', error);
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

// GET user's own record or user record in organisations they belong to or created
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findByPk(id, {
      include: {
        model: db.Organisation,
        as: 'Organisations',
        through: { attributes: [] }
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if the authenticated user has access to this user's record
    const userOrgs = user.Organisations.map(org => org.orgId);
    const authUser = await db.User.findByPk(req.userId, {
      include: {
        model: db.Organisation,
        as: 'Organisations',
        through: { attributes: [] }
      }
    });

    const authUserOrgs = authUser.Organisations.map(org => org.orgId);
    const hasAccess = user.userId === req.userId || userOrgs.some(orgId => authUserOrgs.includes(orgId));

    if (!hasAccess) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Return user data
    res.status(200).json({
      status: 'success',
      message: 'User record retrieved successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        organisations: user.Organisations
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
