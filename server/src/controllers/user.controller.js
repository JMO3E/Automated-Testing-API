import User from '../models/user.model.js';
import { Op } from 'sequelize';

async function getUser(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function createUser(req, res) {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      } 
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = await User.create({ name, email, username, password });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      } 
    });

    if (existingUser && existingUser.id !== id) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const [updated] = await User.update(
      { name, email, username, password },
      { where: { id } }
    );

    if (updated) {
      const updatedUser = await User.findByPk(id);
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ 'message': 'Internal Server Error' });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};