const { ScaleItems } = require('../models');
const { Scales } = require('../models');

async function getAllPorts(req, res) {
  try {
    const result = await Scales.findAll({
      order: [
        ['rack', 'ASC'],
        ['portNo', 'ASC']
      ]
    });

    return res.status(200).send({
      data: result
    });
  } catch (err) {
    console.error('Error retrieving all ports:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

async function getMMItems(req, res) {
  try {
    const result = await ScaleItems.findAll();
    return res.status(200).send({
      data: result
    });
  } catch (err) {
    console.error('Error retrieving scale items:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

async function createPort(req, res) {
  try {
    const result = await Scales.create(req.body);
    return res.status(201).send({
      data: result,
      message: 'Port created successfully.'
    });
  } catch (err) {
    console.error('Error creating port:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

async function createMMItem(req, res) {
  try {
    const result = await ScaleItems.create(req.body);
    return res.status(201).send({
      data: result,
      message: 'Item created successfully.'
    });
  } catch (err) {
    console.error('Error creating item:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

async function updateItem(req, res) {
  const {
    itemName,
    itemLocation,
    currentItemId: itemId,
    itemAlert: alert,
    itemRack: rack,
    itemShelf: shelf,
    itemBin: bin,
    itemArea: area,
    itemSmall: smallItem
  } = req.body;

  try {
    const result = await ScaleItems.update(
      {
        itemName,
        itemLocation,
        alert,
        rack,
        shelf,
        bin,
        area,
        smallItem
      },
      { where: { itemId } }
    );

    if (result[0] > 0) {
      return res.status(200).send({
        message: 'Item updated successfully.',
        data: result
      });
    } else {
      return res.status(404).send({
        message: 'Item not found or no changes made.'
      });
    }
  } catch (err) {
    console.error('Error updating item:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

async function deleteMMItem(req, res) {
  const { itemId } = req.body;

  try {
    const result = await ScaleItems.destroy({
      where: { itemId }
    });

    if (result > 0) {
      return res.status(200).send({
        message: 'Item deleted successfully.',
        data: result
      });
    } else {
      return res.status(404).send({
        message: 'Item not found.'
      });
    }
  } catch (err) {
    console.error('Error deleting item:', err);
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

module.exports = {
  getAllPorts,
  getMMItems,
  createPort,
  createMMItem,
  updateItem,
  deleteMMItem,
}