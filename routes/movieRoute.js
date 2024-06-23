const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { addANewMovie, updateAMovie, deleteAMovie, searchMovie } = require('../controller/movieController')
const { verifyUser, verifyAdmin } = require('../middleware/verify')

router.post(
    '/add',

    check('title')
        .notEmpty()
        .withMessage('Title is a mandatory field')
        .isLength({ max: 25 })
        .withMessage('Title can be at most 25 characters long'),
    check('synopsis')
        .notEmpty()
        .withMessage('Synopsis is a mandatory field'),
    check('releasedDate')
        .notEmpty()
        .withMessage('Released Date is a mandatory field')
        .isISO8601()
        .withMessage('Released Date must be a valid date'),
    check('releaseYear')
        .notEmpty()
        .withMessage('Release year is a mandatory field')
        .matches(/^\d{4}$/)
        .withMessage('Release year must be a valid 4-digit year'),
    check('rating')
        .optional()
        .matches(/^\d(\.\d)?$|^10(\.0)?$/)
        .withMessage('Rating should be a number from 0 to 10 with up to one decimal place'),
    check('poster')
        .notEmpty()
        .withMessage('Poster is a mandatory field'),
    check('trailer')
        .isURL()
        .withMessage('Trailer must be a valid URL'),
    check('genre')
        .isIn(["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"])
        .withMessage('Genre must be one of the predefined values'),
    check('director')
        .notEmpty()
        .withMessage('Director is a mandatory field'),
        check('cast')
        .isArray({ min: 1 })
        .withMessage('Cast is a mandatory field and must be a non-empty array'),
    check('cast.*')
        .isString()
        .notEmpty()
        .withMessage('Each cast member must be a non-empty string'),

    verifyUser,
    verifyAdmin,

    addANewMovie
)

router.post(
    '/edit',

    verifyUser,
    verifyAdmin,

    updateAMovie
)

router.delete(
    '/',

    verifyUser,
    verifyAdmin,

    deleteAMovie
)


module.exports = router