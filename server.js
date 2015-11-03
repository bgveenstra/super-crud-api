// require express and other modules
var express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    swagger = require('swagger-express');

// configure cors (for allowing cross-origin requests)
app.use(cors());

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to ejs
app.set('view engine', 'ejs');

// Initialize Swagger global API configuration.
// NOTE this is only swagger 1.2 whereas swagger 2.0 has great improvements but is more challenging to implement.
app.use(swagger.init(app, {
  apiVersion: '0.1a',
  swaggerVersion: '1.2',
  swaggerURL: '/docs',
  swaggerJSON: '/api-docs.json',
  swaggerUI: './public/swagger/',
  basePath: 'http://localhost:3000',
  info: {
    title: 'crud-api',
    description: 'RESTful API built with Node, Express, and Mongo.'
  },
  apis: ['./server.js'],
  middleware: function(req, res) {}
}));


// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/crud-api'
);

// require models and seed data
var Book = require('./models/book'),
    Wine = require('./models/wine'),
    seedBooks = require('./seeds/books'),
    seedWines = require('./seeds/wines');


/**
 * @swagger
 * resourcePath: /books
 * description: Books we've got in our library.
 */

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: List all books available in our library.
 *      responseClass: Book
 *      nickname: getBooks
 */
app.get('/books', function (req, res) {
  // find all books in db
  Book.find(function (err, books) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(books);
    }
  });
});

/**
 * @swagger
 * models:
 *   Book:
 *     _id: String
 *     title: String
 *     author: String
 *     image: String
 *     __v: Integer
 */

// create new book
app.post('/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new Book(req.body);

  // save new book in db
  newBook.save(function (err, savedBook) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(savedBook);
    }
  });
});

// get one book
app.get('/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  var bookId = req.params.id;

  // find book in db by id
  Book.findOne({ _id: bookId }, function (err, foundBook) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(foundBook);
    }
  });
});

// update book
app.put('/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  var bookId = req.params.id;

  // find book in db by id
  Book.findOne({ _id: bookId }, function (err, foundBook) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      // update the books's attributes
      foundBook.title = req.body.title;
      foundBook.author = req.body.author;
      foundBook.image = req.body.image;
      foundBook.releaseDate = req.body.releaseDate;

      // save updated book in db
      foundBook.save(function (err, savedBook) {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json(savedBook);
        }
      });
    }
  });
});

// delete book
app.delete('/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  var bookId = req.params.id;

  // find book in db by id and remove
  Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(deletedBook);
    }
  });
});

// get all wines
app.get('/wines', function (req, res) {
  // find all wines in db
  Wine.find(function (err, wines) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(wines);
    }
  });
});

// create new wine
app.post('/wines', function (req, res) {
  // create new wine with form data (`req.body`)
  var newWine = new Wine(req.body);

  // save new book in db
  newWine.save(function (err, savedWine) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(savedWine);
    }
  });
});

// get one wine
app.get('/wines/:id', function (req, res) {
  // get wine id from url params (`req.params`)
  var wineId = req.params.id;

  // find wine in db by id
  Wine.findOne({ _id: wineId }, function (err, foundWine) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(foundWine);
    }
  });
});

// update wine
app.put('/wines/:id', function (req, res) {
  // get wine id from url params (`req.params`)
  var wineId = req.params.id;

  // find wine in db by id
  Wine.findOne({ _id: wineId }, function (err, foundWine) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      // update the books's attributes
      foundWine.name = req.body.name;
      foundWine.year = req.body.year;
      foundWine.country = req.body.country;
      foundWine.description = req.body.description;
      foundWine.image = req.body.image;
      foundWine.price = req.body.price;

      // save updated book in db
      foundWine.save(function (err, savedWine) {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json(savedWine);
        }
      });
    }
  });
});

// delete wine
app.delete('/wines/:id', function (req, res) {
  // get wine id from url params (`req.params`)
  var wineId = req.params.id;

  // find wine in db by id and remove
  Wine.findOneAndRemove({ _id: wineId }, function (err, deletedWine) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(deletedWine);
    }
  });
});


// HOME & RESET ROUTES

app.get('/', function (req, res) {
  res.render('site/index');
});

app.get('/reset', function (req, res) {
  res.render('site/reset');
});

app.post('/reset', function (req, res) {
  Book.remove({}, function (err, removedBooks) {
    Book.create(seedBooks, function (err, createdBooks) {
      Wine.remove({}, function (err, removedWines) {
        Wine.create(seedWines, function (err, createdWines) {
          if (req.params.format === 'json') {
            res.json(createdBooks.concat(createdWines));
          } else {
            res.redirect('/');
          }
        });
      });
    });
  });
});


// listen on port (production or localhost)
app.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});
