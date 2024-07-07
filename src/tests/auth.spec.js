

const request = require('supertest');
const app = require('../app');
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');

let token;
let userId;


describe('Token Generation', () => {
    it('should generate a valid token with correct expiry', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'jake.doe@example.com',
          password: 'password123',
        });
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
  
      // Verify token contains correct user details
      
      const decoded = jwt.verify(res.body.data.accessToken, config.jwtSecret);
      console.log(decoded.userId+"d.Uid");
      userid= res.body.data.user.userId;
      expect(decoded.userId).toBe(userid);
  
      // Wait for token to expire (1 hour + some buffer time)
      await new Promise(resolve => setTimeout(resolve, 36000));
  
      // Attempt to access a protected endpoint with expired token
      const expiredToken = res.body.data.accessToken;
      const expiredRes = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${expiredToken}`);
  
      expect(expiredRes.statusCode).toEqual(401);
      expect(expiredRes.body.status).toBe('error');
      expect(expiredRes.body.message).toBe('Unauthorized');
    });
  });

describe('Authentication and Organisation Tests', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jake',
          lastName: 'Doe',
          email: 'jake.doe@example.com',
          password: 'password123',
          phone: '1234567890',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.firstName).toBe('Jake');
      expect(res.body.data.user.lastName).toBe('Doe');
      expect(res.body.data.user.email).toBe('jake.doe@example.com');
      expect(res.body.data.user.phone).toBe('1234567890');
      expect(res.body.data.user.userId).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();
      

      const token = res.body.data.accessToken;

      // Fetch the organization details using the organization route
      const orgRes = await request(app)
        .get('/api/organisations')
        .set('Authorization', `Bearer ${token}`);

      expect(orgRes.statusCode).toEqual(200);
      expect(orgRes.body.data.organisations).toHaveLength(1);
      expect(orgRes.body.data.organisations[0].name).toBe("Jake's Organisation");
    });

  
    it('should fail if required fields are missing', async () => {
      let res = await request(app)
        .post('/auth/register')
        .send({
          lastName: 'Doe',
          email: 'jake.doe@example.com',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors).toBeDefined();

      res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jake',
          email: 'jake.doe@example.com',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors).toBeDefined();

      res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jake',
          lastName: 'Doe',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors).toBeDefined();

      res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jake',
          lastName: 'Doe',
          email: 'jake.doe@example.com',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail if there’s duplicate email or userId', async () => {
      await request(app).post('/auth/register').send({
        firstName: 'Jake',
        lastName: 'Doe',
        email: 'jake.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      });

      const res = await request(app).post('/auth/register').send({
        firstName: 'Jake',
        lastName: 'Doe',
        email: 'jake.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe('Bad request');
      expect(res.body.message).toBe('Registration unsuccessful');
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
      await request(app).post('/auth/register').send({
        firstName: 'Jake',
        lastName: 'Doe',
        email: 'jake.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      });

      const res = await request(app).post('/auth/login').send({
        email: 'jake.doe@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('jake.doe@example.com');
      expect(res.body.data.user.firstName).toBe('Jake');
      expect(res.body.data.user.lastName).toBe('Doe');
      expect(res.body.data.user.phone).toBe('1234567890');
      expect(res.body.data.user.userId).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();

      token = res.body.data.accessToken;
      userId = res.body.data.user.userId; // Correctly assign the userId
    });

    it('should fail if the credentials are invalid', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toBe('Bad request');
      expect(res.body.message).toBe('Authentication failed');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get the user record if authenticated', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`) // Use the dynamically fetched userId here
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.email).toBe('jake.doe@example.com');
    });

    it('should fail if the user is not authenticated', async () => {
      const res = await request(app).get(`/api/users/${userId}`); // Use the dynamically fetched userId here

      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('Organisation Access Control', () => {
    it('should not allow users to see data from organisations they don’t have access to', async () => {
      const newUserRes = await request(app).post('/auth/register').send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        phone: '0987654321',
      });

      const newToken = newUserRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/organisations')
        .set('Authorization', `Bearer ${newToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.organisations).toHaveLength(1);
    });
  });
 });



