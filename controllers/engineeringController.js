const { Op } = require('sequelize');
const { Jobs } = require('../models');
let sql = require('mssql');
require('dotenv').config();

let sequelize = require('../config/index');
let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: '10.0.1.130\\E2SQLSERVER',
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

async function getAllJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();

      request.query(`
          SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode
          FROM OrderRouting R 
          INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
          INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
          WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'
          ORDER BY R.JobNo`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          const map = new Map();
          records.forEach(item => map.set(item.JobNo, item));
          jobData.forEach(item => map.set(item.jobNo, { ...map.get(item.jobNo), ...item }));
          const fullJob = Array.from(map.values());

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getUnconfirmedJobs(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();

      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode
        FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3='UNCONFIRMED'
        ORDER BY R.JobNo`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          res.send(records)
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getTBRJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();

      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='2. TBR'
        ORDER BY D.User_Number3`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          const map = new Map();
          records.forEach(item => map.set(item.JobNo, item));
          jobData.forEach(item => map.set(item.jobNo, { ...map.get(item.jobNo), ...item }));
          const fullJob = Array.from(map.values());

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getFutureJobs(req, res) {
  try {
    const jobData = await Jobs.findAll({
      where: {
        jobNo: {
          [Op.gt]: 150000
        }
      }
    });

    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }

      let request = new sql.Request();
      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='1. OFFICE'
        ORDER BY D.DueDate, R.JobNo`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          const map = new Map();
          records.forEach(item => map.set(item.JobNo, item));
          jobData.forEach(item => map.set(item.jobNo, { ...map.get(item.jobNo), ...item }));
          const fullJob = Array.from(map.values());

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getRepeatJobs(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();
      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text3='REPEAT'
        ORDER BY D.DueDate, R.JobNo`,
  
        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];
  
          res.send(records)
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getOutsourceJobs(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) console.error(err);
      let request = new sql.Request();
      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='6. OUTSOURCE'
        ORDER BY D.DueDate, R.JobNo`,

        function (err, recordset) {
          if (err) console.error(err);
          let records = recordset.recordsets[0];

          res.send(records)
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getNextStep(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();
      request.query(`
        SELECT R.JobNo, R.WorkCntr
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='203 LASER') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='211 TLASER') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='201 SHEAR') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='202 PUNCH') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='212 FLASER') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='213 SLASER') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='301 SAW') 
        OR (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='402 WELD')
        ORDER BY R.Jobno`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          res.send(records)
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getPrints(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();
      request.query(`
        SELECT P.PartNo, P.DocNumber, R.JobNo
        FROM PartFiles P 
        INNER JOIN OrderDet D ON P.PartNo=D.PartNo 
        INNER JOIN OrderRouting R ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE D.Status='Open' AND D.User_Text3='Repeat' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='101 ENGIN' AND O.User_Text3!='UNCONFIRMED'`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          res.send(records)
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function getOutsourcePrints(req, res) {
  try {
    sql.connect(config, function (err,) {
      if (err) {
        console.error('Error connecting to MSSQL:', err);
        return res.status(500).send({ error: 'Failed to connect to MSSQL' });
      }
      let request = new sql.Request();
      request.query(`
        SELECT P.PartNo, P.DocNumber, R.JobNo
        FROM PartFiles P 
        INNER JOIN OrderDet D ON P.PartNo=D.PartNo 
        INNER JOIN OrderRouting R ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        WHERE D.Status='Open' AND D.User_Text2='6. OUTSOURCE' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='101 ENGIN' AND O.User_Text3!='UNCONFIRMED'`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          res.send(records)
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
};

async function updateJob(req, res) {
  try {
    const { jobNo, engineer, jobStatus } = req.body;

    const result = await Jobs.update(
      { engineer, jobStatus }, 
      {
        where: { jobNo }
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found or no changes made'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
      response: result
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the job',
      error: error.message
    });
  }
};

async function updateModel(req, res) {
  try {
    const { id } = req.body;
    const job = await Jobs.findOne({ where: { id } });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found',
      });
    }

    const newModelValue = job.model ? 0 : 1;
    const result = await Jobs.update({ model: newModelValue }, { where: { id } });

    return res.status(200).json({
      status: 'success',
      data: result,
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the model',
      error: err.message,
    });
  }
}

async function updateExpedite(req, res) {
  try {
    const { id } = req.body;
    const job = await Jobs.findOne({ where: { id } });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found',
      });
    }

    const newExpediteValue = job.expedite ? 0 : 1;
    const result = await Jobs.update({ expedite: newExpediteValue }, { where: { id } });

    return res.status(200).json({
      status: 'success',
      message: 'Expedite value updated successfully',
      data: result,
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating expedite',
      error: err.message,
    });
  }
}

async function updateEngineer(req, res) {
  try {
    const { jobNo, engineer } = req.body;
    const result = await Jobs.update(
      { engineer },          
      { where: { jobNo } }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found or no changes made',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Engineer updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating engineer:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the engineer',
      error: error.message,
    });
  }
}

async function updateJobStatus(req, res) {
  try {
    const { jobNo, jobStatus } = req.body;
    const result = await Jobs.update(
      { jobStatus },
      { where: { jobNo } }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found or no changes made',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Job status updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating job status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the job status',
      error: error.message,
    });
  }
}


module.exports = {
  getAllJobs,
  getUnconfirmedJobs,
  getFutureJobs,
  getRepeatJobs,
  getNextStep,
  getOutsourceJobs,
  getPrints,
  getOutsourcePrints,
  getTBRJobs,
  updateJob,
  updateModel,
  updateExpedite,
  updateEngineer,
  updateJobStatus
}