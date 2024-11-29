const { prisma } = require('@base/config/prismaconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

class AuthController {
  // Register a new user
  async register(req, res) {
    try {
      const { email, password, name, role, hospitalId } = req.body;

      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || 'user', // Default role is 'user'
          hospitalId: hospitalId || null, // Optional
        },
      });

      // Generate a token
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        message: 'Registration successful.',
        token,
        user: { id: newUser.id, name: newUser.name, role: newUser.role },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to register user.' });
    }
  }

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Invalid email or password.' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Generate token
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1d',
      });

      delete user.password;
      res.status(200).json({
        token,
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to log in.' });
    }
  }

  // Verify token middleware
  async verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(403)
        .json({ error: 'Access denied, no token provided.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token.' });
    }
  }
}

module.exports = new AuthController();
