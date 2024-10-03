const { QCInfo } = require('../models');

async function getAllQCNotes(req, res) {
  try {
    const result = await QCInfo.findAll({
      order: [['custCode', 'ASC']],
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function createQCNote(req, res) {
  try {
    const result = await QCInfo.create(req.body);
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateQCInfo(req, res) {
  const { id, custCode, coc, matlCert, platCert, addInfo, notes } = req.body;

  try {
    const result = await QCInfo.update(
      { custCode, coc, matlCert, platCert, addInfo, notes },
      { where: { id } }
    );
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

module.exports = {
  getAllQCNotes,
  createQCNote,
  updateQCInfo,
};