const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config');

class ScaleItems extends Model { }

ScaleItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    scaleId: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    itemId: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    itemName: {
      type: DataTypes.STRING,
    },
    itemLocation: {
      type: DataTypes.STRING,
    },
    alert: {
      type: DataTypes.INTEGER,
    },
    rack: {
      type: DataTypes.INTEGER,
    },
    shelf: {
      type: DataTypes.INTEGER,
    },
    bin: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    smallItem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'scaleitems',
  }
);

module.exports = ScaleItems;