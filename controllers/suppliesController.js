const { Supplies } = require('../models');

async function getAllSupplies(req, res) {
  try {
    const result = await Supplies.findAll({
      where: {
        completed: 0,
      },
      order: [
        ['createdAt', 'ASC']
      ],
    });

    return res.status(200).send({
      data: result
    });
  } catch (err) {
    console.error('Error fetching supplies:', err); 
    return res.status(500).send({
      status: 'Error',
      message: err.message
    });
  }
}

async function createSupplies(req, res) {
  try {
    const result = await Supplies.create(req.body);
    return res.status(200).send({
      data: result
    });
  } catch (err) {
    console.error('Error creating supply:', err); 
    return res.status(500).send({
      status: 'Error',
      message: err.message
    });
  }
}

async function updateSupplies(req, res) {
  const { id, supplies, department, requestedBy, notes, productLink, jobNo } = req.body;
  try {
    const result = await Supplies.update(
      {
        supplies,
        department,
        requestedBy,
        notes,
        productLink,
        jobNo
      },
      { where: { id } }
    );

    if (result[0] === 0) { 
      return res.status(404).send({
        status: 'Not Found',
        message: `No supply record found with ID: ${id}`
      });
    }

    return res.status(200).send({
      data: result,
      message: `Supply record with ID: ${id} updated successfully`
    });
  } catch (err) {
    console.error('Error updating supply:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message 
    });
  }
}

async function updateSuppliesDate(req, res) {
  const { id, date: expected } = req.body;
  try {
    const result = await Supplies.update(
      { expected },
      { where: { id } }
    );

    if (result[0] === 0) { 
      return res.status(404).send({
        status: 'Not Found',
        message: `No supply record found with ID: ${id}`
      });
    }

    return res.status(200).send({
      data: result,
      message: `Expected date for supply record with ID: ${id} updated successfully`
    });
  } catch (err) {
    console.error('Error updating expected date:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message
    });
  }
}

async function updateOnOrderSupplies(req, res) {
  const { id } = req.body;
  try {
    const supply = await Supplies.findOne({ where: { id } });

    if (!supply) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No supply record found with ID: ${id}`
      });
    }

    if (supply.onOrder) {
      return res.status(200).send({
        data: supply,
        message: `Supply record with ID: ${id} is already marked as on order`
      });
    }

    const result = await Supplies.update(
      {
        needSupplies: 0,
        onOrder: 1,
        completed: 0,
      },
      { where: { id } }
    );

    return res.status(200).send({
      data: result,
      message: `Supply record with ID: ${id} updated to on order`
    });
  } catch (err) {
    console.error('Error updating supply to on order:', err); 
    return res.status(500).send({
      status: 'Error',
      message: err.message
    });
  }
}

async function updateRecieved(req, res) {
  const { id } = req.body;
  try {
    const supply = await Supplies.findOne({ where: { id } });

    if (!supply) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No supply record found with ID: ${id}`
      });
    }

    const result = await Supplies.update(
      {
        needSupplies: 0,
        onOrder: 0,
        completed: 1,
      },
      { where: { id } }
    );

    return res.status(200).send({
      data: result,
      message: `Supply record with ID: ${id} marked as received`
    });
  } catch (err) {
    console.error('Error updating supply as received:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message
    });
  }
}

module.exports = {
  getAllSupplies,
  createSupplies,
  updateSupplies,
  updateSuppliesDate,
  updateOnOrderSupplies,
  updateRecieved,
}