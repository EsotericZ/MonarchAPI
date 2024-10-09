let express = require('express');
let router = express.Router();

const engineeringRoutes = require('./engineeringRoutes');
const formingRoutes = require('./formingRoutes');
const machiningRoutes = require('./machiningRoutes');
const materialRoutes = require('./materialRoutes');
const portalRoutes = require('./portalRoutes');
const qcinfoRoutes = require('./qcinfoRoutes');
const qualityRoutes = require('./qualityRoutes');
const tapRoutes = require('./tapRoutes');
const tlaserRoutes = require('./tlaserRoutes');
const userRoutes = require('./userRoutes');

router.get('/', function (req, res) {
  res.send('Welcome to the API');
});

router.use('/engineering', engineeringRoutes);
router.use('/forming', formingRoutes);
router.use('/machining', machiningRoutes);
router.use('/material', materialRoutes);
router.use('/portal', portalRoutes);
router.use('/qcinfo', qcinfoRoutes);
router.use('/quality', qualityRoutes);
router.use('/taps', tapRoutes);
router.use('/tlaser', tlaserRoutes);
router.use('/users', userRoutes);

module.exports = router;