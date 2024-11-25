const { Notes, TaskAssignments, Tasks, User } = require('../models');
const { Op } = require('sequelize');

async function createTask(req, res) {
  const { assignedBy, assignedTo, taskName, description, priority, status } = req.body;
  const transaction = await Tasks.sequelize.transaction();

  try {
    const task = await Tasks.create(
      { assignedBy, taskName, description, priority, status },
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
  const userId = req.params.id;

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
          model: User,
          as: 'assigner', 
          attributes: ['id', 'name'],
        },
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

async function updateTask(req, res) {
  const { id, assignedTo, taskName, description, priority, status } = req.body;
  const transaction = await Tasks.sequelize.transaction();

  try {
    console.log('Update request payload:', req.body);

    // Map names to IDs
    const users = await User.findAll({
      where: {
        name: assignedTo, // Look for users with names in `assignedTo`
      },
      attributes: ['id'], // Only fetch the IDs
    });

    const userIds = users.map((user) => user.id);

    if (userIds.length !== assignedTo.length) {
      throw new Error('Some assigned users could not be found.');
    }

    console.log('Mapped user IDs:', userIds);

    // Update the task details
    const task = await Tasks.update(
      { taskName, description, priority, status },
      { where: { id }, transaction }
    );

    if (!task[0]) {
      throw new Error('Task not found');
    }

    console.log('Clearing existing task assignments...');
    await TaskAssignments.destroy({ where: { taskId: id }, transaction });

    if (userIds.length > 0) {
      console.log('Adding new task assignments:', userIds);
      const taskAssignments = userIds.map((userId) => ({
        taskId: id,
        userId,
      }));

      await TaskAssignments.bulkCreate(taskAssignments, { transaction });
    }

    await transaction.commit();
    console.log('Task successfully updated:', id);

    return res.status(200).send({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error updating task:', err);
    await transaction.rollback();

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
  updateTask,
  updateTaskNote,
}