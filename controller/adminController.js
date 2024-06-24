const authenticateAdmin = (request, response) => {
    try{
        response.status(200).send({ message: 'Valid Admin User'})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    authenticateAdmin
}