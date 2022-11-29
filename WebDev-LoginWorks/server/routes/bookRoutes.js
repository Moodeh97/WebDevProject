const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const Users = require('../models/Users');
const session = require('express-session')

/**
 * App Routes 
*/
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

router.get('/log-in', function(req, res){
    if(!req.session.Users){{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('log-in', { title: 'Sign Up', infoErrorsObj, infoSubmitObj  } );
    }}

    console.log("No User Logged In")
    return res.status(401).send();
})

router.post('/log-in', function(req,res)
{
 var name = req.body.name
 var password = req.body.password
 console.log("name is " + name + "\nPassword is: " + password)

 Users.findOne({name:name, password: password}, function(err, Users){
    if(err){
        console.log(err)    
        req.flash('infoSubmit', 'Error')
        res.redirect("/log-in")
    }

    if(!Users){
        console.log(err)
        req.flash('infoSubmit', 'No Such User.')
        res.redirect("/log-in")
    }
    else{
        req.session.Users = Users
        req.flash('infoSubmit', 'Logged in.')
        res.redirect("/")}
 })
});

router.get('/submit-book', function(req, res){
    if(!req.session.Users){{
        console.log("No User Logged In")
        return res.status(401).send();
    }}
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-book', { title: 'Submit Book', infoErrorsObj, infoSubmitObj  } );
})

module.exports = router;