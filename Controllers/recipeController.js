const recipes = require('../Models/recipeModel')
const users = require('../Models/userModel')

exports.addRecipe = async(req, res) => {
    console.log("Inside add recipe");
    const userId = req.payload;

    const { itemName, itemDesc, itemLike, itemComment } = req.body;
    // console.log(req.file);
    const itemPic = req.file.filename; // Access the entire file object

    console.log(`User id is: ${userId}`);
    console.log(itemName, itemDesc, itemPic, itemLike, itemComment);

    if (!itemPic) {
        return res.status(400).json({ error: 'File upload failed' });
    }
    else{
        try{
            const newRecipe = new recipes({
                itemName, 
                itemDesc, 
                itemPic, 
                itemLike, 
                itemComment, 
                userId
            })
            await newRecipe.save()
            res.status(200).json(newRecipe);
        }
        catch(err){
            res.status(401).json(err)
        }
        
    }
};

//geting all data for explore
exports.getExploreDatas = async (req,res)=>{
    try{
        const exploreData = await recipes.find()
        res.status(200).json(exploreData)
    }
    catch(err){
        res.status(401).json(err)
    }
}

//geting data for specific user
exports.getUserDatas = async (req,res)=>{
    const userId = req.payload
    try{
        const userData = await recipes.find({userId})
        res.status(200).json(userData)
    }
    catch(err){
        res.status(401).json(err)
    }
}


//update Likes

// exports.updateLike = async (req, res) => {
//     const { _id } = req.body;

//     try {
//         const updatedRecipe = await recipes.findByIdAndUpdate(
//             _id,
//             { $inc: { itemLike: 1 } }, // Increment the like count
//             { new: true } // Return the updated document
//         );

//         if (!updatedRecipe) {
//             return res.status(404).json({ error: 'Recipe not found' });
//         }

//         res.status(200).json(updatedRecipe);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

//update Comments

exports.updateComments = async (req, res) => {
    try {
        const { _id, singleComments } = req.body;

        const recipe = await recipes.findById(_id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }


        recipe.itemComment.push(singleComments);

        const updatedRecipe = await recipe.save();

        res.status(200).json(updatedRecipe);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//getting comments back
// exports.gettingCommentsBack = async (req, res) => {
//     try {
//       const { _id } = req.body; 
//       const gettingBackComments = await recipes.findById(_id);
//       res.status(200).json(gettingBackComments);
//     } catch (err) {
//       res.status(401).json(err);
//     }
//   };

//getting items on itemname

exports.gettingItemOnName = async (req, res) => {
    try {
        const itemName = req.body.itemName;
        const itemsAre = await recipes.find({ itemName });
        
        if (itemsAre && itemsAre.length > 0 ) {
            console.log(itemsAre);
            res.status(200).json(itemsAre);
        } else {
            res.status(406).json("Item does not exist");
        }
    } catch (err) {
        res.status(401).json(err);
    }
};


//getting items on username
exports.gettingItemOnUser = async (req, res) => {
    try {
      const username = req.body.userName;
      const user = await users.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userId = user._id;
      const items = await recipes.find({ userId });
      res.status(200).json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


exports.editingDesc = async (req, res)=>{
    try{
        const {_id,toDisplay} = req.body
        const recipe = await recipes.findById(_id); 

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        recipe.itemDesc = toDisplay
        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    }
    catch(err){
        res.status(401).json(err); 
    }
}


//remove recipePost
exports.removePosts = async (req,res) =>{
    const {pid} = req.params
    try{
        const recipesData = await recipes.findByIdAndDelete({_id:pid})
        res.status(200).json(recipesData)
    }
    catch(err){
        res.status(401).json(err)
    }
}