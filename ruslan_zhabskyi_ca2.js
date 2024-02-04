//Student Name: Ruslan Zhabskyi
//Student ID: 20104105

//Part 1: Read (Find)
//Query 1. Shows Historical and Documentary Ukrainian movies after 2013
db.movies.find(
    {languages: "Ukrainian",
    countries: "Ukraine",
    year: {$gte: 2013},
    genres: { $in: ["Documentary", "History"]}
    },
    {_id: 0, title: 1, year: 1, genres: 1, "imdbRating": "$imdb.rating"}
).sort({year: -1}).pretty()

//Query 2. Lists top 10 worst rated movies for the last 10 years as per Tomatoes
db.movies.find({
    year: { $gte: 2013 },
    "tomatoes.viewer.rating": { $gte: 0, $lt: 2 },
    "tomatoes.viewer.numReviews": { $gt: 30 },
    "tomatoes.lastUpdated": { $gte: new ISODate("2013-01-01T00:00:00.000Z") }
},
{_id: 0, title: 1, "viewerRating": "$tomatoes.viewer.rating", "numReviews": "$tomatoes.viewer.numReviews"}
).sort({ "tomatoes.viewer.rating": 1 }).limit(10).pretty();

//Query 3. Counts movies with both English and Ukrainian language
db.movies.find({
    languages: {$all: ["English", "Ukrainian"]}}
).count()

//Query 4. Counts how many movies in their reviews have the word "voluptatem" (en: pleasure) or "odio" (en: hatred) since 2015

db.movies.find({
    comments: { $elemMatch:
        { text: /^.*(voluptatem|odio).*$/i, date: { $gte: new ISODate("2015-01-01T00:00:00.000Z") } }
    }}).count()

//Query 5. Shows the movies ranking for the year 1989: positions 10 to 20
db.movies.find(
    {
        year: { $eq: 1989 },
        type: "movie",
        "imdb.rating": { $gte: 7 },
        "imdb.votes": { $gt: 30 }
    },
    {_id: 0, title: 1, genres: 1, "imdbRating": "$imdb.rating"}
).sort({ "imdb.rating": -1 }, {"imdb.votes": -1}).skip(10).limit(10).pretty();

//Query 6. Finds all top rated short films
db.movies.find({
    type: "movie",
    runtime: { $lte: 40 },
    "tomatoes.critic.rating": { $gte: 9 }},
    {_id: 0, title: 1, year: 1, awards: 1, languages: 1, countries: 1}
).sort({ "tomatoes.critic.rating": -1 }).pretty();

//Part 2: Create (Insert)
//Query 1. Adds two movies that were released between 2017 and 2023

db.movies.insertMany([
    {
        _id: 1,
        title: "Pamfir",
        year: 2022,
        runtime: 207,
        cast: [
            "Oleksandr Yatsentyuk",
            "Stanislav Potiak",
            "Solomiia Kyrylova",
            "Olena Khokhlatkina",
            "Miroslav Makoviychuk",
            "Ivan Sharan",
            "Oleksandr Yarema"
        ],
        plot: "Pamfir wants to be a decent family man, but challenging circumstances force him to give up honest breadwinning to help his family.",
        genres: ["Action", "Drama", "Thriller"],
        imdb: { rating: 7.5, votes: 2800 }
    },
    {
        _id: 2,
        title: "We Will Not Fade Away",
        year: 2023,
        runtime: 200,
        cast: [
            "Valery Kalmykov",
            "Yana Kalmykova",
            "Alex Kobelev",
            "Alisa Kovalenko"
        ],
        plot: "For five teenagers living in the conflict-ridden Donbas region of Ukraine, a Himalayan expedition provides a brief escape from reality. A portrait of a generation that, in spite of everything, is able to recognize and celebrate the fragile beauty of life.",
        genres: ["Documentary"],
        imdb: { rating: 7.4, votes: 105 }
    }
])

