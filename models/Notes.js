const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const Tasks = require('./Tasks');

class Notes extends Model { }

Notes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tasks,
        key: 'id',
      },
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'notes',
    modelName: 'Notes',
  }
);

module.exports = Notes;