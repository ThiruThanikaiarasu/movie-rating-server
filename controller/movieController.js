const moment = require("moment")
const movieModel = require("../models/movieModel")

const addANewMovie = async (request, response) => {
    const { title, synopsis, releasedDate, rating, poster, genre, director, cast } = request.body
    const trailer = request.body.trailer || null

    try {
        const releaseYear = moment(releasedDate).year()

        const existingMovie = await movieModel.findOne({ title: title, releaseYear: releaseYear })
        if (existingMovie) {
            return response.status(409).send({ message: 'Movie with the same title and release year already exists' })
        }

        const newMovie = new movieModel({
            title, 
            synopsis,
            releasedDate,
            releaseYear,
            rating, 
            poster, 
            genre, 
            director, 
            cast
        })

        if (trailer) {
            newMovie.trailer = trailer
        }

        await newMovie.save()

        response.status(201).send({ message: 'Movie Created' })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const updateAMovie = async (request, response) => {
    const { id } = request.body
    const userDetail = request.body
    try {
        const movie = await movieModel.findById({_id:id})
        if (!movie) {
            return res.status(404).send({ message: 'Movie not found' })
        }

        // Update the fields if they are provided
        Object.keys(userDetail).forEach(detail => {
            if (userDetail[detail] !== undefined && detail !== 'cast' && detail !== 'genre') {
                if (detail === 'releaseDate') {
                    movie[detail] = userDetail[detail]
                    movie.releaseYear = new Date(userDetail[detail]).getFullYear().toString() // Ensure releaseYear is updated
                } else {
                    movie[detail] = userDetail[detail]
                }
            }
        })

        if (userDetail.cast) {
            movie.cast = userDetail.cast
        }

        if (userDetail.genre) {
            movie.genre = userDetail.genre
        }

        await movie.save()

        response.status(200).send({ message: 'Movie updated successfully' })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const deleteAMovie = async (request, response) => {
    const { id } = request.body
    try{

        const movie = await movieModel.findByIdAndDelete({ _id: id })

        if(!movie) {
            return response.status(404).send({ message: 'Movie not found'})
        }

        response.status(200).send({ message: 'Movie deleted Successfully'})

    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const searchMovie = async (request, response) => {
    const genre = request.query.genre || null
    const title = request.query.title || null
    const director = request.query.director || null

    try{
        let query = {}
        if(genre) {
            query.genre = { $regex: genre, $options: 'i' }
        }
        

        if(title) {
            query.title = { $regex: title, $options: 'i' }
        }

        if(director) {
            query.director = { $regex: director, $options: 'i' }
        }

        console.log(query)

        const filteredMovie = await movieModel.find(query);

        response.status(200).send({ data: filteredMovie, message: 'Filtered results'})

    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const getAllMovies = async (request, response) => {

    try{

        const allMovies = await movieModel.find()

        response.status(200).send({ data: allMovies, message: 'All Movie fetched'})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const searchByKeyWord = async (request, response) => {
    const {keyword} = request.params
    console.log(keyword)
    try{

        let query = {}

        const filteredMovies = await movieModel.find({
            $or: [
                { title: { $regex: `.*${keyword}.*`, $options: 'i' } },
                { synopsis: { $regex: `.*${keyword}.*`, $options: 'i' } }, 
                { genre: { $regex: `.*${keyword}.*`, $options: 'i' } } 
            ]
        });

        response.status(200).send({ data: filteredMovies, message: 'Filtered movies'})
        
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}


module.exports = {
    addANewMovie,
    updateAMovie,
    deleteAMovie,
    searchMovie,
    getAllMovies,
    searchByKeyWord,
}