//Query 2. Creates a users collection with three user documents
db.users.insertMany([
    {_id: 1,
    name: "John Doe",
    DOB: new Date("1993-12-26"),
    gender: "male",
    location: "New York",
    favourites: [1, 2, ObjectId("573a13adf29313caabd2a9b0")],
    email: "john@doe.com",
    scores: [{platform: "imdb", movieId: 1, rating: 9, date: new Date("2023-10-23")}, {platform: "tomatoes", movieId: 2, rating: 8, date: new Date("2023-11-20")}],
    favouriteGenres: ["Comedy", "Drama", "Documentary"],
    password: "secret"
    },
    {_id: 2,
    name: "Lucie Kennedy",
    DOB: new Date("2000-12-26"),
    gender: "female",
    location: "Dublin",
    favourites: [1, ObjectId("573a13fbf29313caabdee374")],
    email: "luciekennedy@fakeemail.com",
    scores: [{platform: "imdb", movieId: 1, rating: 7, date: new Date("2022-12-29")}, {platform: "tomatoes", movieId: 2, rating: 8, date: new Date("2023-12-17")}],
    favouriteGenres: ["Comedy", "Drama", "Documentary"],
    password: "secret" }
])

//Part 3: Update, delete
//Query 1. Updates the IMDB rating to a new value and increases the number of votes by 1
db.movies.updateOne(
    {_id: 1},
    {$set: {"imdb.rating": 7.6, "imdb.votes": 2801}}
)

//Query 2. Adds a new favourite to the array in one of newly created user documents
db.users.updateOne(
    {_id: 2},
    {$push: {"favourites": ObjectId("573a13adf29313caabd2a9b0")}}
)

//Query 3. Additional query of choice: updates the user document with upsert

db.users.updateOne(
    {_id: 1},
    {$set:
    {_id: 1,
        name: "Ruslan Zhabskyi",
        DOB: new Date("1989-01-08"),
        gender: "male",
        location: "Dublin",
        favourites: [1, 2],
        email: "ruslanzhabskyi@fakeemail.com",
        scores: [{platform: "imdb", movieId: 1, rating: 9, date: new Date("2023-10-23")}, {platform: "tomatoes", movieId: 2, rating: 9, date: new Date("2023-11-20")},
        {platform: "tomatoes", movieId: ObjectId("573a13adf29313caabd2a9b0"), rating: 7, date: new Date("2021-11-20")},
        {platform: "tomatoes", movieId: ObjectId("573a13fbf29313caabdee374"), rating: 6, date: new Date("2021-11-20")},
        {platform: "tomatoes", movieId: ObjectId("573a13acf29313caabd29366"), rating: 2, date: new Date("2021-11-20")}],
        favouriteGenres: ["Comedy", "Drama", "Documentary", "Fantasy"],
        password: "secret"
        }
    },
    {upsert: true}
)

//Query 4. Additional query of choice: updates the users documents with addToSet operator
db.users.updateMany(
    {_id: {$in: [1, 2]}},
    {$addToSet: {favourites: ObjectId("573a13fbf29313caabdee374")}}
)

//Query 5. Deletes a movie with ID 1
db.movies.deleteOne({_id: 1})

//Part 4: Aggregation
//Query 1. Aggregation pipeline: users age 20 to 35 top movie favourites per location

db.users.aggregate([
    {$unwind: "$favourites" },
    {$lookup: {from: "movies", localField: "favourites", foreignField: "_id", as: "favouriteMovie"}},
    {$match: {
            DOB: { $gte: new Date("1988-01-01"), $lt: new Date("2003-01-01") },
            "favouriteMovie.title": { $exists: true, $ne: null }}},
    {$project: {location: 1, "favouriteMovie.title": 1}},
    {$group: {_id: { location: "$location", title: "$favouriteMovie.title" }, count: { $sum: 1 }}},
    {$sort: { "_id.location": 1, count: -1 }}
]).pretty();


//Query 2. Aggregation pipeline: shows top 3 movies on tomato reviews and their average score
db.users.aggregate([
    {$unwind: "$scores"},
    {$match: {"scores.platform": "tomatoes"}},
    {$lookup: {from: "movies", localField: "scores.movieId", foreignField: "_id", as: "ratedMovies"}},
    {$group: {_id: "$ratedMovies.title", avgScore: {$avg: "$scores.rating"}}},
    {$project: {_id: 1, avgScore: 1, genres: 1}},
    {$sort: {avgScore: -1}},
    {$limit: 3}
]).pretty()
