const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/index');

class Tasks extends Model { }

Tasks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assignedBy: {
      type: DataTypes.STRING,
    },
    assignedTo: {
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