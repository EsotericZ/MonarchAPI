const { Notes, Tasks } = require('../models');

async function getAllTasks(req, res) {
  try {
    const result = await Tasks.findAll({
      include: [
        {
          model: Notes,
          as: 'notes',
        },
      ]
    });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function createTask(req, res) {
  try {
    const result = await Tasks.create(req.body);
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateTaskNote(req, res) {
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
  getAllTasks,
  createTask,
  updateTaskNote,
}