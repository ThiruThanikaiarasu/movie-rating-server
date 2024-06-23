const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String, 
            required: [true, 'Title is mandatory field'],
            max: 25,
        },
        synopsis: {
            type: String, 
            required: [true, 'Synopsis is mandatory field'],
        },
        releasedDate: {
            type: Date,
            required: [true, 'Released Date is mandatory field'],
        },
        releaseYear: {
            type: String, 
            required: [true, 'Release is mandatory field'],
            validate: {
                validator: function(v) {
                    return /^\d{4}$/.test(v);
                },
                message: props => `${props.value} is not a valid 4-digit year!`
            }
        },
        rating: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d(\.\d)?$|^10(\.0)?$/.test(v);
                },
                message: props => `${props.value} is not a valid rating! Rating should be a number from 0 to 10 with up to one decimal place.`
            }
        },
        poster: {
            type: String, 
            required: [true, 'Poster is mandatory field'],
        },
        trailer: {
            type: String, 
        },
        genre: {
            type: [String], 
            enum: ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"]
        },
        director: {
            type: String,
            required: [true, 'Poster is mandatory field'],
        },
        cast: {
            type: [String],
            required: [true, 'Poster is mandatory field'],
        },
    }, 
    {
        timestamps: true,
    }, 
    {
        collection: 'movies'
    }
)

module.exports = mongoose.model.movies || mongoose.model('movies', movieSchema)
