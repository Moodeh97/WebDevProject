//Base routes page that direct
//Also handles login logic

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const Users = require('../models/Users');

router.get('/', bookController.homepage);
router.get('/book/:id', bookController.exploreBook );
router.get('/categories', bookController.exploreCategories);
router.get('/categories/:id', bookController.exploreCategoriesById);
router.post('/search', bookController.searchBook);
router.get('/explore-all', bookController.exploreLatest);
router.get('/explore-random', bookController.exploreRandom);
router.post('/submit-book', bookController.submitBookOnPost);
router.get('/sign-up', bookController.signup);
router.post('/sign-up', bookController.signupOnPost);

//The login page is only avaiable when you have not been logged in already
router.get('/log-in', function(req, res){
    if(!req.session.Users){{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('log-in', { title: 'Sign Up', infoErrorsObj, infoSubmitObj  } );
    }}
    res.status(500).send({message: "Already Logged in" });
})

//Login logic itself. Takes name and password and matches it against an 
//equivalent document within the mongo collection 'Users'
//Also deals with failed login attemps and returns errors if needed
router.post('/log-in', function(req,res)
{
 var name = req.body.name
 var password = req.body.password

 Users.findOne({name:name, password: password}, function(err, Users){
    if(err){
        req.flash('infoSubmit', 'Error')
        res.redirect("/log-in")
    }

    if(!Users){
        req.flash('infoSubmit', 'No Such User, Please Sign up')
        res.redirect("/log-in")
    }
    else{
        req.session.Users = Users
        req.flash('infoSubmit', 'Logged in.')
        res.redirect("/")}
 })
});

//Submit  page only available to those already logged in
router.get('/submit-book', function(req, res){
    if(!req.session.Users){{
        res.status(500).send({message: "Please Log In" });

    }}
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-book', { title: 'Submit Book', infoErrorsObj, infoSubmitObj  } );
})

//Module.exports allows other files that include this file to use the routes contained in this page 
module.exports = router;