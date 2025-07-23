import Weight from '../models/weight.model.js';
import User from '../models/user.model.js';

async function getWeight(req, res) {
  try {
    const weights = await Weight.findAll();
    res.status(200).json(weights);
  } catch (err) {
    console.error('Error fetching weights:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getWeightById(req, res) {
  const { id } = req.params;
  try {
    const weight = await Weight.findByPk(id);
    if (!weight) {
      return res.status(404).json({ message: 'Weight not found' });
    }
    res.status(200).json(weight);
  } catch (err) {
    console.error('Error fetching weight:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function createWeight(req, res) {
  const { weight, userId } = req.body;

  if (!weight || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid User Id' });
    }

    const newWeight = await Weight.create({ weight, userId });

    res.status(201).json(newWeight);
  } catch (err) {
    console.error('Error creating weight:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateWeight(req, res) {
  const { id } = req.params;
  const { weight, userId } = req.body;

  if (!weight || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const weight = await Weight.findByPk(id);

    if (!weight) {
      return res.status(404).json({ message: 'Weight not found' });
    }

    const [updated] = await Weight.update(
      { weight, userId },
      { where: { id } }
    );

    if (updated) {
      const updatedWeight = await Weight.findByPk(id);
      res.status(200).json(updatedWeight);
    }
  } catch (err) {
    console.error('Error updating weight:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteWeight(req, res) {
  const { id } = req.params;
  try {
    const deleted = await Weight.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Weight deleted successfully' });
    } else {
      res.status(404).json({ message: 'Weight not found' });
    }
  } catch (err) {
    console.error('Error deleting weight:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default {
  getWeight,
  getWeightById,
  createWeight,
  updateWeight,
  deleteWeight
};