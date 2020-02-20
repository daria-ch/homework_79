const express = require('express');
const mysqlDb = require('../mysqlDb');

const router = express.Router();

router.get('/', async (req, res) => {
    const places = await mysqlDb.getConnection().query('SELECT * FROM `places`');
    res.send(places);
});

router.get('/:id', async (req, res) => {
    const place = await mysqlDb.getConnection().query('SELECT * FROM `places` WHERE `id`= ?', req.params.id);
    let placeElement = place[0];
    if (!placeElement) {
        return res.status(400).send({message: 'Not found'})
    } else {
        res.send(placeElement);
    }
});

router.post('/', async (req, res) => {
    const place = req.body;
    const result = await mysqlDb.getConnection().query('INSERT INTO `places` (`name`, `description`) VALUES ' +
        '(?, ?)',
        [place.name, place.description]);
    res.send({name: place.name, description: place.description, id: result.insertId});
});

module.exports = router;