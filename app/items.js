const path = require('path');

const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');

const mysqlDb = require('../mysqlDb');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await mysqlDb.getConnection().query('SELECT * FROM `items`');
    res.send(items);
});

router.get('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('SELECT * FROM `items` WHERE `id`= ?', req.params.id);
    let itemElement = item[0];
    if (!itemElement) {
        return res.status(400).send({message: 'Not found'})
    } else {
        res.send(itemElement);
    }

});

router.post('/', upload.single('image'), async (req, res) => {
    const item = req.body;
    if (req.file) {
        item.image = req.file.filename;
    }
    const result = await mysqlDb.getConnection().query('INSERT INTO `items` (`category_id`, `place_id`, `title`, `description`, `image`) VALUES ' +
        '(?, ? ,? ,?, ?)',
        [item.categoryId, item.placeId, item.title, item.description, item.image]);
    res.send({id: result.insertId});
});

module.exports = router;