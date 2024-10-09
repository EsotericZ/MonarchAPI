let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const flaserRoutes = require('./flaserRoutes');
const formingRoutes = require('./formingRoutes');
const machiningRoutes = require('./machiningRoutes');
const materialRoutes = require('./materialRoutes');
const portalRoutes = require('./portalRoutes');
const qcinfoRoutes = require('./qcinfoRoutes');
const qualityRoutes = require('./qualityRoutes');
const slaserRoutes = require('./slaserRoutes');
const tapRoutes = require('./tapRoutes');
const tlaserRoutes = require('./tlaserRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);
router.use('/flaser', flaserRoutes);
router.use('/forming', formingRoutes);
router.use('/machining', machiningRoutes);
router.use('/material', materialRoutes);
router.use('/portal', portalRoutes);
router.use('/qcinfo', qcinfoRoutes);
router.use('/quality', qualityRoutes);
router.use('/slaser', slaserRoutes);
router.use('/taps', tapRoutes);
router.use('/tlaser', tlaserRoutes);
router.use('/users', userRoutes);

module.exports = router;