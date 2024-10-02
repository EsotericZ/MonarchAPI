const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Maintenance extends Model { }

Maintenance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    record: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    requestedBy: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    equipment: {
      type: DataTypes.STRING,
    },
    requestType: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    approvedBy: {
      type: DataTypes.STRING,
    },
    repairedBy: {
      type: DataTypes.STRING,
    },
    repairDescription: {
      type: DataTypes.STRING,
    },
    repairTime: {
      type: DataTypes.STRING,
    },
    comments: {
      type: DataTypes.STRING,
    },
    hold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
  sequelize,
  timestamps: true,
  freezeTableName: true,
  modelName: 'maintenance',
}
);

module.exports = Maintenance;