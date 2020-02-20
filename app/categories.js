const express = require('express');
const mysqlDb = require('../mysqlDb');


const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await mysqlDb.getConnection().query('SELECT * FROM `categories`');
    res.send(categories);
});

router.get('/:id', async (req, res) => {
    const category = await mysqlDb.getConnection().query('SELECT * FROM `categories` WHERE `id`= ?', req.params.id);
    let categoryElement = category[0];
    if (!categoryElement) {
        return res.status(400).send({message: 'Not found'})
    } else {
        res.send(categoryElement);
    }

});

router.post('/', async (req, res) => {
    const category = req.body;

    const result = await mysqlDb.getConnection().query('INSERT INTO `categories` (`name`, `description`) VALUES ' +
        '(?, ? ,? ,?, ?)',
        [category.title, category.description]);
    res.send({id: result.insertId});
});

module.exports = router;