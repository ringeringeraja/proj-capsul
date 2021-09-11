// eslint-disable-next-line
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

const options = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

export { mongoose, options };
