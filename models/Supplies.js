const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Supplies extends Model { }

Supplies.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplies: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedBy: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    productLink: {
      type: DataTypes.STRING,
    },
    jobNo: {
      type: DataTypes.STRING,
    },
    needSupplies: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onOrder: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    expected: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: 'supplies',
  }
);

module.exports = Supplies;