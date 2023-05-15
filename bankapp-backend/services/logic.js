//1 import db.js
const db=require('./db.js')
//6 import jwt token
const jwt=require('jsonwebtoken')
//2 logic for register-asynchronous fn-return a promise-handled by .then
const register=(acno,username,password)=>
{
console.log('Inside the register works');
//acno in db ?
//yes
   return db.User.findOne({
    // acno:acno - same name used,so specify only 1 acno
    acno
   }).then((response)=>{
   // console.log(response);
   if(response)
   {
    return{
        statusCode:401,
        message:'acno already registered'
    }
   }
   else{
    //create new obj for registration
    const newUser=new db.User({
        // like acno:acno - same name used,so specify only 1 acno
        acno,
        username,
        password,
        balance:2000,
        transaction:[]
    })
    //to save in db
    newUser.save()
    //to send response back to the client
    return{
        statusCode:200,
        message:'succesfully registered'
    }
   }
   })
}
//4 logic for login-asynchronous fn-return a promise-handled by .then
const login=(acno,password)=>{
 console.log("Inside the login function");
 return db.User.findOne({acno,password}).then((result)=>{
    if(result) //if acno present in db
    {
        //token generated 
           //sign(payload:obj,secret key:string)
        const token=jwt.sign({loginAcno:acno},'superkey2023')
        return{
            statusCode:200,
            message:'successfully logged in!',
            currentUser:result.username,
            token, //send to the client
            currentAcno:acno//send to the client
        }
    }
    else{//acno not present in db
        return {
            statusCode:401,
            message:'Invalid data'
        }
    }
 })
}
//5 logic for bal enquiry
const getBalance=(acno)=>{
//check acno in db
return db.User.findOne({acno}).then((result)=>{
    if(result)
    {
        return{
            statusCode:200,
            balance:result.balance
        }
    }
    else{
        return {
            statusCode:401,
            message:'Invalid data'
        }
    }
})
}
//7 fund transfer
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
   //convert amt into number
   let amount=parseInt(amt)
   //check fromAcno in mongodb
   return db.User.findOne({
    acno:fromAcno,
    password:fromAcnoPswd
   }).then((debitDetails)=>{
    if(debitDetails)
    {
      //to check toAcno 
      return db.User.findOne({acno:toAcno}).then((creditDetails)=>{
        if(creditDetails)
        {
          //check the balance > amount
          if(debitDetails.balance>amount)
          {
            debitDetails.balance-=amount;
            debitDetails.transaction.push({
              type:"Debit",
              amount,
              fromAcno,
              toAcno  
            })
            //save changes to the mongodb
            debitDetails.save()
            //update to the toAcno
            creditDetails.balance+=amount;
            creditDetails.transaction.push({
              type:"Credit",
              amount,
              fromAcno,
              toAcno   
            })
            //save to mongodb
            creditDetails.save()
            //send response to the client side
            return {
                statusCode:200,
                message:'fund transfer successfull'
            }
          }
          else{
            return {
                statusCode:401,
                message:'Insufficient balance'
            }
          }
        }
        else{
            return {
                statusCode:401,
                message:'Invalid data'
            }
        }
      })
    }
    else
    {
        return {
            statusCode:401,
            message:'Invalid data'
        } 
    }
   })
}
//8 getTransactionHistory
const getTransactionHistory=(acno)=>{
    //check acno
  return db.User.findOne({acno}).then((result)=>{
   if(result)
   {
    return{
        statusCode:200,
        transaction:result.transaction
    }
   }
   else{
    return {
        statusCode:401,
        message:'Account doesnot exist'
    } 
   }
  })
}
//9 deleteUserAccount
const deleteUserAccount=(acno)=>{
    //delete acno from mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return {
            statusCode:200,
            message:'Account deleted successfully'
        }
    })
}
//3 export
module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    getTransactionHistory,
    deleteUserAccount
}