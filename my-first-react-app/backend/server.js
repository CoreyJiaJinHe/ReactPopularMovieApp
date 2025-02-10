const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');
const searchModel = require('./models/searchTerm')

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.options('*', cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })


app.put('/api/updateMovie', cors(), async (req, res) => {
    //console.log("Who is this")
    //console.log(req);
    try {
        const query = req.body.data.query;
        //console.log(query);
        const movieData = req.body.data.queryResult
        //console.log(movieData)

        updateSearchCount(query, movieData);
        res.status(200).json({ message: "Success", status: 200 });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed to update count' });
    }
})


app.get("/api/getTrendingMovies", async(req, res) => {
    console.log("I was called")
    try {
        const movies = await getTrendingMovies();
        //console.log(movies);
        res.status(200).json({movies})
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve ToDos' });
    }
})

const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await searchModel.find({ queryText: `${searchTerm}` });
        //console.log(result);
        if (result.length > 0) {
            const doc = result[0];
            const oldCount = doc.count
            //console.log(oldCount);
            //console.log(doc.id);
            const newResult = await searchModel.findByIdAndUpdate(doc.id, { count: oldCount + 1 });
            //console.log(newResult)
            console.log("Successfully updated query count");
        }
        else {
            const newResult = new searchModel({
                queryText: searchTerm,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                movie_id: movie.id
            })
            newResult.save();
            console.log('Saved query to MongoDB');
        }
    }
    catch (error) {
        console.log(error);
    }
}


const getTrendingMovies = async () => {
    try {
        const result = await searchModel.find({}).sort({count:-1}).limit(5)
        return result;
    }
    catch (error) {
        console.log(error);
    }

}

app.listen(port, () => {
    console.log("Listening");
})

//Steps to starting a new node.js
//Initialize new folder
//npm init
//npm install express, mongoose, cors, dotenv, nodemon, body-parser