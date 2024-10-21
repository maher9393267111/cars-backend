const express = require('express');
const router = express.Router();
const {
  createNavTitles,
  getNavTitles,
  updateNavTitles,
  deleteNavTitle,
} = require('../controllers/navTitles');

router.post('/admin/navtitles', createNavTitles);
router.get('/admin/navtitles', getNavTitles);
router.put('/admin/navtitles', updateNavTitles);
router.delete('/admin/navtitles/:itemId', deleteNavTitle);

module.exports = router;