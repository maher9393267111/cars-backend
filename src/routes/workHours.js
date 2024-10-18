const express = require('express');
const router = express.Router();
const { createWorkHours, getWorkHours, updateWorkHours } = require('../controllers/workHours');

router.post('/admin/work-hours', createWorkHours);
router.get('/admin/work-hours', getWorkHours);
router.put('/admin/work-hours', updateWorkHours);

module.exports = router;