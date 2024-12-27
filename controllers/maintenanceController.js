const { Maintenance } = require('../models');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
let sql = require('mssql');
require("dotenv").config();

let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: '10.0.1.130\\E2SQLSERVER',
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  }
};

async function getAllRequests(req, res) {
  try {
    const result = await Maintenance.findAll();
    const sortedData = result.sort((a, b) => {
      const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
      const priorityA = priorityOrder[a.priority.toLowerCase()] || 5;
      const priorityB = priorityOrder[b.priority.toLowerCase()] || 5;

      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.record - b.record;
    });
    return res.status(200).send({ data: sortedData });
  } catch (err) {
    console.error('Error fetching requests:', err);
    return res.status(500).send({
      status: 'Error fetching requests',
      error: err.message,
    });
  }
}

async function getAllEquipment(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
    
      let request = new sql.Request();
      request.query(`
        SELECT DISTINCT PartNo, Descrip 
        FROM Estim 
        WHERE ProdCode='EQUIP' 
        ORDER BY PartNo`,
      
      function (err, result) {
        if (err) {
          console.error('Error executing MSSQL query:', err);
          return res.status(500).send({ error: 'Failed to execute MSSQL query' });
        }
        let records = result.recordset;

        if (!records || records.length === 0) {
          return res.status(200).send([]);
        }

        res.status(200).send(records);
      })
    })
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
}

async function getFolder(req, res) {
  const folderName = req.params.folderName;
  const basePath = '\\\\TOWER\\Maintenance\\Website';
  const fullPath = path.join(basePath, folderName);

  if (fs.existsSync(fullPath)) {
    exec(`explorer "${fullPath}"`, (err) => {
      if (err) {
        console.error('Error opening folder:', err);
        return res.status(500).send({ success: false, message: 'Error opening folder', error: err });
      }

      res.status(200).send({ success: true, message: 'Specific folder opened successfully', path: fullPath });
    });
  } else {
    console.log('Folder does not exist, opening base path:', basePath);

    exec(`explorer "${basePath}"`, (err) => {
      if (err) {
        console.error('Error opening base folder:', err);
        return res.status(500).send({ success: false, message: 'Error opening base folder', error: err });
      }

      res.status(200).send({ success: true, message: 'Base folder opened successfully', path: basePath });
    });
  }
};

async function createRequest(req, res) {
  try {
    const result = await Maintenance.create(req.body);

    return res.status(200).send({
      data: result,
      message: 'Request created successfully',
    });
  } catch (err) {
    console.error('Error creating request:', err);

    return res.status(500).send({
      error: 'Failed to create request',
      details: err.message,
    });
  }
}

async function updateRequest(req, res) {
  try {
    const { record, updateRequest } = req.body;
    console.log(record, updateRequest);

    if (!record || !updateRequest) {
      return res.status(400).send({
        status: 'Invalid input',
        message: 'Both "record" and "updateRequest" are required.',
      });
    }

    const [affectedRows] = await Maintenance.update(updateRequest, {
      where: { record },
    });

    if (affectedRows === 0) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No record found with record number: ${record}`,
      });
    }

    return res.status(200).send({
      message: 'Update successful',
      affectedRows,
    });
  } catch (err) {
    console.error('Error updating request:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message,
    });
  }
}

async function approveRequest(req, res) {
  try {
    const { record, approvedBy } = req.body;

    if (!record || !approvedBy) {
      return res.status(400).send({
        status: 'Invalid input',
        message: '"record" and "approvedBy" are required fields.',
      });
    }

    const [affectedRows] = await Maintenance.update(
      {
        approvedBy,
        hold: false,
      },
      { where: { record } }
    );

    if (affectedRows === 0) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No record found with record number: ${record}`,
      });
    }

    return res.status(200).send({
      message: 'Request approved successfully',
      affectedRows,
    });
  } catch (err) {
    console.error('Error approving request:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message,
    });
  }
}

async function denyRequest(req, res) {
  try {
    const { record, done, comments } = req.body;

    if (!record) {
      return res.status(400).send({
        status: 'Invalid input',
        message: '"record" is a required field.',
      });
    }

    const [affectedRows] = await Maintenance.update(
      {
        done: done || false,
        comments: comments || '',
      },
      { where: { record } }
    );

    if (affectedRows === 0) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No record found with record number: ${record}`,
      });
    }

    return res.status(200).send({
      message: 'Request denied successfully',
      affectedRows,
    });
  } catch (err) {
    console.error('Error denying request:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message,
    });
  }
}

async function deleteRequest(req, res) {
  try {
    const { record } = req.body;

    if (!record) {
      return res.status(400).send({
        status: 'Invalid input',
        message: '"record" is a required field.',
      });
    }

    const deletedRows = await Maintenance.destroy({
      where: { record },
    });

    if (deletedRows === 0) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No record found with record number: ${record}`,
      });
    }

    return res.status(200).send({
      message: 'Request deleted successfully',
      deletedRows,
    });
  } catch (err) {
    console.error('Error deleting request:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message,
    });
  }
}

async function holdRequest(req, res) {
  try {
    const { record, requestHold, approvedBy } = req.body;

    if (!record) {
      return res.status(400).send({
        status: 'Invalid Input',
        message: '"record" is a required field.',
      });
    }

    if (typeof requestHold !== 'boolean') {
      return res.status(400).send({
        status: 'Invalid Input',
        message: '"requestHold" must be a boolean value.',
      });
    }

    const [updatedRows] = await Maintenance.update(
      {
        hold: requestHold,
        approvedBy: approvedBy || null,
      },
      { where: { record } }
    );

    if (updatedRows === 0) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No record found with record number: ${record}`,
      });
    }

    return res.status(200).send({
      message: 'Request updated successfully',
      updatedRows,
    });
  } catch (err) {
    console.error('Error updating request hold status:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message,
    });
  }
}

async function doneRequest(req, res) {
  try {
    const { record, comments, done } = req.body;

    if (!record) {
      return res.status(400).send({
        status: 'Invalid Input',
        message: '"record" is a required field.',
      });
    }

    if (typeof done !== 'boolean') {
      return res.status(400).send({
        status: 'Invalid Input',
        message: '"done" must be a boolean value.',
      });
    }

    const [updatedRows] = await Maintenance.update(
      { 
        done,
        comments: comments || null,
      },
      { where: { record } }
    );

    if (updatedRows === 0) {
      return res.status(404).send({
        status: 'Not Found',
        message: `No record found with record number: ${record}`,
      });
    }

    return res.status(200).send({
      message: 'Request marked as done successfully',
      updatedRows,
    });
  } catch (err) {
    console.error('Error marking request as done:', err);
    return res.status(500).send({
      status: 'Error',
      message: err.message,
    });
  }
}

module.exports = {
  getAllRequests,
  getAllEquipment,
  getFolder,
  createRequest,
  updateRequest,
  approveRequest,
  denyRequest,
  deleteRequest,
  holdRequest,
  doneRequest,
}