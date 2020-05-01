'use strict';
const { modelSchema } = require('../models/model.js');
const auth = require('../middleware/auth.js');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
  if (req.body.username && !req._id) {
    let user = await modelSchema.create(req.body);

    res.status(200);
    let token = user.timerToken();
    res.send({ user, token });

    return;
  } else {
    next({ err: 401, msg: 'The user exists' });
  }
});
router.post('/signin', auth, async (req, res, next) => {
  console.log('sighnin', req.user);
  if (req.user) {
    console.log(process.env.SECRET);
    let token = await req.user.timerToken();
    res.status(200);
    res.send({ user: req.user, token: token });
    return;
  } else {
    next({ err: 401, msg: 'user not found' });
  }
});
router.get('/hidden', auth, async (req, res, next) => {
  if (req.user) {
    res.status(200);
    res.send('AUTHORIZED USERS ONLY');
  } else {
    next({ err: 401, msg: 'NO, AN AUTHORIZED USER.' });
  }
});

module.exports = router;
