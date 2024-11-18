const User = require('../models').User;
const Vercode = require('../models').Vercode;
const Subscription = require('../models').Subscription;
const SubUser = require('../models').SubUser;
var uniqid = require('uniqid');
var bcrypt = require('bcrypt-nodejs');

class Middleware{

    static apiAuth (req, res, next){
         
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
        
        
        try{
            User.findOne({
              where:{apikey:myReq.apikey}
            }).then(user=>{
                if(user){
                  return next();
                }else{
                    SubUser.findOne({
                      where:{apikey:myReq.apikey}
                    }).then(subuser=>{
                        if(subuser){
                          return next();
                        }else{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:24,message:'Un-authorized'}));
                        }
                    });
                }
            });
        }
        catch(err){
            res.setHeader('Content-Type', 'application/json');             
            res.send(JSON.stringify({status:25,message:'err'}));
        }

        
          
    }


    static apiSubAuth (req, res, next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      

        
    }


   static apiDeviceSubAuth (req, res, next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }  
   }

   static deviceAuth(req, res, next){
      return next();
   }

}

module.exports = Middleware;