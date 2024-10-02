const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/index');

class Todo extends Model { }

Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    requestType: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
  sequelize,
  tableName: 'todos',
  modelName: 'Todo',
}
);

module.exports = Todo;