const express = require('express');
const cors = require('cors');
const items = require('./app/items');
const categories = require('./app/categories');
const places = require('./app/places');
const mysqlDb = require('./mysqlDb');


const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/items', items);
app.use('/categories', categories);
app.use('/places', places);


const run = async () => {

    await mysqlDb.connect();

    app.listen(port, () => {
        console.log(`HTTP Server started on ${port} port!`);
    });

    process.on('exit', function () {
        mysqlDb.disconnect();
    });

};

run().catch(e => {
    console.error(e);
});