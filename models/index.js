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
const TLJobs = require('./TLJobs');
const Todo = require('./Todo');
const User = require('./User');

Tasks.hasMany(Notes, { foreignKey: 'taskId' });
Notes.belongsTo(Tasks, { foreignKey: 'taskId' });

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
  TLJobs,
  Todo,
  User,
};