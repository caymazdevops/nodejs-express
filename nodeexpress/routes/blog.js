// routes/blog.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Blog ekleme
router.post('/add', async (req, res) => {
  const { title, description, image } = req.body;

  try {
    const blog = new Blog({ title, description, image });
    await blog.save();
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Blog eklenirken hata oluştu.');
  }
});

module.exports = router;
