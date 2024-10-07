const { Jobs } = require('../models');

async function updateInspector(req, res) {
  try {
    const { jobNo, inspector } = req.body;
    const result = await Jobs.update(
      { inspector },          
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
      message: 'Inspector updated successfully',
      response: result,
    });

  } catch (error) {
    console.error('Error updating inspector:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the inspector',
      error: error.message,
    });
  }
}

async function updateStatus(req, res) {
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
  updateInspector,
  updateStatus,
}