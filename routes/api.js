let express = require('express');
let router = express.Router();

const backlogRoutes = require('./backlogRoutes');
const engineeringRoutes = require('./engineeringRoutes');
const flaserRoutes = require('./flaserRoutes');
const formingRoutes = require('./formingRoutes');
const laserRoutes = require('./laserRoutes');
const machiningRoutes = require('./machiningRoutes');
const materialRoutes = require('./materialRoutes');
const portalRoutes = require('./portalRoutes');
const punchRoutes = require('./punchRoutes');
const qcinfoRoutes = require('./qcinfoRoutes');
const qualityRoutes = require('./qualityRoutes');
const sawRoutes = require('./sawRoutes');
const shearRoutes = require('./shearRoutes');
const slaserRoutes = require('./slaserRoutes');
const tapRoutes = require('./tapRoutes');
const tlaserRoutes = require('./tlaserRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/backlog', backlogRoutes);
router.use('/engineering', engineeringRoutes);
router.use('/flaser', flaserRoutes);
router.use('/forming', formingRoutes);
router.use('/laser', laserRoutes);
router.use('/machining', machiningRoutes);
router.use('/material', materialRoutes);
router.use('/portal', portalRoutes);
router.use('/punch', punchRoutes);
router.use('/qcinfo', qcinfoRoutes);
router.use('/quality', qualityRoutes);
router.use('/saw', sawRoutes);
router.use('/shear', shearRoutes);
router.use('/slaser', slaserRoutes);
router.use('/taps', tapRoutes);
router.use('/tlaser', tlaserRoutes);
router.use('/users', userRoutes);

module.exports = router;