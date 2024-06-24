const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { login } = require('../controller/authController')
const { verifyUser, verifyAdmin } = require('../middleware/verify')
const { authenticateAdmin } = require('../controller/adminController')

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

router.get(
    '/authenticate',

    verifyUser,
    verifyAdmin,

    authenticateAdmin
)

module.exports = router