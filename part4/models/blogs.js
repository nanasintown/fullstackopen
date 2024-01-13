const mongoose = require('mongoose');
const { MONGODB_URI } = require('../utils/config');
const { error, info } = require('../utils/logger');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((err) => {
    error('Error connecting: ', err.message);
  });

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
  },
  author: {
    type: String,
    minLength: 3,
  },
  url: {
    type: String,
    validate: {
      validator: function (v) {
        return /^http:\/\/|^https:\/\//.test(v);
      },
      message: (p) => `${p.value} is not a valid url!`,
    },
    required: [true, 'url reuqired'],
  },
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;

    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
