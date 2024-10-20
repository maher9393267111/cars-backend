const express = require('express');
const router = express.Router();
const { createTitles, getTitles, updateTitles, deleteTitles } = require('../controllers/titles');

// Import verifyToken function
const verifyToken = require('../config/jwt');

router.post('/admin/titles', createTitles);
router.get('/admin/titles', getTitles);
router.put('/admin/titles', updateTitles);
router.delete('/admin/titles/:titleId', deleteTitles);

module.exports = router;