const { Op } = require('sequelize');
const { Jobs } = require('../models');
let sql = require('mssql');
require("dotenv").config();

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
        console.error("Error connecting to MSSQL:", err);
        return res.status(500).send({ error: "Failed to connect to MSSQL" });
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
            console.error("Error executing MSSQL query:", err);
            return res.status(500).send({ error: "Failed to execute MSSQL query" });
          }
          let records = recordset.recordsets[0];

          const map = new Map();
          records.forEach(item => map.set(item.JobNo, item));
          jobData.forEach(item => map.set(item.jobNo, { ...map.get(item.jobNo), ...item }));
          const fullJob = Array.from(map.values());

          res.send(fullJob)
        }
      );
    });
  } catch (error) {
    console.error("Error fetching job data:", error);
    return res.status(500).send({ error: "An error occurred while fetching job data" });
  }
};

async function getUnconfirmedJobs(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();

    request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3='UNCONFIRMED'\
            ORDER BY R.JobNo",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];
        console.log(records)

        res.send(records)
      })
  })
};

async function getTBRJobs(req, res) {
  const jobData = await Jobs.findAll();
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();

    request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='2. TBR'\
            ORDER BY D.User_Number3",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        const map = new Map();
        records.forEach(item => map.set(item.JobNo, item));
        jobData.forEach(item => map.set(item.jobNo, { ...map.get(item.jobNo), ...item }));
        const fullJob = Array.from(map.values());

        res.send(fullJob)
      })
  })
};

async function getFutureJobs(req, res) {
  const jobData = await Jobs.findAll({
    where: {
      jobNo: {
        [Op.gt]: 150000
      }
    }
  });
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();
    request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo, D.WorkCode\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='1. OFFICE'\
            ORDER BY D.DueDate, R.JobNo",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        const map = new Map();
        records.forEach(item => map.set(item.JobNo, item));
        jobData.forEach(item => map.set(item.jobNo, { ...map.get(item.jobNo), ...item }));
        const fullJob = Array.from(map.values());

        res.send(fullJob)
      })
  })
};

async function getRepeatJobs(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();
    request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text3='REPEAT'\
            ORDER BY D.DueDate, R.JobNo",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        res.send(records)
      })
  })
};

async function getOutsourceJobs(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();
    request.query("SELECT R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, R.OrderNo, R.StepNo, D.QuoteNo\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE R.WorkCntr='101 ENGIN' AND R.Status!='Finished' AND R.Status!='Closed' AND D.Status='Open' AND O.User_Text3!='UNCONFIRMED' AND D.User_Text2='6. OUTSOURCE'\
            ORDER BY D.DueDate, R.JobNo",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        res.send(records)
      })
  })
};

async function getNextStep(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();
    request.query("SELECT R.JobNo, R.WorkCntr\
            FROM OrderRouting R INNER JOIN OrderDet D ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo\
            WHERE (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='203 LASER') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='211 TLASER') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='201 SHEAR') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='202 PUNCH') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='212 FLASER') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='213 SLASER') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='301 SAW') OR\
            (D.Status='Open' AND R.Status!='Finished' AND R.Status!='Closed' AND D.User_Text3='REPEAT' AND R.WorkCntr='402 WELD')\
            ORDER BY R.Jobno",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        res.send(records)
      })
  })
};

async function getPrints(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();
    request.query("SELECT P.PartNo, P.DocNumber, R.JobNo \
            FROM PartFiles P INNER JOIN OrderDet D ON P.PartNo=D.PartNo INNER JOIN OrderRouting R ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo \
            WHERE D.Status='Open' AND D.User_Text3='Repeat' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='101 ENGIN' AND O.User_Text3!='UNCONFIRMED'",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        res.send(records)
      })
  })
};

async function getOutsourcePrints(req, res) {
  sql.connect(config, function (err,) {
    if (err) console.error(err);
    let request = new sql.Request();
    request.query("SELECT P.PartNo, P.DocNumber, R.JobNo \
            FROM PartFiles P INNER JOIN OrderDet D ON P.PartNo=D.PartNo INNER JOIN OrderRouting R ON R.JobNo=D.JobNo INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo \
            WHERE D.Status='Open' AND D.User_Text2='6. OUTSOURCE' AND R.Status!='Finished' AND R.Status!='Closed' AND R.WorkCntr='101 ENGIN' AND O.User_Text3!='UNCONFIRMED'",

      function (err, recordset) {
        if (err) console.error(err);
        let records = recordset.recordsets[0];

        res.send(records)
      })
  })
};

function updateJob(req, res) {
  let jobNo = req.body.jobNo;
  let engineer = req.body.engineer;
  let jobStatus = req.body.jobStatus;
  let sql = `UPDATE jobs SET engineer='${engineer}', jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
  sequelize.query(sql, function (err, result) {
    return res.status(200).json({
      status: 'success',
      response: result
    })
  })
};

async function updateModel(req, res) {
  let id = req.body.id

  await Jobs.findOne({
    where: { id: id }
  })
    .then((result) => {
      if (result.model) {
        Jobs.update(
          { model: 0 },
          { where: { id: id } }
        ).then((result) => {
          return res.status(200).send({
            data: result
          })
        }).catch((err) => {
          return res.status(500).send({
            status: err
          })
        })
      } else {
        Jobs.update(
          { model: 1 },
          { where: { id: id } }
        ).then((result) => {
          return res.status(200).send({
            data: result
          })
        }).catch((err) => {
          return res.status(500).send({
            status: err
          })
        })
      }
    }).catch((err) => {
      return res.status(500).send({
        status: err
      })
    })
}

async function updateExpedite(req, res) {
  let id = req.body.id

  await Jobs.findOne({
    where: { id: id }
  })
    .then((result) => {
      if (result.expedite) {
        Jobs.update(
          { expedite: 0 },
          { where: { id: id } }
        ).then((result) => {
          return res.status(200).send({
            data: result
          })
        }).catch((err) => {
          return res.status(500).send({
            status: err
          })
        })
      } else {
        Jobs.update(
          { expedite: 1 },
          { where: { id: id } }
        ).then((result) => {
          return res.status(200).send({
            data: result
          })
        }).catch((err) => {
          return res.status(500).send({
            status: err
          })
        })
      }
    }).catch((err) => {
      return res.status(500).send({
        status: err
      })
    })
}

function updateEngineer(req, res) {
  let jobNo = req.body.jobNo;
  let engineer = req.body.engineer;
  let sql = `UPDATE jobs SET engineer='${engineer}' WHERE jobNo='${jobNo}'`;
  sequelize.query(sql, function (err, result) {
    return res.status(200).json({
      status: 'success',
      response: result
    })
  })
  res.send(engineer)
};

function updateJobStatus(req, res) {
  let jobNo = req.body.jobNo;
  let jobStatus = req.body.jobStatus;
  let sql = `UPDATE jobs SET jobStatus='${jobStatus}' WHERE jobNo='${jobNo}'`;
  sequelize.query(sql, function (err, result) {
    return res.status(200).json({
      status: 'success',
      response: result
    })
  })
  res.send(jobStatus)
};

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