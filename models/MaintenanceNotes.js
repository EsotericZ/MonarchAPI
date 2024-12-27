const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/index');

class MaintenanceNotes extends Model { }

MaintenanceNotes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    maintenanceRecord: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'maintenance',
        key: 'record',
      },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'maintenancenotes',
    modelName: 'MaintenanceNotes',
  }
);

module.exports = MaintenanceNotes;