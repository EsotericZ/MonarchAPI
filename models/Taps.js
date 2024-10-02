const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Taps extends Model { }

Taps.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tapName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    holeSize: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'taps',
  }
);

module.exports = Taps;