const BDChart = require('./BDChart');
const Jobs = require('./Jobs');
const Maintenance = require('./Maintenance');
const Material = require('./Material');
const Notes = require('./Notes');
const QCInfo = require('./QCInfo');
const ScaleItems = require('./ScaleItems');
const Scales = require('./Scales');
const ScaleLogs = require('./ScaleLogs');
const Shipping = require('./Shipping');
const Supplies = require('./Supplies');
const Taps = require('./Taps');
const Tasks = require('./Tasks');
const TaskAssignments = require('./TaskAssignments');
const TLJobs = require('./TLJobs');
const Todo = require('./Todo');
const User = require('./User');

Tasks.hasMany(Notes, { foreignKey: 'taskId', as: 'notes' });
Notes.belongsTo(Tasks, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Tasks, { foreignKey: 'assignedBy', as: 'assignedTasks' });
Tasks.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });

User.hasMany(Notes, { foreignKey: 'name', as: 'userNotes' });
Notes.belongsTo(User, { foreignKey: 'name', as: 'user' });

Tasks.belongsToMany(User, { through: TaskAssignments, foreignKey: 'taskId', as: 'assignedUsers' });
User.belongsToMany(Tasks, { through: TaskAssignments, foreignKey: 'userId', as: 'tasks' });

module.exports = {
  BDChart,
  Jobs,
  Maintenance,
  Material,
  Notes,
  QCInfo,
  ScaleItems,
  Scales,
  ScaleLogs,
  Shipping,
  Supplies,
  Taps,
  Tasks,
  TaskAssignments,
  TLJobs,
  Todo,
  User,
};