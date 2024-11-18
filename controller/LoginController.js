const EventEmitter = require('events');
const User = require('../models').User;
const SubUser = require('../models').SubUser;
const Vercode = require('../models').Vercode;
const Subscription = require('../models').Subscription;
var uniqid = require('uniqid');
var bcrypt = require('bcrypt-nodejs');

class LoginController extends EventEmitter{

	static userLogin(req,res,next){
	  	  let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        
	    if(!myReq.password || !myReq.email){
	        res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({status:25,message:'error'}));
	    }

	    try { 
          User.findOne({
          	where:{email:myReq.email}
          }).then(user=>{
              if(user){
                  try{
                     if(bcrypt.compareSync(myReq.password,user.password)){
                         res.setHeader('Content-Type', 'application/json');
                         res.send(JSON.stringify({status:20,result:{
                         	name:user.name,
                         	apikey: user.apikey,
                         	email: user.email
                         }}));
                     }else{
                     	res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({status:22,message:'Invalid password'}));
                     }  
                  }
                  catch(e){
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify({status:22,message:'Invalid password hashing'}));
                  }
                 
              }else{
              	  SubUser.findOne({
                  	where:{email:myReq.email}
                  }).then(subuser=>{
                      if(subuser){
                         try{
                             if(bcrypt.compareSync(myReq.password,subuser.password)){
                                 res.setHeader('Content-Type', 'application/json');
                                 res.send(JSON.stringify({status:20,result:{
                                 	name:subuser.name,
                                 	apikey: subuser.apikey,
                                 	email: subuser.email
                                 }}));
                             }else{
                             	res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({status:22,message:'Invalid password'}));
                             }
                         }
                        catch(e){
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:22,message:'Invalid password hashing'}));
                        }
                      }else{
                      	res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({status:22,message:'Invalid username'}));
                      }
                  });
              }
          });  
         }
         catch(error){
     	    res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({status:25,message:'error'}));
         } 
	  }



	  static subUserLogin(reg,res,next){
              
	  }


}

module.exports = LoginController;
