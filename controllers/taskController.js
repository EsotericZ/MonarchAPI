const { Notes, TaskAssignments, Tasks, User } = require('../models');
const { Op } = require('sequelize');

async function completeTask(req, res) {
  const { taskId } = req.body;

  try {
    const task = await Tasks.update(
      { status: 'Complete' },
      { where: { id: taskId } }
    );

    return res.status(200).send({ data: task });
  } catch (err) {
    await transaction.rollback();

    return res.status(500).send({ status: err.message });
  }
}

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

async function createTaskNote(req, res) {
  const { taskId, note, name, date } = req.body;

  try {
    const newNote = await Notes.create({
      taskId,
      note,
      name,
      date: date || new Date(),
    });

    return res.status(200).send({ data: newNote });
  } catch (err) {
    console.error('Error creating task note:', err);
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

    const sortedTasks = result.map((task) => {
      if (task.notes && Array.isArray(task.notes)) {
        task.notes = task.notes.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return task;
    });

    const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
    const statusOrder = { active: 1, process: 2 };

    const finalSortedTasks = sortedTasks.sort((a, b) => {
      const priorityA = priorityOrder[a.priority.toLowerCase()] || 5;
      const priorityB = priorityOrder[b.priority.toLowerCase()] || 5;

      if (priorityA !== priorityB) return priorityA - priorityB;

      const statusA = statusOrder[a.status.toLowerCase()] || 3;
      const statusB = statusOrder[b.status.toLowerCase()] || 3;

      return statusA - statusB;
    });

    return res.status(200).send({ data: finalSortedTasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function updateTask(req, res) {
  const { id, assignedTo, taskName, description, priority, status } = req.body;
  const transaction = await Tasks.sequelize.transaction();

  try {
    const users = await User.findAll({
      where: {
        name: assignedTo, 
      },
      attributes: ['id'], 
    });

    const userIds = users.map((user) => user.id);

    if (userIds.length !== assignedTo.length) {
      throw new Error('Some assigned users could not be found.');
    }

    const task = await Tasks.update(
      { taskName, description, priority, status },
      { where: { id }, transaction }
    );

    if (!task[0]) {
      throw new Error('Task not found');
    }

    await TaskAssignments.destroy({ where: { taskId: id }, transaction });

    if (userIds.length > 0) {
      const taskAssignments = userIds.map((userId) => ({
        taskId: id,
        userId,
      }));

      await TaskAssignments.bulkCreate(taskAssignments, { transaction });
    }

    await transaction.commit();
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
  completeTask,
  createTask,
  createTaskNote,
  getAllTasks,
  getUserTasks,
  updateTask,
  updateTaskNote,
}