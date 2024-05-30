const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const res = require("express/lib/response");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find()
        .sort({ name: 1 })
        .exec();

    res.render('genres_list', {
        title: "All Genres",
        genres: allGenres
    });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
    // Get details of genre by name and all associated books
    const genre = await Genre.findOne({ name: req.params.id }).exec();

    // No results
    if (genre === null) {
        const err = new Error("Genre not found");
        err.status = 400;
        return next(err);
    }

    const booksInGenre = await Book.find({ genre: genre._id }, "title summary").exec();

    res.render('genre_detail', {
        title: "Genre Detail",
        genre: genre,
        genre_books: booksInGenre
    });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre create GET");
});

// Handle Genre create on POST.
exports.genre_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre create POST");
});

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update POST");
});
