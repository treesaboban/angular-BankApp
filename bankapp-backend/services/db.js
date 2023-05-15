     //database connection with nodejs
//1 import (the installed) mongoose
const mongoose=require('mongoose');
//2 define a connection string b/w express and mongodb
mongoose.connect('mongodb://localhost:27017/BankServer') //link from mongodb(3 dots on top-left)
//3 create a model and schema for storing data into the db
   //model-User(singular form of the collection from the db and capitalize first letter)
   //schema -{} inside the curly braces
   //model(singular,capital letter first) in express is same as mongodb collection name(plural,small letter first)
const User=mongoose.model('User',
{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})
//4 export the collection
module.exports=
{
    User
}
