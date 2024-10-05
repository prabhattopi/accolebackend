const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { createItem, getItems, updateItem, deleteItem } = require('../controllers/itemController');
const router = express.Router();

router.route('/')
  .get(protect, getItems) // Get items, admin can see all, users only their own
  .post(protect, roleCheck(['admin', 'user']), createItem); // RBAC for item creation

router.route('/:id')
  .put(protect, roleCheck(['admin', 'user']), updateItem) // RBAC for item update
  .delete(protect, roleCheck(['admin', 'user']), deleteItem); // RBAC for item deletion

module.exports = router;
