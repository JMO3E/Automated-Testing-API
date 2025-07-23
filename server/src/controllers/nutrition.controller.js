import Nutrition from '../models/nutrition.model.js';
import User from '../models/user.model.js';
import Intensity from '../models/intensity.model.js';

async function getNutrition(req, res) {
  try {
    const nutritions = await Nutrition.findAll();
    res.status(200).json(nutritions);
  } catch (err) {
    console.error('Error fetching nutritions:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getNutritionById(req, res) {
  const { id } = req.params;
  try {
    const nutrition = await Nutrition.findByPk(id);
    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition not found' });
    }
    res.status(200).json(nutrition);
  } catch (err) {
    console.error('Error fetching nutrition:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function createNutrition(req, res) {
  const { date, userId, intensityId } = req.body;

  if (!date || !userId || !intensityId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findByPk(userId);

    const intensity = await Intensity.findByPk(intensityId);

    const parsedDate = new Date(date);

    if (!user) {
        return res.status(400).json({ message: 'Invalid User Id' });
    }

    if (!intensity) {
        return res.status(400).json({ message: 'Invalid Intensity Id' });
    }

    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const newNutrition = await Nutrition.create({ date: parsedDate, userId, intensityId });

    res.status(201).json(newNutrition);
  } catch (err) {
    console.error('Error creating nutrition:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateNutrition(req, res) {
  const { id } = req.params;
  const { date, userId, intensityId } = req.body;

  if (!date || !userId || !intensityId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const nutrition = await Nutrition.findByPk(id);

    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition not found' });
    }

    const [updated] = await Nutrition.update(
        { date, userId, intensityId },
        { where: { id } }
    );

    if (updated) {
      const updatedNutrition = await Nutrition.findByPk(id);
      res.status(200).json(updatedNutrition);
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteNutrition(req, res) {
  const { id } = req.params;
  try {
    const deleted = await Nutrition.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Nutrition deleted successfully' });
    } else {
      res.status(404).json({ message: 'Nutrition not found' });
    }
  } catch (err) {
    console.error('Error deleting nutrition:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default {
    getNutrition,
    getNutritionById,
    createNutrition,
    updateNutrition,
    deleteNutrition
};