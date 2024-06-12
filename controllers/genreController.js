const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const {all} = require("express/lib/application");

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
    const genre = await Genre.findById(req.params.id).exec();

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
exports.genre_create_get = (req, res, next) => {
    res.render('genre_form', { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
    // Validate and sanitize the name field
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3, max: 30 })
        .escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {

        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const genre = new Genre({ name: req.body.name});

        if(!errors.isEmpty()) {
            res.render('genre_form', {
                title: "Create Genre",
                genre: genre,
                errors: errory.array(),
            });
            return;
        } else {
            // Data from form is valid
            // Check if Genre with the same name already exists
            const genreExists = await Genre.findOne({ name: req.body.name })
                .collation({ locale: "en", strength: 2 })
                .exec();

            if (genreExists) {
                // Genre exists, redirect to its detail page
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                // New genre saved, redirect to genre detail page
                res.redirect(genre.url);
            }
        }

    })
]

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of Genre and all their books
    const [genre, allBooksByGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec()
    ]);

    if (genre === null) {
        res.redirect('catalog/genres');
    }

    res.render('genre_delete', {
        title: "Delete Genre",
        genre: genre,
        genre_books: allBooksByGenre
    })
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    const [genre, allBooksByGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, 'title summary').exec()
    ])

    if (allBooksByGenre.length > 0) {
        // Genre has Books
        res.render('genre_delete', {
            title: 'Genre delete',
            genre: genre,
            genre_books: allBooksByGenre,
        });
        return;
    } else {
        await Genre.findByIdAndDelete(req.body.genreid);
        res.redirect('/catalog/genres');
    }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findById(req.params.id).exec();

    res.render('genre_form', {
        title: "Update Genre",
        genre: genre
    })
});

// Handle Genre update on POST.
exports.genre_update_post = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Update Genre",
                genre: genre,
                errors: errors.array(),
            })
            return;
        } else {
            const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
            res.redirect(updatedGenre.url);
        }
    })
];
