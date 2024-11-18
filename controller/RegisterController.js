const EventEmitter = require('events');
const User = require('../models').User;
const Vercode = require('../models').Vercode;
const Subscription = require('../models').Subscription;
const SubUser = require('../models').SubUser;
var uniqid = require('uniqid');
var bcrypt = require('bcrypt-nodejs');
var Mailer = require('../mailer/mailer');

class RegisterController extends EventEmitter{

	  static newUser(req,res,next){
            
            let myReq;
		      if(req.method == 'POST'){
		        myReq = req.fields;
		      }
		      else if(req.method == 'GET'){
		        myReq = req.query;
		      }
          try{
              var myapikey = uniqid();
    		      Vercode.findOne({
    		      	where:{email:myReq.email,code:myReq.code}
    		      }).then(vercode=>{
                      if(vercode){
                      	 User.findOne({
                      	 	where:{email:myReq.email}
                      	 }).then(user=>{
                            if(user){
                               res.setHeader('Content-Type', 'application/json');
                               res.send(JSON.stringify({status:22,message:'User already exist'}));
                            }else{
                               User.create({
                               	  name: myReq.name,
                               	  email: myReq.email,
                                  password:bcrypt.hashSync(myReq.password),
                                  apikey: myapikey
                               }).then(user=>{
                               	    var mydate = new Date();
    							    var year, month, day;
    						        year = String(mydate.getFullYear());
    						        month = String(mydate.getMonth() + 1);
    						        if (month.length == 1) {
    						            month = "0" + month;
    						        }
    						        day = String(mydate.getDate());
    						        if (day.length == 1) {
    						            day = "0" + day;
    						        }

    						         var date = year + "-" + month + "-" + day;
        							   Subscription.create({
        							   	 userId:user.id,
        							   	 startdate: date,
        							   	 enddate: date
        							   }).then(()=>{
        							   	  res.setHeader('Content-Type', 'application/json');
                                          res.send(JSON.stringify({status:20,message:'Registration successfull',apikey:myapikey}));
    							     }); 
                                   
                               }).catch(error=>{
                                   res.setHeader('Content-Type', 'application/json');
	                               res.send(JSON.stringify({status:22,message:'special characters $%*=& not allowed'}));
	                           });
                            }
                      	 });
                      }
                      else{
                         res.setHeader('Content-Type', 'application/json');
                         res.send(JSON.stringify({status:23,message:'Code is not valid'}));
                      }
    		      });
		     }
		    catch(error){
         	  res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({status:25,message:'Error'}));
        }
	  }

	  static updateUser(req,res,next){
          let myReq;
		      if(req.method == 'POST'){
		        myReq = req.fields;
		      }
		      else if(req.method == 'GET'){
		        myReq = req.query;
		      }
            try{
                  User.findOne({
                  	 	where:{email:myReq.email,apikey:myReq.apikey}
                  	 }).then(user=>{
                        if(user){
                           User.update(
                             {name:myReq.name},
                             {where:{apikey:myReq.apikey}}
                           ).then(()=>{
                              res.setHeader('Content-Type', 'application/json');
                              res.send(JSON.stringify({status:20,message:'User successfully updated'}));
                           });
                        }else{
                           res.setHeader('Content-Type', 'application/json');
                           res.send(JSON.stringify({status:21,message:'Invalid user'}));
                        }
                  	 });
                  
		      }
		    catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'Error'}));
             }
	  }


	  static removeDevice(reg,res,next){
              
	  }


	 static sendCode(req,res,next){
	  	  let myReq;
	      if(req.method == 'POST'){
	        myReq = req.fields;
	      }
	      else if(req.method == 'GET'){
	        myReq = req.query;
	      }
        
        try {
          Vercode.findOne({
          	where:{email:myReq.email}
          }).then(vercode=>{
          	 var code = Math.floor(Math.random() * 1000000000);
             if(vercode){
                 Vercode.update(
                   {code:code},
                   {where:{email:myReq.email}}
                 ).then(()=>{
                   Mailer.send(myReq.email,'verification code',`Your Verification code is ${code}`);
                   res.setHeader('Content-Type', 'application/json');
                   res.send(JSON.stringify({status:20,message:'Message sent successfully'}));
                 });
             }else{
                Vercode.create({
                  email: myReq.email,
                  code: code
                }).then(()=>{
                   Mailer.send(myReq.email,'verification code',`Your Verification code is ${code}`);
                   res.setHeader('Content-Type', 'application/json');
                   res.send(JSON.stringify({status:20,message:'Message sent successfully'}));
                });
             }
          });
         }
         catch(error){
         	  res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:25,message:'Error'}));
         }

	  }


	  static verifyCode(req,res,next){
              let myReq;
		      if(req.method == 'POST'){
		        myReq = req.fields;
		      }
		      else if(req.method == 'GET'){
		        myReq = req.query;
		      }
            try{
		      Vercode.findOne({
		      	where:{email:myReq.email,code:myReq.code}
		      }).then(vercode=>{
                  if(vercode){
                  	 res.setHeader('Content-Type', 'application/json');
                     res.send(JSON.stringify({status:20,message:'Code is valid'}));
                  }
                  else{
                     res.setHeader('Content-Type', 'application/json');
                     res.send(JSON.stringify({status:23,message:'Code is not valid'}));
                  }
		      });
		    }
		   catch(error){
         	  res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({status:25,message:'Error'}));
             }

	  }


	  static changePassword(req,res,next){
           let myReq;
		      if(req.method == 'POST'){
		        myReq = req.fields;
		      }
		      else if(req.method == 'GET'){
		        myReq = req.query;
		      }
            try{
                     console.log(" incoming password");
                     console.log(myReq.password);
                     console.log(" end password");
                     User.findOne({
                  	 	where:{email:myReq.email,apikey:myReq.apikey}
                  	 }).then(user=>{
                        if(user){
                            console.log(" incoming password");
                            console.log(myReq.password);
                            console.log(" end password");
                           if(bcrypt.compareSync(myReq.oldpassword,user.password)){
                                try{
    	                           User.update(
    	                             {password:bcrypt.hashSync(myReq.password)},
    	                             {where:{apikey:myReq.apikey}}
    	                           ).then(()=>{
    	                              res.setHeader('Content-Type', 'application/json');
    	                              res.send(JSON.stringify({status:20,message:'Password successfully changed'}));
    	                           }).catch(error=>{
    	                               res.setHeader('Content-Type', 'application/json');
    	                               res.send(JSON.stringify({status:22,message:'special characters $%*=& not allowed'}));
    	                           });
                                 } catch(e) {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(JSON.stringify({status:22,message:'Invalid password'}));
                                 }
	                        }else{
	                        	res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({status:22,message:'Invalid old password'}));
	                        }
                        }else{
                             SubUser.findOne({
                          	 	where:{email:myReq.email,apikey:myReq.apikey}
                          	 }).then(user=>{
                                if(user){
                                    console.log(" incoming password");
                                    console.log(myReq.password);
                                    console.log(" end password");
                                    try {
                                        if(bcrypt.compareSync(myReq.oldpassword,user.password)){
            	                           SubUser.update(
            	                             {password:bcrypt.hashSync(myReq.password)},
            	                             {where:{apikey:myReq.apikey}}
            	                           ).then(()=>{
            	                              res.setHeader('Content-Type', 'application/json');
            	                              res.send(JSON.stringify({status:20,message:'Password successfully changed'}));
            	                           }).catch(error=>{
            	                               res.setHeader('Content-Type', 'application/json');
            	                               res.send(JSON.stringify({status:22,message:'special characters $%*=& not allowed'}));
            	                           });
            	                        }else{
            	                        	res.setHeader('Content-Type', 'application/json');
                                            res.send(JSON.stringify({status:22,message:'Invalid old password'}));
            	                        }
                                    } catch(e) {
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(JSON.stringify({status:22,message:'Invalid password'}));
                                    }
                                   
                                }else{
                                   res.setHeader('Content-Type', 'application/json');
                                   res.send(JSON.stringify({status:22,message:'Invalid user'}));
                                }
                          	 });
                        }
                  	 });
                  
		      }
		    catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'Error'}));
             }
	  }

	  static verifyUser(reg,res,next){
              
	  }
}

module.exports = RegisterController;


