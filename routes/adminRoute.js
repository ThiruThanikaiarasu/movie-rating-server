const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { login } = require('../controller/authController')

router.post(
    '/login',

    check('email')
        .isEmail()
        .withMessage('Enter a valid Email address')
        .normalizeEmail(),
    check('password')
        .notEmpty()
        .isLength({min: 8})
        .withMessage('Password length is at least 8 character'),

    login
)

module.exports = router