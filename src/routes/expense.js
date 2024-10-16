const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');


// Public routes
router.get('/admin/all-expenses', expenseController.getExpenses);



router
  .route('/admin/expense')
  .get(expenseController.getExpenses)
  .post(expenseController.createExpense);

router
  .route('/admin/expense/:id')
  .get(expenseController.getExpense)
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;