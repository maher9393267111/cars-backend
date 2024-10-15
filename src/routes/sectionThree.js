// routes/sectionThree.js

const express = require('express');
const router = express.Router();
const { createSection, getSection, updateSection, deleteSection ,updateOrder } = require('../controllers/sectionThree');

router.post('/admin/sectionthree', createSection);
router.get('/admin/sectionthree', getSection);
router.put('/admin/sectionthree', updateSection);
router.delete('/admin/sectionthree/:sectionId', deleteSection);
router.put('/admin/sectionthree/reorder', updateOrder);

module.exports = router;