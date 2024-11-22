const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const Tasks = require('./Tasks');
const User = require('./User');

class TaskAssignments extends Model { }

TaskAssignments.init(
  {
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tasks,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'taskAssignments',
    modelName: 'TaskAssignments',
    timestamps: false,
  }
);

module.exports = TaskAssignments;