const users = require('../Models/userModel')
const recipes = require('../Models/recipeModel')
const jwt = require('jsonwebtoken')

//register
exports.register = async (req,res)=>{
    console.log("inside Register API");
    const {username,email,password,itemSaved}=req.body
    // console.log(username,email,password,confirmpassword);

    try{
        const existingUsername = await users.findOne({username})
        const existingUserEmail = await users.findOne({email})
        console.log(existingUsername);
        if(existingUserEmail && existingUsername){
            res.status(406).json("already existing account... please login")   
        }
        else if(existingUsername){
            
            res.status(406).json("already existing username... please use another username for register")
        }
        else if(existingUserEmail){
            res.status(406).json("already existing email... please use another username for email")
        }
        
        else{
            console.log("new userr");
            const newUser = new users({
                username:username,
                email:email,
                password:password,
                itemSaved:itemSaved
            })
            await newUser.save()
            res.status(200).json(newUser )
        }

    }catch(err){
        res.status(401).json(err)
    }

   
}

//login
exports.login = async (req,res)=>{
    console.log("inside Login API");
    const {username,password}=req.body
    console.log(username,password);

    try {
        const existingUser = await users.findOne({ username });

        if (existingUser) {
            if (existingUser.password === password) {
                const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY);
                res.status(200).json({ token , existingUser});
            } else {
                res.status(406).json("Invalid Password");
            }
        } else {
            res.status(406).json("Invalid Username");
        }
    } catch (err) {
        res.status(401).json(err);
    }

   
}

//getting details
exports.details = async(req,res)=>{
    const userId = req.payload
    try {
        const userDetails = await users.findById(userId);

        if (!userDetails) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(userDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
}

//sett saved items
exports.savedItems = async (req, res) => {
    const userId = req.payload; 
    const bookmarkedRecipes = req.body.bookmarkedRecipes;

    try {
        const existingUser = await users.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingSaved = existingUser.itemSaved.includes(bookmarkedRecipes)
        if(!existingSaved){
            existingUser.itemSaved.push(bookmarkedRecipes);

            const updatedUser = await existingUser.save(); 
    
            res.status(200).json(updatedUser);
        }
        else{
            res.status(404).json("already exist")
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//getting saved Recipes

exports.gettingSaved = async (req, res) => {
    const userId = req.payload;
    try {
      const usersSaved = await users.findById(userId);
  
      if (!usersSaved) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const savedArray = usersSaved.itemSaved;
  
      const savedDetails = await Promise.all(savedArray.map(async (itemId) => {
        const getFromRecipe = await recipes.findById(itemId);
        return getFromRecipe; 
      }));
   
      const filteredSavedDetails = savedDetails.filter(Boolean);
  
      res.status(200).json(filteredSavedDetails);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  //remove saved 
  exports.removeFromSaved = async (req, res) => {
    const { pid } = req.params;
    const userId = req.payload;

    try {
        const updatedUserData = await users.findOneAndUpdate(
            { _id: userId },
            { $pull: { itemSaved: pid } },
            { new: true } 
        );

        if (updatedUserData) {
            res.status(200).json(updatedUserData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};