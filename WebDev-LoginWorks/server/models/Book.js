const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  author: {
    type: String,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['Action', 'Romance', 'Fiction', 'Mystery', 'Non-fiction'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

bookSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//bookSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Book', bookSchema);