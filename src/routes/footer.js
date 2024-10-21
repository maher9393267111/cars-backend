const express = require('express');
const router = express.Router();
const { getFooter, updateFooter ,createFooter} = require('../controllers/footer');

router.get('/admin/footer', getFooter);
router.put('/admin/footer', updateFooter);
router.post('/admin/footer', createFooter);


module.exports = router;    