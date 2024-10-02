const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/index');

class QCInfo extends Model { }

QCInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    custCode: {
      type: DataTypes.STRING,
    },
    coc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    matlCert: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    platCert: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    addInfo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.STRING,
    },
  }, {
  sequelize,
  timestamps: false,
  tableName: 'qcinfo',
  modelName: 'QCInfo',
}
);

module.exports = QCInfo;