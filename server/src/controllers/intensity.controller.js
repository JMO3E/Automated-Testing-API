import Intensity from '../models/intensity.model.js';

async function getIntensity(req, res) {
  try {
    const intensity = await Intensity.findAll();
    res.status(200).json(intensity);
  } catch (err) {
    console.error('Error fetching intensity:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getIntensityById(req, res) {
  const { id } = req.params;
  try {
    const intensity = await Intensity.findByPk(id);
    if (!intensity) {
      return res.status(404).json({ message: 'Intensity not found' });
    }
    res.status(200).json(intensity);
  } catch (err) {
    console.error('Error fetching intensity:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

async function createIntensity(req, res) {
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingIntensity = await Intensity.findOne({ where: { type } });

    if (existingIntensity) {
      return res.status(409).json({ message: 'Intensity already exists' });
    }

    const newIntensity = await Intensity.create({ type, value });
    res.status(201).json(newIntensity);
  } catch (err) {
    console.error('Error creating intensity:', err);
    res.status(500).json({ 'message': 'Internal Server Error'});
  }
}

async function updateIntensity(req, res) {
  const { id } = req.params;
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {

    const intensity = await Intensity.findByPk(id);

    if (!intensity) {
      return res.status(404).json({ message: 'Intensity not found' });
    }

    const existingIntensity = await Intensity.findOne({ where: { type } });

    if (existingIntensity && existingIntensity.id !== id) {
      return res.status(409).json({ message: 'Intensity already exists' });
    }

    const [updated] = await Intensity.update(
        { type, value },
        { where: { id } }
    );

    if (updated) {
      const updatedIntensity = await Intensity.findByPk(id);
      res.status(200).json(updatedIntensity);
    }
  } catch (err) {
    console.error('Error updating intensity:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteIntensity(req, res) {
  const { id } = req.params;
  try {
    const deleted = await Intensity.destroy({ where: { id } });
    
    if (deleted) {
      res.status(200).json({ message: 'Intensity deleted successfully' });
    } else {
      res.status(404).json({ message: 'Intensity not found' });
    }
  } catch (err) {
    console.error('Error deleting intensity:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default {
  getIntensity,
  getIntensityById,
  createIntensity,
  updateIntensity,
  deleteIntensity
};