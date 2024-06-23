const express = require('express')
const router = express.Router()

const {getFileByName} = require('../controller/imageController')

router.get(
    '/:filename',
    getFileByName
)

module.exports = router 