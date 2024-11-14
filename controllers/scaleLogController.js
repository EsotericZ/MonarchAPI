const Op = require('sequelize').Op;
const { ScaleItems, ScaleLogs } = require('../models');

async function getMMScaleLogs(req, res) {
  try {
    const result = await ScaleLogs.findAll({
      order: [['timeStamp', 'DESC']]
    });
    
    return res.status(200).send({ data: result });
  } catch (err) {
    console.error('Error retrieving scale logs:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

async function addNewScaleLog(req, res) {
  try {
    const existingLogs = await ScaleLogs.findAll({
      where: {
        timeStamp: req.body.timeStamp
      }
    });

    const smallItemCheck = await ScaleItems.findOne({
      where: {
        itemLocation: req.body.itemLocation
      }
    })

    if (!smallItemCheck) {
      // console.log('Scale Item Not Found')
      return res.status(404).send({
        message: 'ScaleItem not found'
      });
    }

    const quantityDifference = Math.abs(req.body.oldQty - req.body.newQty);

    if (smallItemCheck.smallItem) {
      if (quantityDifference <= 2) {
        // console.log('This is a small item with minimal change and should not be logged.');
        return res.status(200).send({
          message: 'Small item change is below the threshold and will not be logged.'
        });
      }
    }

    if (existingLogs.length > 0) {
      // console.log('Log with the same timestamp already exists.');
      return res.status(409).send({
        message: 'Log with the same timestamp already exists.'
      });
    } else {
      // Proceed with log creation
      const newLog = await ScaleLogs.create(req.body);
      return res.status(200).send({
        data: newLog
      });
    }

  } catch (err) {
    console.error('Error adding new scale log:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
};

async function deleteScaleLog(req, res) {
  const { id } = req.body;

  try {
    const result = await ScaleLogs.destroy({
      where: { id: id }
    });

    if (result) {
      return res.status(200).send({
        status: 'success',
        message: 'Log deleted successfully',
        data: result
      });
    } else {
      return res.status(404).send({
        status: 'error',
        message: 'Log not found'
      });
    }
  } catch (err) {
    console.error('Error deleting scale log:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
};

module.exports = {
  getMMScaleLogs,
  addNewScaleLog,
  deleteScaleLog,
}