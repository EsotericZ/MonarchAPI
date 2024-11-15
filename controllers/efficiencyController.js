let sql = require('mssql');
require('dotenv').config();

let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: '10.0.1.130\\E2SQLSERVER',
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  }
};

async function getSingleJob(req, res) {
  try {
    const JobNo = req.body.JobNo;
    await sql.connect(config);
    const request = new sql.Request();

    request.input('JobNo', sql.NVarChar, JobNo);
    const result = await request.query(`
      SELECT JobNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status
      FROM OrderRouting
      WHERE JobNo = @JobNo
    `);

    const records = result.recordset;

    console.log(records);
    res.send(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the job data');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

async function getJobRange(req, res) {
  try {
    const StartJobNo = req.body.StartJobNo;
    const FinishJobNo = req.body.FinishJobNo;

    await sql.connect(config);
    const request = new sql.Request();

    request.input('StartJobNo', sql.VarChar, StartJobNo);
    request.input('FinishJobNo', sql.VarChar, FinishJobNo);

    const query = `
      SELECT JobNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status
      FROM OrderRouting
      WHERE CAST(JobNo AS INT) >= CAST(@StartJobNo AS INT)
      AND CAST(JobNo AS INT) <= CAST(@FinishJobNo AS INT)
      ORDER BY JobNo, StepNo
    `;

    const result = await request.query(query);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the job range data');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

async function getLastTwenty(req, res) {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const query = `
      SELECT JobNo, OrderNo, PartNo, StepNo, WorkCntr, ActualStartDate, TotEstHrs, TotActHrs, Status
      FROM OrderRouting
      WHERE 
        OrderNo IN (
          SELECT TOP 10 OrderNo
          FROM Orders
          WHERE Status = 'C' AND ISNUMERIC(OrderNo) = 1
          ORDER BY CAST(OrderNo AS INT) DESC
        )
      ORDER BY JobNo, StepNo
    `;

    const result = await request.query(query);
    const records = result.recordset;

    res.send(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the last 20 job records');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

module.exports = {
  getSingleJob,
  getJobRange,
  getLastTwenty,
}