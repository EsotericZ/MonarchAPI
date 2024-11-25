const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        description: 'Username and password are required',
      });
    }

    const userInfo = await User.findOne({ where: { username: username } });

    if (!userInfo) {
      return res.status(404).json({
        status: 'error',
        description: 'User does not exist',
      });
    }

    const bytes = CryptoJS.AES.decrypt(userInfo.password, process.env.SECRET_KEY || '1234');
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.status(403).json({
        status: 'error',
        description: 'Incorrect password',
      });
    }

    const accessToken = jwt.sign(
      {
        id: userInfo.id,
        name: userInfo.name,
        username: userInfo.username,
        number: userInfo.number,
        role: userInfo.role,
        backlog: userInfo.backlog,
        engineering: userInfo.engineering,
        forming: userInfo.forming,
        laser: userInfo.laser,
        machining: userInfo.machining,
        maintenance: userInfo.maintenance,
        punch: userInfo.punch,
        purchasing: userInfo.purchasing,
        quality: userInfo.quality,
        saw: userInfo.saw,
        shear: userInfo.shear,
        shipping: userInfo.shipping,
        specialty: userInfo.specialty,
        tlaser: userInfo.tlaser,
      },
      process.env.JWT_SECRET_KEY || 'pass',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      status: 'success',
      accessToken: accessToken,
    });
  } catch (error) {
    console.error('Error during login:', error);

    return res.status(500).json({
      status: 'error',
      description: 'Internal server error',
    });
  }
}

module.exports = {
  login,
}