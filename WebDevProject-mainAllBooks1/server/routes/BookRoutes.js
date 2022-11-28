const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

/**
 * App Routes 
*/
router.get('/', BookController.homepage);
router.get('/Book/:id', BookController.exploreBook );
router.get('/categories', BookController.exploreCategories);
router.get('/categories/:id', BookController.exploreCategoriesById);
router.post('/search', BookController.searchBook);
router.get('/explore-latest', BookController.exploreLatest);
router.get('/explore-random', BookController.exploreRandom);
router.get('/submit-book', BookController.submitBook);
router.post('/submit-book', BookController.submitBookOnPost);
router.get('/sign-up', BookController.signup);
router.get('/log-in', BookController.login);


 
module.exports = router;