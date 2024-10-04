const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

require('./sockets')(app, aWss);

const imageController = require('./image-api');

app.post('/image', imageController.uploadImage);
app.get('/image', imageController.getImage);

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
