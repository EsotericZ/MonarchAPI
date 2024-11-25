const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/index');

class Tasks extends Model { }

Tasks.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    assignedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    taskName: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Medium',
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: true,
    tableName: 'tasks',
    modelName: 'Tasks',
  }
);

module.exports = Tasks;