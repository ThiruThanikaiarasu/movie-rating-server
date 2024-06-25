const moment = require("moment")
const movieModel = require("../models/movieModel")
const { response } = require("express")

const addANewMovie = async (request, response) => {
    const { title, synopsis, releasedDate, rating, poster, genre, director, cast } = request.body
    const trailer = request.body.trailer || null
    const {filename} = request.file

    try {
        const releaseYear = moment(releasedDate).year()

        const existingMovie = await movieModel.findOne({ title: title, releaseYear: releaseYear })
        if (existingMovie) {
            return response.status(409).send({ message: 'Movie with the same title and release year already exists' })
        }

        const image = 'public/images/' + filename

        const newMovie = new movieModel({
            title, 
            synopsis,
            releasedDate,
            releaseYear,
            rating, 
            poster: image, 
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
    console.log(request.body)
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

        const pipeline = [
            { $match: query },
            {
                $addFields: {
                    poster: {
                        $concat: [
                            'http://localhost:3500/api/v1/',
                            '$poster' 
                        ]
                    }
                }
            }
        ]

        const filteredMovie = await movieModel.aggregate(pipeline)

        response.status(200).send({ data: filteredMovie, message: 'Filtered results'})

    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const getAllMovies = async (request, response) => {
    try{

        const pipeline = [
            {
                $addFields: {
                    poster: {
                        $concat: [
                            'http://localhost:3500/api/v1/',
                            '$poster' 
                        ]
                    }
                }
            }
        ]

        const allMovies = await movieModel.aggregate(pipeline)

        response.status(200).send({ data: allMovies, message: 'All Movie fetched'})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const searchByKeyWord = async (request, response) => {
    const {keyword} = request.params
    try{
        const query = {
            $or: [
                { title: { $regex: `.*${keyword}.*`, $options: 'i' } },
                { synopsis: { $regex: `.*${keyword}.*`, $options: 'i' } },
                { genre: { $regex: `.*${keyword}.*`, $options: 'i' } }
            ]
        }

        const pipeline = [
            { $match: query }, 
            {
                $addFields: {
                    poster: {
                        $concat: [
                            'http://localhost:3500/api/v1/', 
                            '$poster'
                        ]
                    }
                }
            }
        ]

        const filteredMovies = await movieModel.aggregate(pipeline)

        response.status(200).send({ data: filteredMovies, message: 'Filtered movies'})
        
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const getRandomMovies = (movies, count) => {
    const shuffled = movies.sort(() => 0.5 - Math.random()) 
    return shuffled.slice(0, count) 
}

const getARandomMovie = async (request, response) => {
    
    try {
        const baseUrl = 'http://localhost:3500/api/v1/'
        const pipeline = [
            {
                $addFields: {
                    poster: {
                        $concat: [
                            baseUrl,
                            '$poster' 
                        ]
                    }
                }
            }
        ]
        const allMovies = await movieModel.aggregate(pipeline)
        const randomMovies = await getRandomMovies(allMovies, 8) 

        response.status(200).send({ data: randomMovies, message: 'Random movies fetched successfully' })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const getAListOfTopRatingMovies = async (request, response) => {
    try {
        console.log("first")
        const baseUrl = 'http://localhost:3500/api/v1/'
        const pipeline = [
            {
                $addFields: {
                    poster: {
                        $concat: [
                            baseUrl,
                            '$poster'
                        ]
                    }
                }
            },
            {
                $sort: { rating: -1 } 
            },
            {
                $limit: 8 
            }
        ]

        
        const topRatedMovies = await movieModel.aggregate(pipeline)
        console.log(topRatedMovies)

        response.status(200).send({ data: topRatedMovies, message: 'Top rated movies fetched successfully' })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const getAListOfLatestMovies = async (request, response) => {
    try {
        console.log("first1")
        const baseUrl = 'http://localhost:3500/api/v1/'

        const pipeline = [
            {
                $addFields: {
                    poster: {
                        $concat: [
                            baseUrl,
                            '$poster'
                        ]
                    }
                }
            },
            {
                $sort: { releasedDate: -1 } 
            },
            {
                $limit: 8 
            }
        ]

        
        const latestMovies = await movieModel.aggregate(pipeline)
        console.log(latestMovies)

        response.status(200).send({ data: latestMovies, message: 'Latest movies fetched successfully' })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const getSuggestionForSearch = async (request, response) => {
    const {suggestion} = request.params
    console.log(suggestion)
    try{
        const regex = new RegExp(`^${suggestion}`, 'i'); 
        const filter = {
                title: { $regex: regex }
        };
        console.log(filter)

        const suggestions = await movieModel.find(filter).limit(5).select('id title');
        console.log(suggestions)
       
        response.status(200).send({ data: suggestions, message: 'Search Suggestion'})

    }
    catch(error) {
        response.status(500).send({message: error.message})
    }
}

module.exports = {
    addANewMovie,
    updateAMovie,
    deleteAMovie,
    searchMovie,
    getAllMovies,
    searchByKeyWord,
    getARandomMovie,
    getAListOfTopRatingMovies,
    getAListOfLatestMovies,
    getSuggestionForSearch
}