const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  password: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
});

// WildCard Indexing
//userSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Users', userSchema);