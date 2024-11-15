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

async function getAllCustomers(req, res) {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.query(`
      SELECT * 
      FROM CustCode 
      WHERE Active='Y'`
    );
    const records = result.recordset;

    res.send(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching customer data');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

async function getOneCustomer(req, res) {
  try {
    let custCode = req.body.custCode;

    await sql.connect(config);
    const request = new sql.Request();

    request.input('custCode', sql.NVarChar, custCode);
    const result = await request.query(`
      SELECT * 
      FROM CustCode 
      WHERE CustCode = @custCode
    `);

    const records = result.recordset;

    res.send(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the customer data');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

async function getAllContacts(req, res) {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.query(`
      SELECT * 
      FROM CustCode AS CC 
      JOIN Contacts AS C ON CC.CustCode = C.Code 
      WHERE CC.Active = 'Y'
    `);

    const records = result.recordset;

    res.send(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching contacts');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

async function getOneContact(req, res) {
  try {
    let custCode = req.body.custCode;
    await sql.connect(config);

    const request = new sql.Request();
    request.input('custCode', sql.NVarChar, custCode);

    const result = await request.query(`
      SELECT * 
      FROM CustCode AS CC 
      JOIN Contacts AS C ON CC.CustCode = C.Code 
      WHERE C.Code = @custCode
    `);

    const records = result.recordset;

    res.send(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the contact data');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

async function getAllQuotes(req, res) {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.query(`
      SELECT Q.CustDesc, Q.CustCode, Q.QuoteNo, SUM(QD.Price1 * QD.Qty1) AS TotalAmount, Q.DateEnt, Q.FollowUpDate, Q.ExpireDate, Q.QuotedBy
      FROM Quote AS Q 
      JOIN QuoteDet AS QD ON Q.QuoteNo = QD.QuoteNo
      WHERE Q.User_Text4 = 'ESTIMATED'
      GROUP BY Q.CustDesc, Q.CustCode, Q.QuoteNo, Q.DateEnt, Q.FollowUpDate, Q.ExpireDate, Q.QuotedBy
    `);

    res.send(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching quotes');
  } finally {
    await sql.close().catch(err => console.error('Error closing the connection:', err));
  }
}

module.exports = {
  getAllCustomers,
  getOneCustomer,
  getAllContacts,
  getOneContact,
  getAllQuotes,
}