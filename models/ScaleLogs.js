const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/index');

class ScaleLogs extends Model { }

ScaleLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    scaleName: {
      type: DataTypes.STRING,
    },
    itemLocation: {
      type: DataTypes.STRING,
    },
    oldQty: {
      type: DataTypes.INTEGER,
    },
    newQty: {
      type: DataTypes.INTEGER,
    },
    employee: {
      type: DataTypes.STRING,
    },
    timeStamp: {
      type: DataTypes.STRING,
    },
  }, {
  sequelize,
  timestamps: false,
  freezeTableName: true,
  modelName: 'scalelogs',
}
);

module.exports = ScaleLogs;