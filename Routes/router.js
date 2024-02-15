const express = require('express')
const userController = require('../Controllers/userController')
const recipeController = require('../Controllers/recipeController')
const jwtMiddleware = require('../Middleware/jwtMiddleware')
const multerConfig = require('../Middleware/multerMiddleware')

const router = new express.Router()


//register api
router.post('/register',userController.register)

//Login api
router.post('/login',userController.login)

//add-recipe
router.post('/add-recipe',jwtMiddleware,multerConfig.single('itemPic'),recipeController.addRecipe)

//explore
router.get('/get-explore-data', recipeController.getExploreDatas);


//spesific user
router.get('/get-user-data',jwtMiddleware,recipeController.getUserDatas)

// Logged user details
router.get('/get-user-details',jwtMiddleware,userController.details)

//handling likes
// router.put('/update-like', jwtMiddleware, recipeController.updateLike);

//puting comments
router.put('/update-comments', jwtMiddleware, recipeController.updateComments);

//getting comments
// router.post('/gettingCommentsBack', recipeController.gettingCommentsBack);

//search on item name
router.post('/getbyname',recipeController.gettingItemOnName)

//search on user name
router.post('/getonUser',recipeController.gettingItemOnUser)

//editingDescription
router.put('/updateDesc',recipeController.editingDesc)


//setting saved post of user
router.put('/updateSaved', jwtMiddleware, userController.savedItems);

//getting saved post of user
router.get('/savedDatas', jwtMiddleware, userController.gettingSaved);

//remove recipe post 
router.delete('/remove-post/:pid',jwtMiddleware,recipeController.removePosts);

// Remove recipe post
router.delete('/remove-saved-data/:pid', jwtMiddleware, userController.removeFromSaved);


module.exports = router