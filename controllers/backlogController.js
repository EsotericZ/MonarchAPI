const { literal } = require("sequelize");
const { Jobs } = require('../models');
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
}

async function getAllJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    const currentDate = new Date();
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    firstDayOfNextMonth.setUTCHours(0, 0, 0, 0);

    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.query(`
      SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, O.OrderTotal, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust
      FROM OrderRouting R 
      INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
      INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo
      WHERE (D.Status = 'Open' AND O.User_Text3 != 'UNCONFIRMED' AND R.Status = 'Current') 
      OR (O.Status = 'O' AND D.MasterJobNo != '' AND R.StepNo = 10) 
      OR (O.Status = 'O' AND D.Status = 'Open' AND R.StepNo = 10 AND D.User_Text2 = '4. DONE') 
      OR (O.Status = 'O' AND D.Status = 'Open' AND D.User_Text3 = '' AND D.User_Text2 = '')
      ORDER BY D.DueDate, R.JobNo
    `);

    const records = result.recordset;
    const filteredRecords = records.filter(record => new Date(record.DueDate) < firstDayOfNextMonth);

    const jobDataMap = new Map();
    jobData.forEach(job => jobDataMap.set(job.jobNo, job));

    const mergedRecords = filteredRecords.map(record => {
      const job = jobDataMap.get(record.JobNo);
      return job ? { ...record, ...job } : record;
    });

    res.status(200).json(mergedRecords);

  } catch (err) {
    console.error('Error fetching all jobs:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching all jobs',
      error: err.message,
    });
  }
}


async function getNextMonthJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    const currentDate = new Date();
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    firstDayOfNextMonth.setUTCHours(0, 0, 0, 0); 
    const firstDayOfFollowingMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    firstDayOfFollowingMonth.setUTCHours(0, 0, 0, 0);

    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.query(`
      SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, O.OrderTotal, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust
      FROM OrderRouting R 
      INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
      INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo
      WHERE (D.Status = 'Open' AND O.User_Text3 != 'UNCONFIRMED' AND R.Status = 'Current') 
      OR (O.Status = 'O' AND D.MasterJobNo != '' AND R.StepNo = 10) 
      OR (O.Status = 'O' AND D.Status = 'Open' AND R.StepNo = 10 AND D.User_Text2 = '4. DONE') 
      OR (O.Status = 'O' AND D.Status = 'Open' AND D.User_Text3 = '' AND D.User_Text2 = '')
      ORDER BY D.DueDate, R.JobNo
    `);

    let records = result.recordset;
    const filteredRecords = records.filter(record => {
      const dueDate = new Date(record.DueDate);
      return dueDate >= firstDayOfNextMonth && dueDate < firstDayOfFollowingMonth;
    });

    const jobDataMap = new Map();
    jobData.forEach(job => jobDataMap.set(job.jobNo, job));

    const mergedRecords = filteredRecords.map(record => {
      const job = jobDataMap.get(record.JobNo);
      return job ? { ...record, ...job } : record;
    });

    res.status(200).json(mergedRecords);

  } catch (err) {
    console.error('Error fetching next month jobs:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching next month jobs',
      error: err.message,
    });
  }
}


async function getFutureJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

    const currentDate = new Date();
    const firstDayOfFutureMonths = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    firstDayOfFutureMonths.setUTCHours(0, 0, 0, 0);

    await sql.connect(config);
    let request = new sql.Request();

    const result = await request.query(`
      SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, O.OrderTotal, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust
      FROM OrderRouting R 
      INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
      INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo
      WHERE (D.Status = 'Open' AND O.User_Text3 != 'UNCONFIRMED' AND R.Status = 'Current') 
      OR (O.Status = 'O' AND D.MasterJobNo != '' AND R.StepNo = 10) 
      OR (O.Status = 'O' AND D.Status = 'Open' AND R.StepNo = 10 AND D.User_Text2 = '4. DONE') 
      OR (O.Status = 'O' AND D.Status = 'Open' AND D.User_Text3 = '' AND D.User_Text2 = '')
      ORDER BY D.DueDate, R.JobNo
    `);

    let records = result.recordset;
    const filteredRecords = records.filter(record => new Date(record.DueDate) >= firstDayOfFutureMonths);

    const jobDataMap = new Map();
    jobData.forEach(job => jobDataMap.set(job.jobNo, job));

    const mergedRecords = filteredRecords.map(record => {
      const job = jobDataMap.get(record.JobNo);
      return job ? { ...record, ...job } : record;
    });

    res.status(200).json(mergedRecords);

  } catch (err) {
    console.error('Error fetching future jobs:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching future jobs',
      error: err.message,
    });
  }
}


