const CryptoJS = require('crypto-js');
const { Op } = require('sequelize');
const { User } = require('../models');

async function getAllUsers(req, res) {
  try {
    const result = await User.findAll({
      where: { name: { [Op.ne]: 'Admin' } },
      order: [['name', 'ASC']],
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function getUserPassword(req, res) {
  try {
    const { id } = req.body;
    const userInfo = await User.findOne({ where: { id } });

    const bytes = CryptoJS.AES.decrypt(
      userInfo.password,
      process.env.SECRET_KEY || '1234'
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    return res.status(200).send({ data: decryptedPassword });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function createUser(req, res) {
  try {
    const { password, ...otherData } = req.body;
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY || '1234'
    ).toString();

    const result = await User.create({ ...otherData, password: encryptedPassword });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function deleteUser(req, res) {
  try {
    const { username } = req.body;
    const result = await User.destroy({ where: { username } });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateUser(req, res) {
  try {
    const { id, password, ...otherData } = req.body.updateUser;

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY || '1234'
    ).toString();

    const result = await User.update(
      { ...otherData, password: encryptedPassword },
      { where: { id } }
    );
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateEngineering(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.engineering ? 0 : 1;
    const result = await User.update({ engineering: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateMaintenance(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.maintenance ? 0 : 1;
    const result = await User.update({ maintenance: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateShipping(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.shipping ? 0 : 1;
    const result = await User.update({ shipping: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateTLaser(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.tlaser ? 0 : 1;
    const result = await User.update({ tlaser: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateQuality(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.quality ? 0 : 1;
    const result = await User.update({ quality: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateForming(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.forming ? 0 : 1;
    const result = await User.update({ forming: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateMachining(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.machining ? 0 : 1;
    const result = await User.update({ machining: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateLaser(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.laser ? 0 : 1;
    const result = await User.update({ laser: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateSaw(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.saw ? 0 : 1;
    const result = await User.update({ saw: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updatePunch(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.punch ? 0 : 1;
    const result = await User.update({ punch: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateShear(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.shear ? 0 : 1;
    const result = await User.update({ shear: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updatePurchasing(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.purchasing ? 0 : 1;
    const result = await User.update({ purchasing: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateBacklog(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.backlog ? 0 : 1;
    const result = await User.update({ backlog: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

async function updateSpecialty(req, res) {
  try {
    let { id } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({ status: 'User not found' });
    }

    const newValue = user.specialty ? 0 : 1;
    const result = await User.update({ specialty: newValue }, { where: { id } });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err });
  }
}

module.exports = {
  getAllUsers,
  getUserPassword,
  createUser,
  deleteUser,
  updateUser,
  updateEngineering,
  updateMaintenance,
  updateShipping,
  updateTLaser,
  updateQuality,
  updateForming,
  updateMachining,
  updateLaser,
  updateSaw,
  updatePunch,
  updateShear,
  updatePurchasing,
  updateBacklog,
  updateSpecialty,
}