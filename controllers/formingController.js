const { Jobs } = require('../models');
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

async function getAllJobs(req, res) {
  try {
    const jobData = await Jobs.findAll();

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
        SELECT E.DrawNum, R.Descrip, R.JobNo, D.PartNo, D.Revision, R.EstimQty, D.DueDate, O.CustCode, D.User_Text3, D.User_Text2, D.User_Number3, D.User_Number1, R.OrderNo, R.StepNo, D.QuoteNo, M.SubPartNo
        FROM OrderRouting R 
        INNER JOIN OrderDet D ON R.JobNo=D.JobNo
        INNER JOIN ORDERS O ON D.OrderNo=O.OrderNo
        INNER JOIN Estim E ON D.PartNo=E.PartNo
        INNER JOIN Materials M ON D.PartNo=M.PartNo
        WHERE D.Status='Open' AND R.Status='Current' AND R.WorkCntr='204 BRAKE' AND D.User_Text2='3. WIP'
        ORDER BY D.User_Number1 DESC, R.JobNo`,
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

          const uniqueJobs = new Map();

          records.forEach(record => {
            if (!uniqueJobs.has(record.JobNo)) {
              uniqueJobs.set(record.JobNo, record);
            }
          });

          let fullJob = Array.from(uniqueJobs.values());

          fullJob = fullJob.map(record => {
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
    console.error('Error in getAllJobs:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the jobs',
      error: error.message,
    });
  }
}

async function updateJob(req, res) {
  try {
    const { jobNo, formProgrammer, formStatus, notes } = req.body;
    let jobStatus = formStatus === 'DONE' ? 'FINALIZE' : 'FORMING';

    const result = await Jobs.update(
      { formProgrammer, formStatus, jobStatus, notes },
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
      message: 'Job updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the job',
      error: error.message,
    });
  }
};

async function updateFormProgrammer(req, res) {
  try {
    const { jobNo, formProgrammer } = req.body;

    const result = await Jobs.update(
      { formProgrammer },
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
      message: 'Form programmer updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating form programmer:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the form programmer',
      error: error.message,
    });
  }
};

async function updateFormStatus(req, res) {
  try {
    const { jobNo, formStatus } = req.body;
    let jobStatus = formStatus === 'DONE' ? 'FINALIZE' : 'FORMING';

    const result = await Jobs.update(
      { formStatus, jobStatus },
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
      message: 'Form status updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating form status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the form status',
      error: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  updateJob,
  updateFormProgrammer,
  updateFormStatus,
}