async function getAllSubJobs(req, res) {
  const { JobNo } = req.body;

  try {
    const jobData = await Jobs.findAll();
    await sql.connect(config);

    let request = new sql.Request();
    request.input('JobNo', sql.NVarChar, JobNo);

    const result = await request.query(`
      SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, O.Status, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust
      FROM OrderRouting R 
      INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
      INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo
      WHERE (D.MasterJobNo = @JobNo AND R.Status = 'Current') 
      OR (D.MasterJobNo = @JobNo AND R.StepNo = 10 AND D.User_Text2 = '4. DONE')
      ORDER BY R.JobNo
    `);

    const records = result.recordset;
    const jobDataMap = new Map();
    jobData.forEach(job => jobDataMap.set(job.jobNo, job));

    const mergedRecords = records.map(record => {
      const job = jobDataMap.get(record.JobNo);
      return job ? { ...record, ...job } : record;
    });

    res.status(200).json(mergedRecords);

  } catch (err) {
    console.error('Error fetching sub jobs:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching sub jobs',
      error: err.message,
    });
  }
}

async function getSingleJob(req, res) {
  const { JobNo } = req.body;

  try {
    await sql.connect(config);
    let request = new sql.Request();

    request.input('JobNo', sql.NVarChar, JobNo);
    const result = await request.query(`
      SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode, R.WorkCntr, D.MasterJobNo, R.Status, R.ActualEndDate, R.EmplCode, R.WorkOrVend, R.VendCode, D.UnitPrice, D.QtyOrdered, D.QtyShipped2Cust
      FROM OrderRouting R 
      INNER JOIN OrderDet D ON R.JobNo = D.JobNo 
      INNER JOIN ORDERS O ON D.OrderNo = O.OrderNo
      WHERE D.JobNo = @JobNo
      ORDER BY R.StepNo
    `);

    const records = result.recordset;
    res.status(200).send(records);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the job',
      error: err.message,
    });
  }
}


async function updateJob(req, res) {
  try {
    const { id, blNotes, osvNotes, cdate } = req.body;
    const job = await Jobs.findOne({ where: { id } });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found',
      });
    }

    let utcDate = null;
    if (cdate) {
      const dateObj = new Date(`${cdate}T00:00:00Z`);
      utcDate = dateObj.toISOString().split('T')[0];
    }

    const result = await Jobs.update(
      {
        blnotes: blNotes,
        osvnotes: osvNotes,
        cdate: utcDate ? literal(`'${utcDate}'`) : null,
      },
      { where: { id } }
    );

    return res.status(200).json({
      status: 'success',
      data: result,
    });
    
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the job',
      error: err.message,
    });
  }
}

async function updateEmail(req, res) {
  try {
    const { id } = req.body;
    const job = await Jobs.findOne({ where: { id } });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found',
      });
    }

    const newEmailValue = job.email ? 0 : 1;
    const result = await Jobs.update({ email: newEmailValue }, { where: { id } });

    return res.status(200).json({
      status: 'success',
      data: result,
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the email status',
      error: err.message,
    });
  }
}

async function updateHold(req, res) {
  try {
    const { id } = req.body;
    const job = await Jobs.findOne({ where: { id } });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found',
      });
    }

    const newHoldValue = job.hold ? 0 : 1;
    const result = await Jobs.update({ hold: newHoldValue }, { where: { id } });

    return res.status(200).json({
      status: 'success',
      data: result,
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the hold status',
      error: err.message,
    });
  }
}

async function Unconfirmed(req, res) {
  try {
    await sql.connect(config);

    let request = new sql.Request();
    const result = await request.query(`
      SELECT O.CustCode, D.PartNo, D.Revision, D.DueDate, D.User_Text3, D.JobNo
      FROM ORDERS O 
      INNER JOIN OrderDet D ON O.OrderNo=D.OrderNo
      WHERE O.User_Text3 = 'UNCONFIRMED'
    `);

    let records = result.recordset;
    res.status(200).send(records);

  } catch (err) {
    console.error('Error fetching unconfirmed orders:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching unconfirmed orders',
      error: err.message,
    });
  }
}

async function Test(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();

    request.query(`
      SELECT D.JobNo, O.CustCode, D.PartNo, D.DueDate, D.Revision, D.DueDate, D.User_Text3, D.Status, O.User_Text3, O.Status, D.User_Text2
      FROM ORDERS O 
      INNER JOIN OrderDet D ON O.OrderNo=D.OrderNo
      WHERE (O.Status='O' AND D.Status='Open' AND D.User_Text3='' AND D.User_Text2='')`,

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        res.send(records)
      })
  })
}

module.exports = {
  getAllJobs,
  getNextMonthJobs,
  getFutureJobs,
  getAllSubJobs,
  getSingleJob,
  updateJob,
  updateEmail,
  updateHold,
  Unconfirmed,
  Test,
}