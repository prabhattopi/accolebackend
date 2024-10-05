const Item = require('../models/Item');

// Create new item
const createItem = async (req, res) => {
  const { name, img, quantity } = req.body;

  const item = await Item.create({
    name,
    img,
    quantity,
    createdBy: req.user._id, // Attach the item to the logged-in user
  });

  res.status(201).json(item);
};

// Get all items (can be restricted based on role)
const getItems = async (req, res) => {
  let items;
  if (req.user.role === 'admin') {
    items = await Item.find(); // Admin can fetch all items
  } else {
    items = await Item.find({ createdBy: req.user._id }); // User can fetch only their own items
  }
  res.json(items);
};

// Update item (users can only update their own items, admins can update any)
const updateItem = async (req, res) => {
  const { name, description, quantity,img } = req.body;
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Check if the logged-in user is either the creator or an admin
  if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this item' });
  }

  item.name = name || item.name;
  item.description = description || item.description;
  item.img = img || item.img;
  item.quantity = quantity || item.quantity;

  const updatedItem = await item.save();
  res.json(updatedItem);
};

// Delete item (users can only delete their own items, admins can delete any)
const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Check if the logged-in user is either the creator or an admin
  if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this item' });
  }

  await Item.findOneAndDelete(req.params.id);
  res.json({ message: 'Item removed' });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
