'use strict';

const bcrypt = require('bcrypt');
const { modelSchema } = require('../models/model.js');

const base64Decoder = (stringValue) => {
  let data = {
    username: '',
    password: '',
  };
  let bufferString = Buffer.from(stringValue, 'base64').toString();
  let bufferSplit = bufferString.split(':');
  data.username = bufferSplit[0];
  data.password = bufferSplit[1];
  console.log('data of data', data);
  return data;
};

const getUsersDataFromMongodb = async (usersData) => {
  let mongoUsersData = await modelSchema.readByQuery({
    username: usersData.username,
  });
  for (let i = 0; i < mongoUsersData.length; i++) {
    console.log('this mongousersdata', mongoUsersData);
    let isSame = mongoUsersData[i].comparePasswords(usersData.password);
    if (isSame) {
      return mongoUsersData[i];
    }
  }
  return usersData;
};

const auth = async (req, res, next) => {
  let authAuthor = req.headers.authorization.split(' ');

  if (authAuthor.length === 2) {
    if (authAuthor[0] === 'Basic') {
      let usersData = base64Decoder(authAuthor[1]);

      //find  user from usersData  my database.
      req.user = await getUsersDataFromMongodb(usersData);
      next();
      return;
    } else if (authAuthor[0] === 'Bearer') {
      let usersToken = ModelSchema.verifyToken(authAuthor[1]);

      if (usersToken && usersToken._id) {
        req.user = await modelSchema.read(usersToken._id);
      }

      next();
      return;
    }
  }
};

module.exports = auth;
