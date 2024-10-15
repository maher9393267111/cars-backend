// routes/services.js

const express = require('express');
const router = express.Router();
const { createService, getServices, updateServices, deleteService } = require('../controllers/service');

router.post('/admin/services', createService);
router.get('/admin/services', getServices);
router.put('/admin/services', updateServices);
router.delete('/admin/services/:serviceId', deleteService);

module.exports = router;