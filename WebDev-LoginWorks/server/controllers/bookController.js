require('../models/database');
const Category = require('../models/Category');
const Book = require('../models/Book');
const User = require('../models/Users');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Book.find({}).sort({_id: -1}).limit(limitNumber);
    const action = await Book.find({ 'category': 'Action' }).limit(limitNumber);
    const romance = await Book.find({ 'category': 'Romance' }).limit(limitNumber);
    const fiction = await Book.find({ 'category': 'Fiction' }).limit(limitNumber);

    const literary = { latest, action, romance, fiction };

    res.render('index', { title: 'Home', categories, literary } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Categories', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Book.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: '  - Categoreis', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /book/:id
 * Book 
*/
exports.exploreBook = async(req, res) => {
  try {
    let bookId = req.params.id;
    const book = await Book.findById(bookId);
    res.render('book', { title: '  - Book', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchBook = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let book = await Book.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: '  - Search', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-all
 * Explore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const book = await Book.find({}).sort({ _id: -1 });
    res.render('explore-all', { title: 'Explore All', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Book.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let book = await Book.findOne().skip(random).exec();
    res.render('explore-random', { title: '  - Explore Random', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

exports.signup = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('sign-up', { title: 'Sign', infoErrorsObj, infoSubmitObj  } );
}

exports.login = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('log-in', { title: 'Sign Up', infoErrorsObj, infoSubmitObj  } );
}

exports.signupOnPost = async(req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });

    await newUser.save();

    req.flash('infoSubmit', 'Profile has been created.')
    res.redirect('/sign-up');

  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }

}

/**
 * POST /submit-book
 * Submit Book
*/
exports.submitBookOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files were uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newBook = new Book({
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category,
      image: newImageName
    });
    
    await newBook.save();

    req.flash('infoSubmit', 'Book has been added.')
    res.redirect('/submit-book');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-book');
  }
}

