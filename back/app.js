const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());

app.use('/', express.static(__dirname + '/../front/dist'));

app.use(bodyParser.json({limit: '15mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '15mb'}));
require('./routers')(app);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});