const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('login', async (req, res, next) => {
    try{
        //take users email and password and attempt to authenticate them
    } catch(error) {
        next(error);
    }
});

router.post('/register', async (req, res, next) => {
    try{
        //take users email, password, first name, last name and create new user in database
    } catch(error) {
        next(error);
    }
});

module.exports = router