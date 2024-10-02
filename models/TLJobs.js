const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class TLJobs extends Model { }

TLJobs.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    jobNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nested: {
      type: DataTypes.BOOLEAN,
    },
    programNo: {
      type: DataTypes.STRING,
    },
    needMatl: {
      type: DataTypes.BOOLEAN,
    },
    matlOnOrder: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: 'tljobs',
  }
);

module.exports = TLJobs;