const { Notes, TaskAssignments, Tasks, User } = require('../models');
const { Op } = require('sequelize');

async function createTask(req, res) {
  const { assignedBy, assignedTo, description, priority, status } = req.body;
  const transaction = await Tasks.sequelize.transaction();

  try {
    const task = await Tasks.create(
      { assignedBy, description, priority, status },
      { transaction }
    );

    if (Array.isArray(assignedTo) && assignedTo.length > 0) {
      const taskAssignments = assignedTo.map((userId) => ({
        taskId: task.id,
        userId,
      }));

      await TaskAssignments.bulkCreate(taskAssignments, { transaction });
    }

    await transaction.commit();

    return res.status(200).send({ data: task });
  } catch (err) {
    await transaction.rollback();

    return res.status(500).send({ status: err.message });
  }
}

async function getAllTasks(req, res) {
  try {
    const result = await Tasks.findAll({
      include: [
        {
          model: Notes,
          as: 'notes',
        },
        {
          model: TaskAssignments,
          as: 'assignments',
          attributes: ['taskId', 'userId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.status(200).send({ data: result });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getUserTasks(req, res) {
  console.log('hit')
  const userId = req.params.id;
  console.log(userId)
  console.log(req.params.id)

  try {
    const result = await Tasks.findAll({
      where: {
        [Op.or]: [
          { assignedBy: userId },
          {
            '$assignments.userId$': userId,
          },
        ],
      },
      include: [
        {
          model: Notes,
          as: 'notes',
        },
        {
          model: TaskAssignments,
          as: 'assignments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.status(200).send({ data: result });
  } catch (err) {
    console.error('Error fetching tasks:', err);
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
  createTask,
  getAllTasks,
  getUserTasks,
  updateTaskNote,
}