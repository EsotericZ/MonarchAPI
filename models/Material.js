const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Material extends Model { }

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    programNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobNo: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    machine: {
      type: DataTypes.STRING,
    },
    checkMatl: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    needMatl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    onOrder: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'material',
  }
);

module.exports = Material;