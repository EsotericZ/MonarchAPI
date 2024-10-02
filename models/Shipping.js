const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config');

class Shipping extends Model { }

Shipping.init(
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
    customer: {
      type: DataTypes.STRING,
    },
    vendor: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.STRING,
    },
    jobNo: {
      type: DataTypes.STRING,
    },
    poNo: {
      type: DataTypes.STRING,
    },
    delivery: {
      type: DataTypes.STRING,
    },
    comments: {
      type: DataTypes.STRING,
    },
    scheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    timeFinish: {
      type: DataTypes.DATE,
    },
    driver: {
      type: DataTypes.STRING,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
  sequelize,
  timestamps: true,
  freezeTableName: true,
  modelName: 'shipping',
}
);

module.exports = Shipping;