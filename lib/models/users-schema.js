'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
  username: { type: 'string', unique: true, require: true },
  password: { type: 'string', require: true },
  firstname: { type: 'string' },
  lastname: { type: 'string' },
});

schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});
schema.methods.comparePasswords = async function (plainTextPass) {
  return await bcrypt.compare(plainTextPass, this.password);
};
schema.methods.timerToken = () => {
  let timeout = Math.floor(Date.now() / 1000) + 50;
  return jwt.sign(
    { exp: timeout, data: { _id: this._id } },
    process.env.SECRET
  );
};
schema.methods.verifyToken = (token) => {
  try {
    let compareToken = jwt.verify(token, process.env.SECRET);
    return compareToken.data;
  } catch (e) {
    console.log('WRONG TOKEN OR EXPIRED');
  }
};

const model = mongoose.model('users', schema);

module.exports = model;
