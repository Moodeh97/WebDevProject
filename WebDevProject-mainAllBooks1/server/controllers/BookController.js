require('../models/database');
const Category = require('../models/Category');
const Book = require('../models/Book');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Book.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Book.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Book.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Book.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };

    res.render('index', { title: 'Home', categories, food } );
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
    res.render('categories', { title: 'Cooking Blog - Categoreis', categories } );
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
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /Book/:id
 * Book 
*/
exports.exploreBook = async(req, res) => {
  try {
    let BookId = req.params.id;
    const Book = await Book.findById(BookId);
    res.render('Book', { title: 'Cooking Blog - Book', Book } );
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
    let Book = await Book.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', Book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const Book = await Book.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', Book } );
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
    let Book = await Book.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', Book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-Book
 * Submit Book
*/
exports.submitBook = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-Book', { title: 'Submit Book', infoErrorsObj, infoSubmitObj  } );
}

exports.signup = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('sign-up', { title: 'Signup', infoErrorsObj, infoSubmitObj  } );
}

exports.login = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('log-in', { title: 'Login', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-Book
 * Submit Book
*/
exports.submitBookOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
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
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newBook.save();

    req.flash('infoSubmit', 'Book has been added.')
    res.redirect('/submit-Book');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-Book');
  }
}