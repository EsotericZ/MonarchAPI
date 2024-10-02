const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class BDChart extends Model { }

BDChart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    subType: {
      type: DataTypes.STRING,
    },
    gauge: {
      type: DataTypes.STRING,
    },
    thickness: {
      type: DataTypes.STRING,
    },
    radius: {
      type: DataTypes.STRING,
    },
    bd: {
      type: DataTypes.STRING,
    },
    punch: {
      type: DataTypes.STRING,
    },
    die: {
      type: DataTypes.STRING,
    },
    dieOpening: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'bdchart',
  }
);

module.exports = BDChart;