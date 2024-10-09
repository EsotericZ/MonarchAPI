const { TLJobs } = require('../models');
let sql = require('mssql');
require("dotenv").config();

let sequelize = require('../config/index');
let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: '10.0.1.130\\E2SQLSERVER',
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  }
};

async function getTBRJobs(req, res) {
  try {
    const jobData = await TLJobs.findAll();

    sql.connect(config, function (err) {
      if (err) {
        console.error('SQL Connection Error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'SQL connection failed',
          error: err.message,
        });
      }

      let request = new sql.Request();

      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo, D.User_Date1
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo 
        INNER JOIN Estim E ON D.PartNo=E.PartNo 
        INNER JOIN Materials M ON D.PartNo=M.PartNo
        WHERE D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='203 LASER' AND D.User_Text2='2. TBR' AND R.JobNo
        IN (
          SELECT R.JobNo 
          FROM OrderRouting R 
          INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
          INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo 
          WHERE D.Status='Open' AND R.Status='Finished' AND R.WorkCntr='101 ENGIN'
        )
        ORDER BY D.User_Number3`,
        function (err, recordset) {
          if (err) {
            console.error('SQL Query Error:', err);
            return res.status(500).json({
              status: 'error',
              message: 'Failed to retrieve jobs from SQL',
              error: err.message,
            });
          }

          let records = recordset.recordsets[0];

          if (!records || records.length === 0) {
            return res.status(200).send([]);
          }

          const combinedRecords = records.reduce((acc, record) => {
            const jobNo = record.JobNo;

            if (!acc[jobNo]) {
              acc[jobNo] = { ...record, SubPartNo: [record.SubPartNo] };
            } else {
              acc[jobNo].SubPartNo.push(record.SubPartNo);
            }

            return acc;
          }, {});

          let fullJob = Object.values(combinedRecords);

          fullJob = fullJob.map(record => {
            const jobItem = jobData.find(item => item.jobNo === record.JobNo);
            return {
              ...record,
              ...jobItem,
            };
          });
        
          fullJob.sort((a, b) => {
            const numberA = a.User_Number3 || 0; 
            const numberB = b.User_Number3 || 0;
            if (numberA < numberB) return -1;
            if (numberA > numberB) return 1;
            return a.JobNo.localeCompare(b.JobNo);
          });

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error in getTBRJobs:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the jobs',
      error: error.message,
    });
  }
}

async function getFRJobs(req, res) {
  try {
    const jobData = await TLJobs.findAll();

    sql.connect(config, function (err) {
      if (err) {
        console.error('SQL Connection Error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'SQL connection failed',
          error: err.message,
        });
      }

      let request = new sql.Request();

      request.query(`
        SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo, D.User_Date1
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo 
        INNER JOIN Estim E ON D.PartNo=E.PartNo 
        INNER JOIN Materials M ON D.PartNo=M.PartNo
        WHERE D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='203 LASER' AND (D.User_Text2 = '1. OFFICE' OR D.User_Text2 = '3. WIP') AND R.JobNo
        IN (
          SELECT R.JobNo 
          FROM OrderRouting R 
          INNER JOIN OrderDet D ON R.JobNo=D.JobNo 
          INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo 
          WHERE D.Status='Open' AND R.Status='Finished' AND R.WorkCntr='101 ENGIN'
        )
        ORDER BY D.DueDate, R.JobNo`,
        function (err, recordset) {
          if (err) {
            console.error('SQL Query Error:', err);
            return res.status(500).json({
              status: 'error',
              message: 'Failed to retrieve jobs from SQL',
              error: err.message,
            });
          }

          let records = recordset.recordsets[0];

          if (!records || records.length === 0) {
            return res.status(200).send([]);
          }

          const combinedRecords = records.reduce((acc, record) => {
            const jobNo = record.JobNo;

            if (!acc[jobNo]) {
              acc[jobNo] = { ...record, SubPartNo: [record.SubPartNo] };
            } else {
              acc[jobNo].SubPartNo.push(record.SubPartNo);
            }

            return acc;
          }, {});

          let fullJob = Object.values(combinedRecords);

          fullJob = fullJob.map(record => {
            const jobItem = jobData.find(item => item.jobNo === record.JobNo);
            return {
              ...record,
              ...jobItem,
            };
          });
    
          fullJob.sort((a, b) => {
            const dateA = new Date(a.DueDate);
            const dateB = new Date(b.DueDate);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return a.JobNo.localeCompare(b.JobNo);
          });

          res.send(fullJob);
        }
      );
    });
  } catch (error) {
    console.error('Error in getFRJobs:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the jobs',
      error: error.message,
    });
  }
}

module.exports = {
  getTBRJobs,
  getFRJobs,
}