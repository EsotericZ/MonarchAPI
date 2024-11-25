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

Tasks.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });
Tasks.hasMany(TaskAssignments, { foreignKey: 'taskId', as: 'assignments' });
TaskAssignments.belongsTo(Tasks, { foreignKey: 'taskId', as: 'task' });
TaskAssignments.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Tasks.hasMany(Notes, { foreignKey: 'taskId', as: 'notes' });
Notes.belongsTo(Tasks, { foreignKey: 'taskId', as: 'task' });
User.hasMany(Tasks, { foreignKey: 'assignedBy', as: 'assignedTasks' });
User.hasMany(TaskAssignments, { foreignKey: 'userId', as: 'taskAssignments' });

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