const mongoose = require("mongoose")

const recipeSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    itemDesc:{
        type:String,
        required:true
    },
    itemPic:{
        type:String,
        required:true
    },
    itemLike:{
        type:Number
    },
    itemComment:{
        type:Array
    },
    userId:{
        type:String,
        required:true
    }

})

const recipes = mongoose.model("recipes",recipeSchema)

module.exports = recipes