//1 Import express
const express = require("express");
//4 import cors
const cors = require("cors");
//8 import logic.js file
const logic=require('./services/logic')
//15 import jwttoken
const jwt=require('jsonwebtoken')
//2 create a server using express
const server = express()
//5 use cors in server app
server.use(cors({
    origin:"http://localhost:4200"   //backend to frontend connection
}))
//6 parse json data to the js in server app
server.use(express.json())
//7 to resolve client requests - eg: 5000 /
    // "/" : pathname
// server.get("/",(req,res)=>{
//     res.send('GET METHOD')
// })
// server.post("/",(req,res)=>{
//     res.send('POST METHOD')
// })
//3 Setup port for the server
server.listen(5000,()=>{
    console.log("listening on port 5000");
});
//12 application specific middleware
  const appMiddleware=(req,res,next)=>{
    next()
    console.log('application specific middleware');
  }
//13 use application specific middleware
server.use(appMiddleware)
//14 router specific middleware
   // middleware for verifying token to check user is loggined or not
const jwtMiddleware=(req,res,next)=>{
   //get token from req header
   const token=req.headers['token']; // token
   console.log(token);//token
   //verify the token
   try{
    const data=jwt.verify(token,'superkey2023') //token,secret key(from logic.js)
   console.log(data);
   req.currentAcno=data.loginAcno
   next()
   }
   catch{
     res.status(401).json({message:'Please login!!'})
   }
  console.log('router specific middleware');
  //use this jwtmiddleware in getbalance()
}

//bank requests
  //reg
  //login
  //bal enq
  //fund transfer

  //register api call...'/register' - here / indicates the localhost:5000 path
  server.post("/register",(req,res)=>{
  //9 call register method from logic
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
      res.status(result.statusCode).json(result)
      console.log(req.body);
    })
    //res.send('Register request received')
    //res.status(200).json({message:'Request received'})
  })
   //10 login api call..'/login' - here / indicates the localhost:5000 path
   server.post('/login',(req,res)=>{
    console.log("Inside the login api call");
    console.log(req.body);
    logic.login(req.body.acno,req.body.password).then((result)=>{
    res.status(result.statusCode).json(result)
    })
   })
   //11 api call for getbalance (of particular acno)
   server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
    res.status(result.statusCode).json(result)
    })
   })
   //16 fund transfer api call
   server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('inside the fund transfer');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
    res.status(result.statusCode).json(result)
    })
   })
   //17 api call for getTransactionHistory
   server.get('/getTransactionHistory',jwtMiddleware,(req,res)=>{
    console.log('inside getTransaction History');
    logic.getTransactionHistory(req.currentAcno).then((result)=>{
      res.status(result.statusCode).json(result)
    })
   })
   //18 delete account
   server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('inside delete account');
    logic.deleteUserAccount(req.currentAcno).then((result)=>{
      res.status(result.statusCode).json(result)
    })
  })