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
    trustServerCertificate: true,
  }
}

async function getAllJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    sql.connect(config, function (err) {
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
        WHERE R.WorkCntr='104 MACH' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED'
        ORDER BY R.JobNo`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          if (!records || records.length === 0) {
            return res.status(200).send([]);
          }

          const recordMap = new Map();
          records.forEach(item => recordMap.set(item.JobNo, item));

          const fullJob = records.map(record => {
            const jobItem = jobData.find(item => item.jobNo === record.JobNo);
            return {
              ...record,
              ...jobItem
            };
          });

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
}

async function getTBRJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    sql.connect(config, function (err) {
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
        WHERE R.WorkCntr='104 MACH' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='2. TBR'
        ORDER BY D.User_Number3`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          if (!records || records.length === 0) {
            return res.status(200).send([]);
          }

          const recordMap = new Map();
          records.forEach(item => recordMap.set(item.JobNo, item));

          const fullJob = records.map(record => {
            const jobItem = jobData.find(item => item.jobNo === record.JobNo);
            return {
              ...record,
              ...jobItem
            };
          });

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
}

async function getFutureJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    sql.connect(config, function (err) {
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
        WHERE R.WorkCntr='104 MACH' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='1. OFFICE'
        ORDER BY D.DueDate, R.JobNo`,

        function (err, recordset) {
          if (err) {
            console.error('Error executing MSSQL query:', err);
            return res.status(500).send({ error: 'Failed to execute MSSQL query' });
          }
          let records = recordset.recordsets[0];

          if (!records || records.length === 0) {
            return res.status(200).send([]);
          }

          const recordMap = new Map();
          records.forEach(item => recordMap.set(item.JobNo, item));

          const fullJob = records.map(record => {
            const jobItem = jobData.find(item => item.jobNo === record.JobNo);
            return {
              ...record,
              ...jobItem
            };
          });

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    return res.status(500).send({ error: 'An error occurred while fetching job data' });
  }
}

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
        INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo
        WHERE R.WorkCntr = '104 MACH' AND R.Status != 'Finished' AND R.Status != 'Closed' AND D.Status = 'Open' AND O.User_Text3 != 'UNCONFIRMED' AND D.User_Text3 = 'REPEAT'
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
}

module.exports = {
  getAllJobs,
  getFutureJobs,
  getRepeatJobs,
  getTBRJobs,
}