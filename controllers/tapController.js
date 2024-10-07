const { Taps } = require('../models');

async function getStandardTaps(req, res) {
  try {
    const result = await Taps.findAll({
      where: {
        active: 1,
        type: 'Standard',
      },
      order: [['holeSize', 'ASC']],
    });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function getMetricTaps(req, res) {
  try {
    const result = await Taps.findAll({
      where: {
        active: 1,
        type: 'Metric',
      },
      order: [['holeSize', 'ASC']],
    });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function createTap(req, res) {
  try {
    const result = await Taps.create(req.body);
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateTap(req, res) {
  const { id, tapName, holeSize, type, notes } = req.body;

  try {
    const result = await Taps.update(
      { tapName, holeSize, type, notes },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Tap not found or no changes made' });
    }

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

module.exports = {
  getStandardTaps,
  getMetricTaps,
  createTap,
  updateTap,
}