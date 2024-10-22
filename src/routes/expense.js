const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');


// Public routes
router.get('/admin/all-expenses', expenseController.getExpenses);
router.post('/admin/expense', expenseController.createExpense);
router.get('/admin/expense/:id', expenseController.getExpense);
router.put('/admin/expense/:id', expenseController.updateExpense);
router.delete('/admin/expense/:id', expenseController.deleteExpense);



 


module.exports = router;