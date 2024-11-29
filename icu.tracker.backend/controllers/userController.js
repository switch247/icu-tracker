const { prisma } = require('@base/config/prismaconfig');
const bcrypt = require('bcrypt');

class UserController {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch users.' });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: { hospital: true },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user.' });
    }
  }

  // Create a new user
  async createUser(req, res) {
    try {
      const { email, password, name, role, hospitalId } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          hospitalId, // Optional
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create user.' });
    }
  }

  // Update user by ID
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
      });
      res.status(200).json(updatedUser);
    } catch (error) { 
      console.log(error);
      res.status(400).json({ error: 'Failed to update user.' });
    }
  }

  // Delete user by ID (soft delete)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete user.' });
    }
  }
}

module.exports = new UserController();
