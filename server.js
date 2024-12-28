const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

let routes = require('./routes/api');

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(
  bodyParser.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(404).send({
          status: 'error',
          description: 'Invalid JSON',
        });
        throw Error('Invalid JSON');
      }
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', routes);

const PORT = 3001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});