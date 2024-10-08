const { Jobs, TLJobs } = require('../models');
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

async function getAllJobs(req, res) {
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
        INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo 
        INNER JOIN Estim E ON D.PartNo = E.PartNo 
        INNER JOIN Materials M ON D.PartNo = M.PartNo
        WHERE D.Status = 'Open' AND R.Status != 'Finished' AND R.Status != 'Closed' AND R.WorkCntr = '211 TLASER' AND R.JobNo 
        IN (
          SELECT R.JobNo 
          FROM OrderRouting R 
          INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
          INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo 
          WHERE D.Status = 'Open' AND R.Status = 'Finished' AND R.WorkCntr = '101 ENGIN'
        )
        ORDER BY R.JobNo`,
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

          const map = new Map();
          records.forEach((item) => map.set(item.JobNo, item));
          jobData.forEach((item) =>
            map.set(item.jobNo, { ...map.get(item.jobNo), ...item })
          );
          const fullJob = Array.from(map.values());

          return res.status(200).json({
            status: 'success',
            data: fullJob,
          });
        }
      );
    });
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the jobs',
      error: error.message,
    });
  }
}

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
        INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo 
        INNER JOIN Estim E ON D.PartNo = E.PartNo 
        INNER JOIN Materials M ON D.PartNo = M.PartNo
        WHERE D.Status = 'Open' AND R.Status != 'Finished' AND R.Status != 'Closed' AND R.WorkCntr = '211 TLASER' AND D.User_Text2 = '2. TBR' AND R.JobNo 
        IN (
          SELECT R.JobNo 
          FROM OrderRouting R 
          INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
          INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo 
          WHERE D.Status = 'Open' AND R.Status = 'Finished' AND R.WorkCntr = '101 ENGIN'
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

          const map = new Map();
          records.forEach((item) => map.set(item.JobNo, item));
          jobData.forEach((item) =>
            map.set(item.jobNo, { ...map.get(item.jobNo), ...item })
          );
          const fullJob = Array.from(map.values());

          return res.status(200).json({
            status: 'success',
            data: fullJob,
          });
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
        INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
        INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo 
        INNER JOIN Estim E ON D.PartNo = E.PartNo 
        INNER JOIN Materials M ON D.PartNo = M.PartNo
        WHERE D.Status = 'Open' AND R.Status != 'Finished' AND R.Status != 'Closed' AND R.WorkCntr = '211 TLASER' AND (D.User_Text2 = '1. OFFICE' OR D.User_Text2 = '3. WIP') AND R.JobNo 
        IN (
          SELECT R.JobNo 
          FROM OrderRouting R 
          INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
          INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo 
          WHERE D.Status = 'Open' AND R.Status = 'Finished' AND R.WorkCntr = '101 ENGIN'
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

          const map = new Map();
          records.forEach((item) => map.set(item.JobNo, item));
          jobData.forEach((item) =>
            map.set(item.jobNo, { ...map.get(item.jobNo), ...item })
          );
          const fullJob = Array.from(map.values());

          return res.status(200).json({
            status: 'success',
            data: fullJob,
          });
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

async function updateTLProgrammer(req, res) {
  try {
    const { jobNo, tlProgrammer } = req.body;

    const result = await Jobs.update(
      { tlProgrammer }, 
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
      message: 'TL Programmer updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating TL Programmer:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the TL Programmer',
      error: error.message,
    });
  }
}

async function updateTLStatus(req, res) {
  try {
    const { jobNo, tlStatus } = req.body;
    let jobStatus;

    if (tlStatus === 'DONE') {
      jobStatus = 'DONE';
    } else {
      jobStatus = 'TLASER';
    }

    const result = await Jobs.update(
      { tlStatus, jobStatus }, 
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
      message: 'TL Status and Job Status updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating TL Status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the TL Status',
      error: error.message,
    });
  }
}

module.exports = {
  getAllJobs,
  getTBRJobs,
  getFRJobs,
  updateTLProgrammer,
  updateTLStatus,
}