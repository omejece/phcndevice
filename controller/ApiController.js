
const EventEmitter = require('events');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const Op = Sequelize.Op;
const User = require('../models').User;
const SubUser = require('../models').SubUser;
const Vercode = require('../models').Vercode;
const PhcnDevice = require('../models').PhcnDevice;
const InverterDevice = require('../models').InverterDevice;
const GenDevice = require('../models').GenDevice;
const TankDevice = require('../models').TankDevice;
const DeviceList = require('../models').DeviceList;
const Subscription = require('../models').Subscription;
const UpTime = require('../models').UpTime;
const DownTime = require('../models').DownTime;
const FConsumption = require('../models').FConsumption;
const PowerTime = require('../models').PowerTime;
const FuelGauge = require('../models').FuelGauge;
const RunTime = require('../models').RunTime;
const PowerConsumption = require('../models').PowerConsumption;
const PhcnDeviceData = require('../models').PhcnDeviceData;
const Phcnontime = require('../models').phcnontime;
const Phcnofftime = require('../models').phcnofftime;
const Genofftime = require('../models').genofftime;
const PhcnDataProfile = require('../models').phcndataprofile;
const GenDataProfile = require('../models').gendataprofile;

const InverterBatteryUndervoltageReport = require("../models").inverterbatteryundervoltagereport;
const Site = require('../models').Site;
var uniqid = require('uniqid');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');


var DeviceStatusController = require('./DeviceStatusController');

let sequelize = new Sequelize(config.database, config.username, config.password, config);

class ApiController extends EventEmitter{
    
      
      static index(req,res,next){
          res.setHeader('Content-Type', 'application/json');
	      res.send(JSON.stringify({status:22,message:'Device already in use'}));
      }
      
      
	  static newDevice(req,res,next){
        let myReq;
        if(req.method == 'POST'){
          myReq = req.fields;
        }
        else if(req.method == 'GET'){
          myReq = req.query;
        }
      
      try{
        DeviceList.findOne({
        	where:{duid:myReq.duid}
        }).then(device=>{
            if(device){
               if(device.status == 0){
                  User.findOne({
                  	where:{apikey:myReq.apikey}
                  }).then(user=>{
                      if(user){

                      	if(myReq.devicetype == 1){
                            InverterDevice.findOne({
	                         	where:{duid:myReq.duid}
	                         }).then(device=>{
	                             if(device){
	                             	res.setHeader('Content-Type', 'application/json');
	                                res.send(JSON.stringify({status:22,message:'Device already in use'}));
	                             }else{
	                             	InverterDevice.create({
	                             		duid:myReq.duid,
	                             		siteid:myReq.siteid,
	                             		userid:user.id,
	                             		name:myReq.name,
	                             		control:1,
	                             		status:1
	                             	}).then(device=>{
	                             		DeviceList.update(
	                                      {status:1},
	                                      {where:{duid:device.duid}}
	                             	    ).then(()=>{

	                             		});
	                             		res.setHeader('Content-Type', 'application/json');
	                                    res.send(JSON.stringify({status:20,message:'Device successfully added'}));
	                             	})
	                             }
	                         });
                      	}
                      	else if(myReq.devicetype == 2){
                            PhcnDevice.findOne({
	                         	where:{duid:myReq.duid}
	                         }).then(device=>{
	                             if(device){
	                             	res.setHeader('Content-Type', 'application/json');
	                                res.send(JSON.stringify({status:22,message:'Device already in use'}));
	                             }else{
	                             	PhcnDevice.create({
	                             		duid:myReq.duid,
	                             		siteid:myReq.siteid,
	                             		userid:user.id,
	                             		name:myReq.name,
	                             		powerstatus: 0,
                                        cost_per_kwh: myReq.cost_per_kwh,
                                        vat: myReq.vat,
	                             		control:1,
	                             		status:1
	                             	}).then(device=>{
	                             		DeviceList.update(
	                                      {status:1},
	                                      {where:{duid:device.duid}}
	                             	    ).then(()=>{

	                             		});
	                             		res.setHeader('Content-Type', 'application/json');
	                                    res.send(JSON.stringify({status:20,message:'Device successfully added'}));
	                             	})
	                             }
	                         });
                      	}
                      	else if(myReq.devicetype == 3){
                            GenDevice.findOne({
	                         	where:{duid:myReq.duid}
	                         }).then(device=>{
	                             if(device){
	                             	res.setHeader('Content-Type', 'application/json');
	                                res.send(JSON.stringify({status:22,message:'Device already in use'}));
	                             }else{
	                             	GenDevice.create({
	                             		duid:myReq.duid,
	                             		siteid:myReq.siteid,
	                             		userid:user.id,
	                             		name:myReq.name,
	                             		gauge: 0,
	                             		flowrate: 0,
	                             		control:1,
	                             		status:1
	                             	}).then(device=>{
	                             		DeviceList.update(
	                                      {status:1},
	                                      {where:{duid:device.duid}}
	                             	    ).then(()=>{

	                             		});
	                             		res.setHeader('Content-Type', 'application/json');
	                                    res.send(JSON.stringify({status:20,message:'Device successfully added'}));
	                             	})
	                             }
	                         });
                      	}
                      	else{
                      		res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({status:23,message:'Invalid device type'}));
                      	}

                      }else{
                      	res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({status:22,message:'Invalid user'}));
                      }
                  });
               }else{
                	res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Device already in use'}));
               }
            }else{
            	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid device'}));
            }
        });
        
        }
     catch(error){
     	    res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
     } 



}


static newSite(req,res,next){
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
	             	Site.create({
	             		userid:user.id,
	             		name:myReq.name,
	             		description:myReq.description
	             	}).then(()=>{
	             		res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:20,message:'Site successfully added'}));
	             	});
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}
 
 

static getSite(req,res,next){
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
	             	Site.findAll({
	             		where:{userid:user.id}
	             	}).then(site=>{
	             		res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:20,message:site}));
	             	});
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
     }
     catch(error){
     	res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:'error'}));
     } 
}





static newSubuser(req,res,next){
      let myReq;
      if(req.method == 'POST'){
        myReq = req.fields;
      }
      else if(req.method == 'GET'){
        myReq = req.query;
      }
      try{
      	  var myapikey = uniqid();
          User.findOne({
          	where:{apikey:myReq.apikey}
          }).then(user=>{
              if(user){
	             SubUser.findOne({
	             	where:{email:myReq.email}
	             }).then(mysubuser=>{
	             	if(mysubuser){
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
                       return;
	             	}
	             	else{
                       SubUser.create({
                          apikey: myapikey,
						  userid: user.id,
						  name: myReq.name,
						  email: myReq.email,
						  password:bcrypt.hashSync(myReq.password)
                       }).then(()=>{
                       	  res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,message:'Subuser successfully created',apikey:myapikey}));
                       })
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}








static editSubuser(req,res,next){
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
	             SubUser.findOne({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	if(mysubuser){
	             	   
	             	   SubUser.findOne({
                          where:{email:myReq.email}
	             	   }).then(mysub=>{
	             	   	  if(mysub){
	             	   	  	 if(mysub.id != myReq.subuserid){
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
                                return;
                             }
	             	   	  }
                          SubUser.update(
                            {
							 name: myReq.name,
							 email: myReq.email,
							 password:bcrypt.hashSync(myReq.password)
	                        },
	                        {
                              where:{id:myReq.subuserid}
	                        }
	                      ).then(()=>{
	                       	 res.setHeader('Content-Type', 'application/json');
	                         res.send(JSON.stringify({status:20,message:'Subuser successfully created'}));
	                      })
	             	   })
	             	}
	             	else{
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}







static deleteSubuser(req,res,next){
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
	             SubUser.findOne({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	if(mysubuser){
	             	   
	             	   SubUser.destroy({
                          where:{id:myReq.subuserid}
	             	   }).then(mysub=>{
	             	   	  res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:29,message:'Subuser successfully removed'}));
	             	   })
	             	}
	             	else{
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Subuser with this email already exist'}));
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}





static getSubuser(req,res,next){
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
	             SubUser.findOne({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	if(mysubuser){
	             	   res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:mysubuser}));
	             	}
	             	else{
                       res.setHeader('Content-Type', 'application/json');
                       res.send(JSON.stringify({status:29,message:'Invalid subuser'}));
	             	}
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}




static getSubusers(req,res,next){
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
	             SubUser.findAll({
	             	where:{userid:user.id,id:myReq.subuserid}
	             }).then(mysubuser=>{
	             	res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:29,message:mysubuser}));
	             })
              }else{
              	res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
      }
      catch(error){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({status:25,message:'error'}));
      } 
        
}






static getDevice(req,res,next){
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
	              	if(myReq.devicetype == 1){
		             	InverterDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	});
		            }
		            else if(myReq.devicetype == 2){
		             	PhcnDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	});
		            }
		            else if(myReq.devicetype == 3){
		             	GenDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	});
		            }
		            else{
		            	res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
		            }
	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }); 
	        }
          catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }  
	}



   
   
   static getDevice2(req,res,next){
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
	              	if(myReq.devicetype == 1){
		             	InverterDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	});
		            }
		            else if(myReq.devicetype == 2){
		             	PhcnDevice.findOne({
		             		where:{
		             		    userid:user.id,
		             		    siteid:myReq.siteid,
		             		    duid:myReq.duid
		             		}
		             	}).then(device=>{
		             	    
		             	    if(device){
		             	        
		             	        Phcnontime.findAll({
    		             	        where:{
    		             	            duid: device.duid,
    		             	            datetaken: {
    		             	                [Op.between] : [myReq.datefrom,myReq.dateto]
    		             	            }
    		             	        }
    		             	    }).then(myOnnTime=>{
    		             	        
    		             	        Phcnofftime.findAll({
        		             	        where:{
        		             	            duid: device.duid,
        		             	            datetaken: {
        		             	                [Op.between] : [myReq.datefrom,myReq.dateto]
        		             	            } 
        		             	        }
        		             	    }).then(myOffTime=>{
        		             	        res.setHeader('Content-Type', 'application/json');
    		                            res.send(JSON.stringify({
    	                                  status:20,
    	                                  result:{ 
    	                                    device : device,
    	                                    off_times : myOffTime,
    	                                    onn_times : myOnnTime
    	                                  }  
    		                            }));
        		             	    })
    		             	        
    		             	    })
		             	        
		             	    }
		             	    else{
		             	        res.setHeader('Content-Type', 'application/json');
	                            res.send(JSON.stringify({status:23,message:'Invalid device'}));
		             	    }
		             		
		             	});
		            }
		            else if(myReq.devicetype == 3){
		                
		             	GenDevice.findOne({
		             		where:{userid:user.id,siteid:myReq.siteid,duid:myReq.duid}
		             	}).then(device=>{
		             		res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:20,result:device}));
		             	});
		             	
		            }
		            else{
		            	res.setHeader('Content-Type', 'application/json');
	                    res.send(JSON.stringify({status:23,message:'Invalid device type 9000'}));
		            }
	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }); 
	        }
          catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
           }  
	}

   
   
   

	static getAllDevice(req,res,next){
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

		             	if(myReq.devicetype == 1){
			             	InverterDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	});
			            }
			            else if(myReq.devicetype == 2){
			             	PhcnDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	});
			            }
			            else if(myReq.devicetype == 3){
			             	GenDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	});
			            }
			            else{
			            	res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
			            }


	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          });
	       }
         catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }    
	  }

	 static automate(req,res,next){
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
                         
                           if(myReq.devicetype == 3){
				             	Device.findOne({
				             		where:{userid:user.id,duid:myReq.duid}
				             	}).then(device=>{
				             		if(device){
	                                   Device.update(
	                                      {control:myReq.control},
	                                      {where:{duid:myReq.duid}}
	                                   ).then(()=>{
	                                   	  res.setHeader('Content-Type', 'application/json');
				                          res.send(JSON.stringify({status:20,message:'Device automated successfully'}));
	                                   });
				             		}else{
				             			res.setHeader('Content-Type', 'application/json');
				                        res.send(JSON.stringify({status:23,message:'Invalid device'}));
				             		}
				             		
				             	});
				            }
				            else if(myReq.devicetype == 3){
				             	Device.findOne({
				             		where:{userid:user.id,duid:myReq.duid}
				             	}).then(device=>{
				             		if(device){
	                                   Device.update(
	                                      {control:myReq.control},
	                                      {where:{duid:myReq.duid}}
	                                   ).then(()=>{
	                                   	  res.setHeader('Content-Type', 'application/json');
				                          res.send(JSON.stringify({status:20,message:'Device automated successfully'}));
	                                   });
				             		}else{
				             			res.setHeader('Content-Type', 'application/json');
				                        res.send(JSON.stringify({status:23,message:'Invalid device'}));
				             		}
				             		
				             	});
				            }
				            else if(myReq.devicetype == 3){
				             	GenDevice.findOne({
				             		where:{userid:user.id,duid:myReq.duid}
				             	}).then(device=>{
				             		if(device){
	                                   GenDevice.update(
	                                      {control:myReq.control},
	                                      {where:{duid:myReq.duid}}
	                                   ).then(()=>{
	                                   	  res.setHeader('Content-Type', 'application/json');
				                          res.send(JSON.stringify({status:20,message:'Device automated successfully'}));
	                                   });
				             		}else{
				             			res.setHeader('Content-Type', 'application/json');
				                        res.send(JSON.stringify({status:23,message:'Invalid device'}));
				             		}
				             		
				             	});
				            }
				            else{
			            	    res.setHeader('Content-Type', 'application/json');
		                        res.send(JSON.stringify({status:23,message:'Invalid device type'}));
			                }

			             	

		              }else{
		              	res.setHeader('Content-Type', 'application/json');
		                res.send(JSON.stringify({status:22,message:'Invalid user'}));
		              }
		          }); 
		        }
	          catch(error){
	         	    res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:25,message:'error'}));
	         }
	  }


	



	 static saveGenPowerTime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        var nowDate = new Date();
            var mydate = nowDate.getFullYear()+'-'+(nowDate.getMonth() + 1)+'-'+nowDate.getDate();
            var mytime = nowDate.getHours()+':'+nowDate.getMinutes()+':'+nowDate.getSeconds();
            try{
                GenDevice.findOne({
             		where:{duid:myReq.duid}
             	}).then(device=>{
             		if(device){
    
                       GenDevice.update(
                          {status:myReq.st},
                          {where:{duid:myReq.duid}}
                       ).then(()=>{
                           PowerTime.create({
                              userid: device.userid,
    						  siteid: device.siteid,
    						  duid: device.duid,
    					      timetaken: mytime,
    				     	  datetaken: mydate,
    				     	  status:1
                           }).then(()=>{
                              res.setHeader('Content-Type', 'application/json');
    		                  res.send(JSON.stringify(`#${device.control}#`));
                           })
    
                       });
             		}else{
             			res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify("#Invalid device#"));
             		}
             		
             	});
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 
	 static updateDevice(req,res,next){
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
                        
		             	if(myReq.devicetype == 1){
			             	InverterDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	}).catch(err=>{
                	              res.setHeader('Content-Type', 'application/json');
                                  res.send(JSON.stringify({status:25,message:'error'}));
                	          });
			            }
			            else if(myReq.devicetype == 2){
			             	PhcnDevice.findOne({
			             		where:{userid:user.id,duid:myReq.duid}
			             	}).then(device=>{
			             	    if(device){
			             	        PhcnDevice.update(
			             	            {
			             	               vat: myReq.vat,
			             	               cost_per_kwh: myReq.cost_per_kwh
			             	            },
			             	            {
			             	               where:{
			             	                  duid:myReq.duid 
			             	               }
			             	            }
			             	        ).then(myresp=>{
			             	            res.setHeader('Content-Type', 'application/json');
			                            res.send(JSON.stringify({status:20,result:{},message:'Successfully updated'}));
			             	        }).catch(err=>{
                        	              res.setHeader('Content-Type', 'application/json');
                                          res.send(JSON.stringify({status:25,message:'error'}));
                        	          });
			             	    }
			             	    else{
			             	        res.setHeader('Content-Type', 'application/json');
			                        res.send(JSON.stringify({status:21,result:{},message:'Invalid device'}));
			             	    }
			             		
			             	});
			            }
			            else if(myReq.devicetype == 3){
			             	GenDevice.findAll({
			             		where:{userid:user.id,siteid:myReq.siteid}
			             	}).then(device=>{
			             		res.setHeader('Content-Type', 'application/json');
			                    res.send(JSON.stringify({status:20,result:device}));
			             	}).catch(err=>{
                	              res.setHeader('Content-Type', 'application/json');
                                  res.send(JSON.stringify({status:25,message:'error'}));
                	          });
			            }
			            else{
			            	res.setHeader('Content-Type', 'application/json');
		                    res.send(JSON.stringify({status:23,message:'Invalid device type'}));
			            }


	              }else{
	              	res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:22,message:'Invalid user'}));
	              }
	          }).catch(err=>{
	              res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:25,message:'error'}));
	          });
	       }
         catch(error){
         	    res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:25,message:'error'}));
         }  
	        
	        
	 }



	 static deleteDevice(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	 }


	 static deviceRuntime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                RunTime.findAll({
    	        	where:{
    	        		duid:myReq.duid,
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(runtime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:runtime}));
    	        })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 static allDeviceRuntime(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                RunTime.findAll({
    	        	where:{
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(runtime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:runtime}));
    	        }) 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 static deviceFConsumption(req,res,next){
            let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }

            try{
              FConsumption.findAll({
    	        	where:{
    	        		duid:myReq.duid,
    	        		siteid:myReq.siteid,
    	        		datetaken:{
    	               [Op.between]:[myReq.datefrom,myReq.dateto] 
    	            }
    	        	}
    	        }).then(fconsumption=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:fconsumption}));
    	        })  
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 static allDeviceFConsumption(req,res,next){
          let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                FConsumption.findAll({
      	        	where:{
      	        		siteid:myReq.siteid,
      	        		datetaken:{
      	               [Op.between]:[myReq.datefrom,myReq.dateto] 
      	            }
      	        	}
      	        }).then(fconsumption=>{
      	        	res.setHeader('Content-Type', 'application/json');
      		        res.send(JSON.stringify({status:20,result:fconsumption}));
      	        }) 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }




   static getDeviceFuelGauges(req,res,next){
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
                FuelGauge.findAll({
                  where:{
                    duid:myReq.duid,
                    siteid:myReq.siteid,
                    datetaken:{
                       [Op.between]:[myReq.datefrom,myReq.dateto] 
                    }
                  }
                }).then(fuelgauge=>{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:20,result:fuelgauge}));
                }) 
              }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
     }
     catch(error){
      res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:'error'}));
     } 
   }




   static getAllFuelGauges(req,res,next){
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
                FuelGauge.findAll({
                  where:{
                    siteid:myReq.siteid,
                    datetaken:{
                       [Op.between]:[myReq.datefrom,myReq.dateto] 
                    }
                  }
                }).then(fuelgauge=>{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({status:20,result:fuelgauge}));
                }) 
              }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({status:22,message:'Invalid user'}));
              }
          });
     }
     catch(error){
      res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status:25,message:'error'}));
     } 
   }


	 static makeSubscription(req,res,next){
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
                           Subscription.findAll(
                           	{startdate:myReq.startdate,enddate:myReq.enddate},
                           	{where:{userid:user.id}}
                           	).then(uptime=>{
        			        	res.setHeader('Content-Type', 'application/json');
        				        res.send(JSON.stringify({status:20,message:'Successfully subscribed'}));
        			        })
                       }
                       else{
        	            	  res.setHeader('Content-Type', 'application/json');
        				      res.send(JSON.stringify({status:22,message:'invalid user'}));
        			   }
                    })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
            
            
	            
	 }
	 
	 
	 
	 static getOffTime(req,res,next){
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
                           
                            Phcnofftime.findAll(
                               {
                                   where:{
                                       duid: myReq.duid,
                                       datetaken:{
                    	                 [Op.between]:[myReq.datefrom,myReq.dateto] 
                    	               },
                    	               userid: user.id
                                   }
                               }
                           	).then(offtime=>{
        			        	res.setHeader('Content-Type', 'application/json');
        				        res.send(JSON.stringify({status:20,message:offtime}));
        			        })
                       }
                       else{
        	            	  res.setHeader('Content-Type', 'application/json');
        				      res.send(JSON.stringify({status:22,message:'invalid user'}));
        			   }
                    })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
            
            
	            
	 }
	 
	 
	 


	 static deviceDowntime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }


	 }


	 static allDeviceDowntime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	 }


	 static deviceUptime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
	        
	        try{
                 UpTime.findAll({
    	        	where:{
    	        		duid:myReq.duid,
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(uptime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:uptime}));
    	        })
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }

	        
	 }


	 static allDeviceUptime(req,res,next){
           let myReq;
	        if(req.method == 'POST'){
	          myReq = req.fields;
	        }
	        else if(req.method == 'GET'){
	          myReq = req.query;
	        }
            
            try{
                UpTime.findAll({
    	        	where:{
    	        		siteid:myReq.siteid,
    	        		datetaken:{
        	               [Op.between]:[myReq.datefrom,myReq.dateto] 
        	            }
    	        	}
    	        }).then(uptime=>{
    	        	res.setHeader('Content-Type', 'application/json');
    		        res.send(JSON.stringify({status:20,result:uptime}));
    	        }) 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	        
	 }


	 
     

    static devicePowerTime(req,res,next){
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
        	              PowerTime.findAll({
            	           where:{
            	               userid:user.id,
            	               duid:myReq.duid,
            	               status:1,
            	               datetaken:{
            	                  [Op.between]:[myReq.datefrom,myReq.dateto] 
            	               }
            	            }
            	          }).then(power=>{
            	              res.setHeader('Content-Type', 'application/json');
        		              res.send(JSON.stringify({status:20,result:power}));
            	          });
        	           }
        	           else{
        	              res.setHeader('Content-Type', 'application/json');
        		          res.send(JSON.stringify({status:22,message:'Not allowed'}));
        	           }
        	           
        	       }); 
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
	       
	       
	       
    }
    
    
    
    static deviceOffTime(req,res,next){
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
        	              PowerTime.findAll({
            	           where:{
            	               userid:user.id,
            	               duid:myReq.duid,
            	               status:0,
            	               datetaken:{
            	                  [Op.between]:[myReq.datefrom,myReq.dateto] 
            	               }
            	            }
            	          }).then(power=>{
            	              res.setHeader('Content-Type', 'application/json');
        		              res.send(JSON.stringify({status:20,result:power}));
            	          });
        	           }
        	           else{
        	              res.setHeader('Content-Type', 'application/json');
        		          res.send(JSON.stringify({status:22,message:'Not allowed'}));
        	           }
        	           
        	       });
            }
            catch(err){
                res.setHeader('Content-Type', 'application/json');             
                res.send(JSON.stringify({status:25,message:'err'}));
            }
            
	       
	       
    }


    
    static getNepaDevices(req,res,next){
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
                      PhcnDevice.findAll({
                       where:{
                           userid:user.id
                        }
                      }).then(mydevice=>{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,result:mydevice}));
                      });
                   }
                   else{
                      res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Not allowed'}));
                   }
                   
               });
          }
          catch(err){
             res.setHeader('Content-Type', 'application/json');             
             res.send(JSON.stringify({status:25,message:'err'}));
          }
    }


    static getNepaDevice(req,res,next){
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
                      PhcnDevice.findOne({
                       where:{
                           userid:user.id,
                           duid:myReq.duid
                        }
                      }).then(mydevice=>{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,result:mydevice}));
                      });
                   }
                   else{
                      res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Not allowed'}));
                   }
                   
               });
          }
          catch(err){
             res.setHeader('Content-Type', 'application/json');             
             res.send(JSON.stringify({status:25,message:'err'}));
          }
    }


    static getDevicePowerConsumption(req,res,next){
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
                      
                      PowerConsumption.findAll({
                       where:{
                           userid:user.id,
                           siteid:myReq.siteid,
                           duid:myReq.duid,
                           datetaken:{
                              [Op.between]:[myReq.datefrom,myReq.dateto] 
                           }
                        }
                      }).then(power=>{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,result:power}));
                      });
                      
                      
                   }
                   else{
                      res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Not allowed'}));
                   }
                   
               });
          }
          catch(err){
             res.setHeader('Content-Type', 'application/json');             
             res.send(JSON.stringify({status:25,message:'err'}));
          }
    }





    static getPhcnDeviceCompleteData(req,res,next){
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
                      PhcnDeviceData.findAll({
                       where:{
                           userid:user.id,
                           siteid:myReq.siteid,
                           duid:myReq.duid,
                           datetaken:{
                              [Op.between]:[myReq.datefrom,myReq.dateto] 
                           }
                        }
                      }).then(power=>{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,result:power}));
                      });
                   }
                   else{
                      res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Not allowed'}));
                   }
                   
               });
          }
          catch(err){
             res.setHeader('Content-Type', 'application/json');             
             res.send(JSON.stringify({status:25,message:'err'}));
          }
    }
    
    
    
    
    
    
    static getPowerConsumption(req,res,next){
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
                      PowerConsumption.findAll({
                       where:{
                           userid:user.id,
                           siteid:myReq.siteid,
                           datetaken:{
                              [Op.between]:[myReq.datefrom,myReq.dateto] 
                           }
                        }
                      }).then(power=>{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,result:power}));
                      });
                   }
                   else{
                      res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Not allowed'}));
                   }
                   
               });
          }
          catch(err){
             res.setHeader('Content-Type', 'application/json');             
             res.send(JSON.stringify({status:25,message:'err'}));
          }
    }
    
    
    
    
    
    static getAllPhcnDeviceCompleteData(req,res,next){
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
                      PhcnDeviceData.findAll({
                        where:{
                           userid:user.id,
                           siteid:myReq.siteid,
                           datetaken:{
                              [Op.between]:[myReq.datefrom,myReq.dateto] 
                           }
                        }
                      }).then(power=>{
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({status:20,result:power}));
                      });
                   }
                   else{
                      res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status:22,message:'Not allowed'}));
                   }
                   
               });
          }
          catch(err){
             res.setHeader('Content-Type', 'application/json');             
             res.send(JSON.stringify({status:25,message:'err'}));
          }
    }

    


    static saveTankLevel(duid,gauge){
		                            
	         
	  	     try{

                  return new Promise(function(resolve,reject){
                        GenDevice.findOne({
      		             		where:{duid:duid}
      		             	}).then(device=>{
      		             		if(device){
      		             		     if(device.sensortype == 1){
      		             		         var intercept = 25.9587/1;
                                   var slope = 0.07370668/1;
                                   var realgauge = intercept + (slope * (gauge)/1);
                                   var adjustedGauge = realgauge + parseFloat(device.clearance);
      		                         GenDevice.update(
      		                          {gauge:adjustedGauge},
      		                          {where:{duid:duid}}
      		                         ).then(()=>{
      		                       	   resolve(1);
      		                         }); 
      		             		     }
      		             		     else{
      		             		         
      		             		         if((gauge > device.tankheight) || gauge <= 0){
      		             		             
      		             		         }
      		             		         else{
      		             		             GenDevice.update(
          		                          {gauge:parseFloat(gauge)},
          		                          {where:{duid:duid}}
          		                         ).then(()=>{
          		                       	   resolve(1);
          		                         }); 
      		             		         }
      		             		         
      		             		         
      		             		     }
                                       
      		             		}else{
      		             			reject(0);
      		             		}
      		             		
      		             	});
                  });
	                
		      }
	          catch(error){
	         	    res.setHeader('Content-Type', 'application/json');
	                res.send(JSON.stringify({status:25,message:'error'}));
	          }
	  }







    static loginDevice(data){
    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
                
            }
            else if(data.duid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        reject({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     console.log(err);
                     reject({status:71,device:err});
                 });

            }
            else if(data.duid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }




    static saveOnnTime(data){

    	return new Promise(function(resolve,reject){
            if(data.duid.startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	       var myrawdate = new Date();
            	           var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
            	           var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
            	           var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
            	           
            	           var mydt = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                	       var secondsElapse = (parseInt(data.timeelapsed))/1000;
                	       
                	       if(parseInt(myrawdate.getHours()) >= 23 ){
        	                   mydt.setDate(mydt.getDate() + 1);
	                       }
	                       
	                       if(mydt.getHours() <= 0 ){
	                           mydt = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
	                       }
	                       
	                       if(mydt.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
	                           mydt = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
	                       }
                	       
                	       mydt.setSeconds( mydt.getSeconds() - secondsElapse);
                	       
                	       var myTimeTaken = (mydt.getHours())+":"+mydt.getMinutes()+":"+mydt.getSeconds();
                	       var myDateTaken = mydt.getFullYear()+"-"+(mydt.getMonth()+1)+"-"+mydt.getDate();
                	       
                	       var mysdt = new Date();
                	       var sTimeTaken = (mysdt.getHours())+":"+mysdt.getMinutes()+":"+mysdt.getSeconds();
                           var sDateTaken = mysdt.getFullYear()+"-"+(mysdt.getMonth()+1)+"-"+mysdt.getDate();
                           
                           var mysdate = sDateTaken+" "+sTimeTaken;
                           
                           GenDevice.update(
	                          {
	                            status:data.devicestatus,
	                            lastupdated: mysdate
	                          },
	                          {where:{duid:mydevice.duid}}
	                       ).then(()=>{
	                            
	                               RunTime.findAll({
	                                  limit: 1,
                                      where: {
                                        duid: data.duid,
                                        datetaken:myDateTaken
                                      },
                                      order: [ [ 'createdAt', 'DESC' ]]
	                               }).then(myruntime=>{
                                	if(myruntime.length){
                                	   var mycurrentRuntime = myruntime[0];
                                	   console.log(" starting run time from  onn ");
                                	   console.log(0);
                                	   
                                	   PowerTime.create({
        	                              userid: mydevice.userid,
                    	    						  siteid: mydevice.siteid,
                    	    						  duid: mydevice.duid,
                    	    					    timetaken: myTimeTaken,
                    	    				     	datetaken: myDateTaken,
                    	    				     	workingtimetaken: myTimeTaken,
                                        workingdatetaken: myDateTaken,
                    	    				     	startingduration: mycurrentRuntime.duration,
                    	    				     	status:1,
                    	    				     	isactive: 1
        	                           }).then(mypowertime=>{
        	                               resolve({status:20,device:mydevice});
        	                           })
                                       
                                	}
                                	else{
                                	    PowerTime.create({
        	                              userid: mydevice.userid,
                    	    						  siteid: mydevice.siteid,
                    	    						  duid: mydevice.duid,
                    	    					    timetaken: myTimeTaken,
                    	    				     	datetaken: myDateTaken,
                    	    				     	workingtimetaken: myTimeTaken,
                                        workingdatetaken: myDateTaken,
                    	    				     	startingduration: 0,
                    	    				     	status:1,
                    	    				     	isactive: 1
        	                           }).then(mypowertime=>{
        	                               RunTime.create({
                                            duid: mydevice.duid,
                    										    userid: mydevice.userid,
                    										    siteid: mydevice.siteid,
                    										    startingduration: 0,
                    										    duration: 0,
                    										    datetaken: myDateTaken
                                         }).then(()=>{
                                         	   resolve({status:20,device:mydevice});
                                         })
        	                               
        	                           })
                                	    
                                	}
                                  })
	                           
	    
                          });
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    



    static saveOffTime(data){

    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	     
                	           GenDevice.update(
                                  {status:data.devicestatus},
                                  {where:{duid:mydevice.duid}}
                               ).then(()=>{
                                   
                                   PowerTime.findAll({
                                      limit: 1,
                                      where: {
                                        duid: data.duid.toString(),
                                        status: 1,
                                        isactive: 1
                                      },
                                      order: [ [ 'createdAt', 'DESC' ]]
                                   }).then(myonnpowertime=>{
                                       if(myonnpowertime.length > 0){
                                           var mylastpower = myonnpowertime[0];
                                           var activePowerTime = new Date(`${mylastpower.workingdatetaken} ${mylastpower.workingtimetaken}`);
                                           
                                	       
                                	       var myrawdate = new Date();
                            	           var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                            	           var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                            	           var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                            	           
                            	           var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                                	       
                                	       if(parseInt(myrawdate.getHours()) >= 23 ){
                        	                   currentTime.setDate(currentTime.getDate() + 1);
                	                       }
                	                       
                	                       if(currentTime.getHours() <= 0 ){
                	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                	                       }
                	                       
                	                       if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                	                       }
                                	       
                                    	   var secondsElapse = (parseInt(data.timeelapsed))/1000;
                    	                   currentTime.setSeconds( currentTime.getSeconds() - secondsElapse);
                    	       
                                    	   var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                                    	   var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                                    	    
                                           var totalSecondsElapsed = currentTime.getTime() - activePowerTime.getTime();
                                           
                                           PowerTime.create({
            	                                userid: mydevice.userid,
                          	    						  siteid: mydevice.siteid,
                          	    						  duid: mydevice.duid,
                          	    					    timetaken: myTimeTaken,
                          	    				     	datetaken: myDateTaken,
                          	    				     	workingtimetaken: myTimeTaken,
                                              workingdatetaken: myDateTaken,
                          	    				     	status:0,
                          	    				     	isactive: 0,
            	                           }).then(()=>{
            	                               
            	                               PowerTime.update(
            	                                   {
            	                                      isactive: 0 
            	                                   },
            	                                   {
            	                                       where:{
            	                                           duid: data.duid.toString()
            	                                       }
            	                                   }
            	                               ).then(()=>{
            	                                   resolve({status:20,device:mydevice});
            	                               })
            	                               
            	                              
            	                           }).catch(err=>{
            	                               console.log(err);
            	                           })
            	                           
                                           
                                           
                                           
                                       }
                                   }).catch(err=>{
                                       console.log(err);
                                   })
                                   
                                   
            
                              });
                	    
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    






    static saveDeviceData(data){
        console.log("saving device data");
    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	       var mysdt = new Date();
                	       var sTimeTaken = (mysdt.getHours())+":"+mysdt.getMinutes()+":"+mysdt.getSeconds();
                           var sDateTaken = mysdt.getFullYear()+"-"+(mysdt.getMonth()+1)+"-"+mysdt.getDate();
                           
                           var mysdate = sDateTaken+" "+sTimeTaken;
                           
                           GenDevice.update(
	                          {
	                          	status: data.devicestatus,
	                          	lastupdated: mysdate
	                          },
	                          {where:{duid:mydevice.duid}}
	                       ).then(()=>{
	                               
	                               if(data.devicestatus == '1'){
	                                    
	                                       PowerTime.findAll({
            	                              limit: 1,
                                              where: {
                                                duid: data.duid,
                                                status: 1,
                                                isactive: 1
                                              },
                                              order: [ [ 'createdAt', 'DESC' ]]
            	                           }).then(myonnpowertime=>{
            	                               if(myonnpowertime.length > 0){
            	                                   var mylastpower = myonnpowertime[0];
            	                                   console.log(" my last power is ");
            	                                   console.log(mylastpower.workingtimetaken);
            	                                   var activePowerTime = new Date(`${mylastpower.workingdatetaken} ${mylastpower.workingtimetaken}`);
            	                                   
            	                                   var myrawdate = new Date();
                                    	           var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                                    	           var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                                    	           var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                                    	           
                                    	           var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                                    	           
                                    	           
                                        	       
                                    	           
                                    	           
                                    	           if(parseInt(myrawdate.getHours()) >= 23 ){
                        	                           currentTime.setDate(currentTime.getDate() + 1);
                        	                       }
                        	                       
                        	                       if(currentTime.getHours() <= 0 ){
                        	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                        	                       }
                        	                       
                        	                       
                        	                       if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                        	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                        	                       }
                        	                       
                        	                       
                        	                       
                                        	       
            	                                   var totalSecondsElapsed = currentTime.getTime() - activePowerTime.getTime();
            	                                   totalSecondsElapsed = totalSecondsElapsed < 0 ? 0 : totalSecondsElapsed;
            	                                   
            	                                   console.log(currentTime, " My current time");
            	                                   console.log(mylastpower, " My active power");
            	                                   console.log(totalSecondsElapsed," my to tal time elapsed is");
            	                                   
            	                                   
            	                                   var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                        	                       var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                        	                       
                        	                       
            	                                   
            	                                   RunTime.findOne(
                	                                  {
                	                                    where:{
                	                                     duid:mydevice.duid,
                	                                     datetaken:myDateTaken
                	                                    }
                	                                  }
                	                               ).then(runtime=>{
                                                	if(!runtime){
                                                       RunTime.create({
                                                            duid: mydevice.duid,
                										    userid: mydevice.userid,
                										    siteid: mydevice.siteid,
                										    duration: ((totalSecondsElapsed/1)),
                										    startingduration: 0,
                										    datetaken: myDateTaken
                                                       }).then(()=>{
                                                          PowerTime.update(
                                                             {
                                                               startingduration: 0,
                                                               workingtimetaken: myTimeTaken,
                                                               workingdatetaken: myDateTaken
                                                             },
                                                             {
                                                              where:{
                                                                  id: mylastpower.id
                                                              }
                                                             }
                                                          ).then(()=>{
                                                              resolve({status:20,device:mydevice});
                                                          })
                                                       })
                                                	}
                                                	else{
                                                	   console.log(" starting run time from device data ");
                                        	           console.log(mylastpower.startingduration);
                                                       RunTime.update(
                                                       	  {duration:((mylastpower.startingduration/1) +(totalSecondsElapsed/1))},
                                                       	  {where:{duid:mydevice.duid,datetaken:myDateTaken}}
                                                       	).then(()=>{
                                                       	  resolve({status:20,device:mydevice});
                                                       })
                                                	}
                                                  })
            	                                   
            	                               }
            	                               else{
            	                                   var myrawdate = new Date();
                                    	           var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                                    	           var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                                    	           var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                                    	           
                                    	           var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                                    	           
                                    	           
                                        	       
                                    	           
                                    	           
                                    	           if(parseInt(myrawdate.getHours()) >= 23 ){
                        	                           currentTime.setDate(currentTime.getDate() + 1);
                        	                       }
                        	                       
                        	                       if(currentTime.getHours() <= 0 ){
                        	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                        	                       }
                        	                       
                        	                       
                        	                       if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
                        	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
                        	                       }
                        	                       
            	                                   
            	                                   
            	                                   var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                        	                       var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                        	                       
            	                                   RunTime.findAll({
                	                                  limit: 1,
                                                      where: {
                                                        duid: data.duid,
                                                        datetaken:myDateTaken
                                                      },
                                                      order: [ [ 'createdAt', 'DESC' ]]
                	                               }).then(myruntime=>{
                                                    	if(myruntime.length > 0){
                                                    	   var mycurrentRuntime = myruntime[0];
                                                    	   console.log(" starting run time from  onn ");
                                                    	   console.log(0);
                                                    	   
                                                    	   PowerTime.create({
                            	                              userid: mydevice.userid,
                            	    						  siteid: mydevice.siteid,
                            	    						  duid: mydevice.duid,
                            	    					      timetaken: myTimeTaken,
                            	    				     	  datetaken: myDateTaken,
                            	    				     	  workingtimetaken: myTimeTaken,
                                                              workingdatetaken: myDateTaken,
                            	    				     	  startingduration: mycurrentRuntime.duration,
                            	    				     	  status:1,
                            	    				     	  isactive: 1
                            	                           }).then(mypowertime=>{
                            	                               resolve({status:20,device:mydevice});
                            	                           })
                                                           
                                                    	}
                                                    	else{
                                                    	   PowerTime.create({
                            	                              userid: mydevice.userid,
                            	    						  siteid: mydevice.siteid,
                            	    						  duid: mydevice.duid,
                            	    					      timetaken: myTimeTaken,
                            	    				     	  datetaken: myDateTaken,
                            	    				     	  workingtimetaken: myTimeTaken,
                                                              workingdatetaken: myDateTaken,
                            	    				     	  startingduration: 0,
                            	    				     	  status:1,
                            	    				     	  isactive: 1
                            	                           }).then(mypowertime=>{
                            	                               RunTime.create({
                                                                    duid: mydevice.duid,
                        										    userid: mydevice.userid,
                        										    siteid: mydevice.siteid,
                        										    duration: 0,
                        										    startingduration: 0,
                        										    datetaken: myDateTaken
                                                               }).then(()=>{
                                                                  resolve({status:20,device:mydevice});
                                                               })
                            	                               
                            	                           })
                                                    	}
                	                               })
            	                                   
            	                               }
            	                           })
	                                   
	                                   
	                               }
                                 
                                   
	    
                          });
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }
    



    static saveTankStatus(data){

          return new Promise(function(resolve,reject){
                GenDevice.findOne({
                  where:{
                    duid: data.duid.toString()
                  }
                }).then(mydevice=>{
                   if(mydevice){
                         if(mydevice.sensortype == 1){
                             var intercept = 25.9587/1;
                             var slope = 0.07370668/1;
                             var realgauge = intercept + (slope * (data.gauge)/1);
                             var adjusted = ((1.36121270304068 * realgauge) -17.4675091483413);
                             var adjustedGauge = adjusted + parseFloat(mydevice.clearance);
                             
                             console.log("##########################################################################################");
                             
                             console.log(adjustedGauge);
                             console.log("##########################################################################################");
                             
                             GenDevice.update(
                                {
                                  gauge: adjustedGauge,
                                  voltage: data.voltage
                                },
                                {
                                  where:{
                                    duid:mydevice.duid
                                  }
                                }
                             ).then(()=>{
                                resolve({status:20,device:mydevice});
                             });
                         }
                         else{
                             var realgauge = parseFloat(data.gauge);
                             if((realgauge > parseFloat(mydevice.tankheight)) ||  realgauge <= 0){
                                 
                             }
                             else{
                                 GenDevice.update(
                                    {
                                      gauge: realgauge,
                                      voltage: data.voltage
                                    },
                                    {
                                      where:{
                                        duid:mydevice.duid
                                      }
                                    }
                                 ).then(()=>{
                                    resolve({status:20,device:mydevice});
                                 });
                             }
                         }
                         
                   }
                   else{
                        resolve({status:70,device:{}});
                   }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
          });
    }




    static saveTankGauge(data){

          return new Promise(function(resolve,reject){
                GenDevice.findOne({
                  where:{
                    duid: data.duid.toString()
                  }
                }).then(mydevice=>{
                   if(mydevice){
                       if(mydevice.sensortype == 1){
                             var intercept = 25.9587/1;
                             var slope = 0.07370668/1;
                             var realgauge = intercept + (slope * (data.gauge)/1);
                             
                             var adjusted = ((1.36121270304068 * realgauge) -17.4675091483413);
                             var adjustedGauge = adjusted + parseFloat(mydevice.clearance);
                             
                             
                             console.log("##########################################################################################");
                             
                             console.log(adjustedGauge);
                             console.log("##########################################################################################");
                             GenDevice.update(
                                {
                                  status: data.status,
                                  gauge: adjustedGauge,
                                  voltage: data.voltage
                                },
                                {
                                  where:{
                                    duid:mydevice.duid
                                  }
                                }
                             ).then(()=>{
                                 console.log(data.duid.toString());
                                 FuelGauge.create({
                                    duid: data.duid.toString(),
                                    userid: mydevice.userid,
                                    siteid: mydevice.siteid,
                                    gauge: adjustedGauge,
                                    datetaken: data.datetaken,
                                    timetaken: data.timetaken
                                 }).then(mygauge=>{
                                     
                                    GenDevice.update(
                                        {
                                          gauge: adjustedGauge
                                        },
                                        {
                                          where:{id:mydevice.gendeviceid}
                                        }
                                    ).then(()=>{
                                        console.log(mygauge," my devices data gauge");
                                        resolve({status:20,device:mydevice});
                                    })
                                    
                                 });
                             });
                       }
                       else{
                           
                           if((parseFloat(data.gauge) > parseFloat(mydevice.tankheight)) || parseFloat(data.gauge) <= 0){
                               console.log("correct tank height   kdkddkdkdkdkdkdddd");
                           }
                           else{
                               
                               var adjustedGauge = (data.gauge/1) + parseFloat(mydevice.clearance);
                               GenDevice.update(
                                  {
                                    status: data.status,
                                    gauge: adjustedGauge,
                                    voltage: data.voltage
                                  },
                                  {
                                    where:{
                                      duid:mydevice.duid
                                    }
                                  }
                               ).then(()=>{
                                   console.log(data.duid.toString());
                                   FuelGauge.create({
                                      duid: data.duid.toString(),
                                      userid: mydevice.userid,
                                      siteid: mydevice.siteid,
                                      gauge: adjustedGauge,
                                      datetaken: data.datetaken,
                                      timetaken: data.timetaken
                                   }).then(mygauge=>{
                                       
                                      GenDevice.update(
                                          {
                                            gauge: adjustedGauge
                                          },
                                          {
                                            where:{id:mydevice.gendeviceid}
                                          }
                                      ).then(()=>{
                                          console.log(mygauge," my devices data gauge");
                                          resolve({status:20,device:mydevice});
                                      })
                                      
                                   });
                               });
                                   
                           }

                           
                           
                       }
                   }
                   else{
                        resolve({status:70,device:{}});
                   }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
          });
    }






    static saveDeviceFuelCon(data){

    	return new Promise(function(resolve,reject){
            if(data.duid.toString().startsWith('23')){
                GenDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                }).then(mydevice=>{
                	 if(mydevice){
                	 	   var mygauge = data.gauge == 0 ? mydevice.gauge : data.gauge;
                           GenDevice.update(
	                          {
	                          	voltage: data.voltage,
	                          	gauge: mygauge 
	                          },
	                          {where:{duid:mydevice.duid}}
	                       ).then(()=>{
	                           
                                 var nowDate = new Date();
                                 var mydate = nowDate.getFullYear()+'-'+(nowDate.getMonth() + 1)+'-'+nowDate.getDate();
                                 var fuelconsumed = 0;

                                 if(mydevice.gauge > data.gauge){
                                     fuelconsumed = mydevice.gauge - data.gauge;
                                 }
                                 else if(data.gauge > mydevice.gauge){
                                     fuelconsumed = data.gauge - mydevice.gauge;
                                 }
                                 else{
                                 	fuelconsumed = 0;
                                 }

                                 FConsumption.findOne(
                                    {where:{duid:mydevice.duid,datetaken:mydate}}
                                  ).then(fconsumption=>{
                                  	 if(!fconsumption){
                                  	     
                                  	     
                                        FConsumption.create({
                                            duid: mydevice.duid,
					                        userid: mydevice.userid,
					                        siteid: mydevice.siteid,
					                        consumption: fuelconsumed,
					                        datetaken: mydate
                                        }).then(()=>{
                                            resolve({status:20,device:mydevice});
                                        })
                                        
                                        
                                  	 }
                                  	 else{
                                  	 	var myconsumption = (Number(fconsumption.consumption)/1) + (Number(fuelconsumed)/1);
                                  	 	FConsumption.update(
                                  	 	    {consumption:myconsumption},
                                  	 		{where:{duid:mydevice.duid,datetaken:mydate}}
                                  	 	).then(()=>{
                                           resolve({status:20,device:mydevice});
                                  	 	})
                                  	 	
                                  	 }
                                  })


	    
                          });
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                }).catch(err=>{
                     reject({status:71,device:err});
                });
            }
            else if(data.deviceid.toString().startsWith('24')){

            	 PhcnDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
            else if(data.deviceid.toString().startsWith('25')){

            	 InverterDevice.findOne({
                	where:{
                		duid: data.duid.toString()
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                        resolve({status:20,device:mydevice});
                	 }
                	 else{
                        resolve({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });

            }
    	});
    }

    
    
    
    static updateGauge2(){
        var myrawdate = new Date();
        var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
        var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
        var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
        
        if(cHour == 22 && cMinutes >= 30){
            
            GenDevice.findAll({
                where:{
                    duid: {
                      [Op.like]: '235%'
                    }
                }
            }).then(myresp=>{
                 if(myresp.length > 1){
                     
                     for(var i = 0;i<myresp.length;++i){
                        var foundDevice = myresp[i];
                        
                        GenDevice.findOne(
                            {
                              gauge2: foundDevice.gauge
                            },
                            {
                              where:{
                                  id: foundDevice.id
                              }  
                            }
                        ).then(()=>{
                            GenDevice.update(
                              {
                                gauge2:foundDevice.gauge  
                              },
                              {
                                 where:{
                                     id: foundDevice.gendeviceid
                                 } 
                              }
                            ).then(()=>{
                                
                            }) 
                        })
                        
                     }
                     
                 }
                
            }).then(()=>{
                //resolve({status:20,device:{}});
            })
            
        }
        
    }
    
    
    
    
    static checkActiveGenDevices(data){

          return new Promise(function(resolve,reject){
                
                GenDevice.findAll({
                    where:{
                        duid: {
                          [Op.like]: '234%'
                        }
                    }
                }).then(myresp=>{
                    for(var i = 0;i<myresp.length;++i){
                        var foundDevice = myresp[i];
                        
                        if(foundDevice.status == 1){
                            
                            var d2 = new Date ();
                            var d1 = new Date (foundDevice.lastupdated);
                            
                            var minutesElapsed = (d2.getTime() - d1.getTime())/60000;
                            console.log(d2);
                            console.log(d1);
                            
                            if(minutesElapsed >= 15){
                                
                               PowerTime.update(
                                   {
                                      isactive: 0 
                                   },
                                   {
                                       where:{
                                           duid: foundDevice.duid
                                       }
                                   }
                               ).then(()=>{
                               })
                                  
                               GenDevice.update(
                                  {status:0},
                                  {where:{duid:foundDevice.duid}}
                               ).then(()=>{
                                   
                                   console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 1 888888888888888888888888888888888888888888888888888888888888888888888");
                        	       
                        	       var myrawdate = new Date();
                    	           var cHour = parseInt(myrawdate.getHours() + 1) >= 24 ? 0 : parseInt(myrawdate.getHours());
                    	           var cMinutes = parseInt(myrawdate.getMinutes()) >= 60 ? 0 : parseInt(myrawdate.getMinutes());
                    	           var cSeconds = parseInt(myrawdate.getSeconds()) >= 60 ? 0 : parseInt(myrawdate.getSeconds());
                    	           
                    	           var currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${cHour+':'+cMinutes+':'+cSeconds}`);
                        	       
                        	       if(parseInt(myrawdate.getHours()) >= 23 ){
                	                   currentTime.setDate(currentTime.getDate() + 1);
        	                       }
        	                       
        	                       console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 2 888888888888888888888888888888888888888888888888888888888888888888888");
        	                       
        	                       if(currentTime.getHours() <= 0 ){
        	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
        	                       }
        	                       
        	                       if(currentTime.getHours() > 0 && parseInt(myrawdate.getHours()) < 23){
        	                           currentTime = new Date(`${myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()} ${(cHour+1)+':'+cMinutes+':'+cSeconds}`);
        	                       }
                        	       
            	                   currentTime.setSeconds( currentTime.getSeconds() - 900);
            	       
                            	   var myTimeTaken = (currentTime.getHours())+":"+currentTime.getMinutes()+":"+currentTime.getSeconds();
                            	   var myDateTaken = currentTime.getFullYear()+"-"+(currentTime.getMonth()+1)+"-"+currentTime.getDate();
                            	    
                                   console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 3 888888888888888888888888888888888888888888888888888888888888888888888");
                                   
                                   
                                   PowerTime.create({
    	                              userid: foundDevice.userid,
    	    						  siteid: foundDevice.siteid,
    	    						  duid: foundDevice.duid,
    	    					      timetaken: myTimeTaken,
    	    				     	  datetaken: myDateTaken,
    	    				     	  workingtimetaken: myTimeTaken,
                                      workingdatetaken: myDateTaken,
    	    				     	  status:0,
    	    				     	  isactive: 0,
    	                           }).then(()=>{
    	                               
    	                               console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 4 888888888888888888888888888888888888888888888888888888888888888888888");
    	                              
    	                           }).catch(err=>{
    	                               console.log(err);
    	                           })
                                   
                                   
            
                              });
                            }
                        }
                        
                    }
                }).then(()=>{
                    resolve({status:20,device:{}});
                })
                
                
                 
          });
    }
    
    
    
    
    
    
    static checkActivePhcnDevices(data){
          var device_count = 0;
          var item_count = 0;
          return new Promise(function(resolve,reject){
                
                PhcnDevice.findAll().then(myresp=>{
                    device_count = myresp.length;
                    for(var i = 0;i<myresp.length;++i){
                      
                      
                      var foundDevice = myresp[i];
                      var d2 = new Date ();
                      var d1 = new Date (foundDevice.updatedAt);
                    
                      var minutesElapsed = (d2.getTime() - d1.getTime())/60000;
                      console.log(d2);
                      console.log(d1);
                        
                      if(minutesElapsed >= 10){
                          
                           if(foundDevice.source_type == 2){
                               
                                  DeviceStatusController.offGenDevice(foundDevice).then(()=>{
                                      item_count = item_count + 1;
                                  });
                            }
                            else{
                                
                                  DeviceStatusController.offNepaDevice(foundDevice).then(()=>{
                                      item_count = item_count + 1;
                                  });
                                
                            }
                            
                        }
                        
                    }
                }).then(()=>{
                    if( item_count >= (device_count = 1)){
                        resolve({status:20,device:{}});
                    }
                    
                })
                 
          });
    }
    
    
    
    
    
    static saveGenPowerData(data){
        return new Promise(function(resolve,reject){
            GenDevice.findOne({
                where:{
                    duid: data.source_uid
                }
            }).then(mygen=>{
                if(mygen){
                    GenDevice.update(
                       {
                          frequency: data.frequency,
                          voltagea: data.voltagea,
                          voltageb: data.voltageb,
                          voltagec: data.voltagec,
                          currenta: data.currenta,
                          currentb: data.currentb,
                          currentc: data.currentc,
                          powerfactora: data.powerFactora,
                          powerfactorb: data.powerFactorb,
                          powerfactorc: data.powerFactorc,
                          activepower: (data.totalActivePower/1) * (1000/1),
                          reactivepower: (data.totalReactivePower/1) * 1000, 
                       },
                       {
                         where:{
                            duid: data.source_uid 
                         }
                       }
                    ).then(()=>{
                        resolve(mygen);
                    });
                }
                else{
                    resolve({});
                }
            }).catch(err=>{
                console.log(err);
                resolve({});
            })
        });
    }
    
    
    
    static saveProfile(data){
        return new Promise(function(resolve,reject){
            if(data.source_type == 2){
                GenDevice.findOne({
                   where:{
                      duid: data.duid 
                   }
                }).then(myGen=>{
                    if(myGen){
                        
                        
                        GenDataProfile.findAll({
                          limit: 1,
                          where: {
                            duid: data.duid
                          },
                          order: [ [ 'createdAt', 'DESC' ]]
                        }).then(function(entries){
                            if(entries.length > 0){
                                var prev_time = new Date(entries[0].createdAt);
                                var current_time = new Date();
                                var date_diff =  current_time.getTime() - prev_time.getTime();
                                var date_diff_min = date_diff/60000;
                                if(date_diff_min >= 5){
                                    GenDataProfile.create({
                                        userid: myGen.userid,
                                        siteid: myGen.siteid,
                                        duid: data.duid,
                                        consumptionkw: data.activePower,
                                        activepower: data.activePower,
                                        consumptionkva: data.reactivePower,
                                        activeenergy: data.totalActiveEnergy,
                                        reactiveenergy: data.totalReactiveEnergy,
                                        device_type: 1
                                    }).then(()=>{
                                        resolve({});
                                    }).catch(err=>{
                                        console.log(err);
                                        resolve({});
                                    })
                                }
                                else{
                                    resolve({});
                                }
                            }
                            else{
                                GenDataProfile.create({
                                    userid: myGen.userid,
                                    siteid: myGen.siteid,
                                    duid: data.duid,
                                    consumptionkw: data.activePower,
                                    activepower: data.activePower,
                                    consumptionkva: data.reactivePower,
                                    activeenergy: data.totalActiveEnergy,
                                    reactiveenergy: data.totalReactiveEnergy,
                                    device_type: 1
                                }).then(()=>{
                                    resolve({});
                                }).catch(err=>{
                                    console.log(err);
                                    resolve({});
                                }) 
                            }
                            
                        }).catch(err=>{
                            console.log(err);
                            resolve({});
                        })
                        
                        
                    }
                    else{
                        resolve({});
                    }
                }).catch(err=>{
                    console.log(err);
                    resolve({});
                })
            }
            else{
                    PhcnDevice.findOne({
                       where:{
                          duid: data.duid 
                       }
                    }).then(myPhcn=>{
                        if(myPhcn){
                            
                            PhcnDataProfile.findAll({
                              limit: 1,
                              where: {
                                duid: data.duid
                              },
                              order: [ [ 'createdAt', 'DESC' ]]
                            }).then(function(entries){
                                if(entries.length > 0){
                                    var prev_time = new Date(entries[0].createdAt);
                                    var current_time = new Date();
                                    var date_diff =  current_time.getTime() - prev_time.getTime();
                                    var date_diff_min = date_diff/60000;
                                    if(date_diff_min >= 5){
                                        GenDataProfile.create({
                                            userid: myPhcn.userid,
                                            siteid: myPhcn.siteid,
                                            duid: data.duid,
                                            consumptionkw: data.activePower,
                                            activepower: data.activePower,
                                            consumptionkva: data.reactivePower,
                                            activeenergy: data.totalActiveEnergy,
                                            reactiveenergy: data.totalReactiveEnergy,
                                            device_type: 0
                                        }).then(()=>{
                                            resolve({});
                                        }).catch(err=>{
                                            console.log(err);
                                            resolve({});
                                        })
                                    }
                                    else{
                                        resolve({});
                                    }
                                }
                                else{
                                    PhcnDataProfile.create({
                                        userid: myPhcn.userid,
                                        siteid: myPhcn.siteid,
                                        duid: data.duid,
                                        consumptionkw: data.activePower,
                                        activepower: data.activePower,
                                        consumptionkva: data.reactivePower,
                                        activeenergy: data.totalActiveEnergy,
                                        reactiveenergy: data.totalReactiveEnergy,
                                        device_type: 0
                                    }).then(()=>{
                                        resolve({});
                                    }).catch(err=>{
                                        console.log(err);
                                        resolve({});
                                    }) 
                                }
                                
                            }).catch(err=>{
                                console.log(err);
                                resolve({});
                            })
                        }
                        else{
                            resolve({});
                        }
                    }).catch(err=>{
                        console.log(err);
                        resolve({});
                    })
            }
        });
    }
    
    
    static savePowerData(data){
          return new Promise(function(resolve,reject){
                 PhcnDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                	     
                         
                         var myrawdate = new Date();
                	     var myDateTaken = myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate();
                         
                         PhcnDevice.update(
                          {
                            powerstatus: data.voltagea > 10 || data.voltageb > 10 || data.voltagec > 10 ? 1 : 0,
                            status: data.voltagea > 10 || data.voltageb > 10 || data.voltagec > 10 ? 1 : 0,
                            consumptionkw: data.activePower,
                            activepower: data.activePower,
                            consumptionkva: data.reactivePower,
                            voltagea: data.voltagea,
                            voltageb: data.voltageb,
                            voltagec: data.voltagec,
                            currenta: data.currenta,
                            currentb: data.currentb,
                            currentc: data.currentc,
                            powerfactora: data.powerFactora,
                            powerfactorb: data.powerFactorb,
                            powerfactorc: data.powerFactorc,
                            frequency: data.frequency,
                            sumactiveenergy: data.sumactiveenergy
                          },
                          {
                            where:{
                              duid: data.duid 
                            }  
                          }
                         ).then(()=>{
                               
                               PhcnDeviceData.findOne({
                                   where:{
                                       duid: data.duid,
                                       datetaken:myDateTaken
                                   }
                               }).then(mydevicedata=>{
                                   if(mydevicedata){
                                       
                                       console.log( (mydevice.previousuptime/1 + data.elapsedTime/1),' my new uptime ##########################################################');
                                       
                                       var myTotalActiveEnergy = (mydevicedata.activeenergy/1 + data.totalActiveEnergy/1);
                                       var myTotalReactiveEnergy = (mydevicedata.reactiveenergy/1 + data.totalReactiveEnergy/1);
                                       
                                       var consumptionCost = (myTotalActiveEnergy/1) * (data.cost/1);
                                       var grossTotalActiveConsumption = (consumptionCost/1) + ((consumptionCost/1) * (data.vat/1));
                                       
                                       PhcnDeviceData.update(
                                         {
                                            consumptionkw: data.totalActivePower,
                                            activepower: data.totalActivePower,
                                            consumptionkva: data.totalReactivePower,
                                            activeenergy : myTotalActiveEnergy,
                                            reactiveenergy : myTotalReactiveEnergy,
                                            totalactiveenergy: data.totalActiveEnergy,
                                            uptime: (data.elapsedTime/1),
                                            cost: (grossTotalActiveConsumption/1)
                                         },
                                         {
                                           where:{
                                               id:mydevicedata.id
                                           }
                                         }
                                       ).then(()=>{
                                           if(mydevice.source_type == 2){
                                              RunTime.findOne({
                                                  where:{
                                                      duid:mydevice.source_uid,
                                                      datetaken: myDateTaken
                                                  }
                                              }).then(myRunTime=>{
                                                  if(myRunTime){
                                                      console.log( ' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                      RunTime.update(
                                                          {duration: (data.elapsedTime/1)},
                                                          {
                                                              where:{
                                                                  duid:mydevice.source_uid,
                                                                  datetaken: myDateTaken
                                                              }
                                                          }
                                                      ).then(()=>{
                                                          GenDevice.update(
                                                             {status: 1},
                                                             {
                                                                where:{duid:mydevice.source_uid}
                                                             }
                                                          ).then(()=>{
                                                              resolve({status:20,device:mydevice});
                                                          }).catch(err=>{
                                                             console.log(err);
                                                          })
                                                      })
                                                  }
                                                  else{
                                                      
                                                      console.log( ' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                      RunTime.create({
                                                          duid: mydevice.source_uid,
                                                          userid: mydevice.userid,
                                                          siteid: mydevice.siteid,
                                                          duration: data.elapsedTime,
                                                          startingduration: 0,
                                                          datetaken: myDateTaken
                                                      }).then(()=>{
                                                          GenDevice.update(
                                                             {status: 1},
                                                             {
                                                                where:{duid:mydevice.source_uid}
                                                             }
                                                          ).then(()=>{
                                                              resolve({status:20,device:mydevice});
                                                          }).catch(err=>{
                                                             console.log(err);
                                                          })
                                                      })
                                                      
                                                  }
                                              })
                                          }
                                          else{
                                             resolve({status:20,device:mydevice});
                                          }
                                       })
                                       
                                   }
                                   else{
                                       if(data.voltage > 10){
                                           
                                           PhcnDeviceData.create({
                                                userid: mydevice.userid,
                                                siteid: mydevice.siteid,
                                                duid: mydevice.duid,
                                                consumptionkw: data.totalActivePower,
                                                activepower: data.totalActivePower,
                                                consumptionkva: data.totalReactivePower,
                                                activeenergy :data.totalActiveEnergy,
                                                reactiveenergy :data.totalReactiveEnergy,
                                                device_type: mydevice.source_type == 2 ? 1 : 2,
                                                device_type: 2,
                                                uptime: data.elapsedTime,
                                                datetaken: myDateTaken
                                           }).then(()=>{
                                                
                                                 PhcnDevice.update(
                                                  {
                                                    previousuptime: 0
                                                  },
                                                  {
                                                    where:{
                                                      duid: data.duid 
                                                    }  
                                                  }
                                                 ).then(()=>{
                                                       
                                                     if(mydevice.source_type == 2){
                                                          RunTime.findOne({
                                                              where:{
                                                                  duid:mydevice.source_uid,
                                                                  datetaken: myDateTaken
                                                              }
                                                          }).then(myRunTime=>{
                                                              if(myRunTime){
                                                                  console.log( ' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                  RunTime.update(
                                                                      {duration: (data.elapsedTime/1)},
                                                                      {
                                                                          where:{
                                                                              duid:mydevice.source_uid,
                                                                              datetaken: myDateTaken
                                                                          }
                                                                      }
                                                                  ).then(()=>{
                                                                      GenDevice.update(
                                                                         {status: 1},
                                                                         {
                                                                            where:{duid:mydevice.source_uid}
                                                                         }
                                                                      ).then(()=>{
                                                                          resolve({status:20,device:mydevice});
                                                                      }).catch(err=>{
                                                                         console.log(err);
                                                                      })
                                                                  })
                                                              }
                                                              else{
                                                                  
                                                                  console.log( ' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                  RunTime.create({
                                                                      duid: mydevice.source_uid,
                                                                      userid: mydevice.userid,
                                                                      siteid: mydevice.siteid,
                                                                      duration: data.elapsedTime,
                                                                      startingduration: 0,
                                                                      datetaken: myDateTaken
                                                                  }).then(()=>{
                                                                      GenDevice.update(
                                                                         {status: 1},
                                                                         {
                                                                            where:{duid:mydevice.source_uid}
                                                                         }
                                                                      ).then(()=>{
                                                                          resolve({status:20,device:mydevice});
                                                                      }).catch(err=>{
                                                                         console.log(err);
                                                                      })
                                                                  })
                                                                  
                                                              }
                                                          })
                                                      }
                                                      else{
                                                         resolve({status:20,device:mydevice});
                                                      }
                                                     
                                                 });
                                               
                                               
                                           })
                                           
                                       }
                                       else{
                                           console.log("0",' cleared uptime rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
                                           PhcnDeviceData.create({
                                                userid: mydevice.userid,
                                                siteid: mydevice.siteid,
                                                duid: mydevice.duid,
                                                consumptionkw: data.totalActivePower,
                                                activepower: data.totalActivePower,
                                                consumptionkva: data.totalReactivePower,
                                                activeenergy :data.totalActiveEnergy,
                                                reactiveenergy :data.totalReactiveEnergy,
                                                lastuptime: mydevice.lastuptime,
                                                device_type: mydevice.source_type == 2 ? 1 : 2,
                                                uptime: 0,
                                                datetaken: myDateTaken
                                           }).then(()=>{
                                               
                                               PhcnDevice.update(
                                                  {
                                                    previousuptime: 0
                                                  },
                                                  {
                                                    where:{
                                                      duid: data.duid 
                                                    }  
                                                  }
                                                ).then(()=>{
                                                      
                                                     if(mydevice.source_type == 2){
                                                          RunTime.findOne({
                                                              where:{
                                                                  duid:mydevice.source_uid,
                                                                  datetaken: myDateTaken
                                                              }
                                                          }).then(myRunTime=>{
                                                              if(myRunTime){
                                                                  console.log( ' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                  RunTime.update(
                                                                      {duration: (data.elapsedTime/1)},
                                                                      {
                                                                          where:{
                                                                              duid:mydevice.source_uid,
                                                                              datetaken: myDateTaken
                                                                          }
                                                                      }
                                                                  ).then(()=>{
                                                                      GenDevice.update(
                                                                         {status: 1},
                                                                         {
                                                                            where:{duid:mydevice.source_uid}
                                                                         }
                                                                      ).then(()=>{
                                                                          resolve({status:20,device:mydevice});
                                                                      }).catch(err=>{
                                                                         console.log(err);
                                                                      })
                                                                  })
                                                              }
                                                              else{
                                                                  
                                                                  console.log(' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                  RunTime.create({
                                                                      duid: mydevice.source_uid,
                                                                      userid: mydevice.userid,
                                                                      siteid: mydevice.siteid,
                                                                      duration: data.elapsedTime,
                                                                      startingduration: 0,
                                                                      datetaken: myDateTaken
                                                                  }).then(()=>{
                                                                      GenDevice.update(
                                                                         {status: 1},
                                                                         {
                                                                            where:{duid:mydevice.source_uid}
                                                                         }
                                                                      ).then(()=>{
                                                                          resolve({status:20,device:mydevice});
                                                                      }).catch(err=>{
                                                                         console.log(err);
                                                                      })
                                                                  })
                                                                  
                                                              }
                                                          })
                                                      }
                                                      else{
                                                         resolve({status:20,device:mydevice});
                                                      }
                                                     
                                               });
                                               
                                           })
                                           
                                       }
                                       
                                   }
                               })
                             
                             
                         });
                         
                	 }
                	 else{
                        reject({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });
          });
        
    }
    
    

    static getLastOnnPhcnDevice(data){
        return new Promise(function(resolve,reject){
              var myrawdate = new Date();
              var myDateTaken = myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate();
                      
              Phcnontime.findOne({
                  where:{
                      duid: data.duid,
                      status: 1,
                      datetaken:myDateTaken,
                  },
                  order: [
                      ['id', 'DESC']
                  ]
              }).then(myresp=>{
                  if(myresp){
                      console.log(myresp, ' getting last powertime 555555555555555555555555555555555555555555555');
                      resolve(myresp);
                  }
                  else{
                      
                      myDateTaken = myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate();
                      var mydateTime = myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()+' '+myrawdate.getHours()+':'+myrawdate.getMinutes()+':'+myrawdate.getSeconds();
                      console.log(mydateTime, ' creating last powertime 444444444444444444444444444444444444444444444444');
                      
                      Phcnontime.update(
                           {
                             status: 0
                           },
                           {
                             where:{
                                 duid: data.duid
                             }
                           }
                       ).then(()=>{
                           
                           Phcnontime.create({
                              duid: data.duid,
                              starttime: mydateTime,
                              datetaken:myDateTaken,
                              runtime: 0,
                              status: 1
                          }).then(resp=>{
                              resolve(resp);
                          }).catch(err=>{
                             console.log(err);
                          })  
                       }).catch(err=>{
                         console.log(err);
                       })  
                      
                                     
     
                  }
              }).catch(err=>{
                  reject(err);
              })
         });
    }
    
    static getTotalDeviceConsumption(data){
         return new Promise(function(resolve,reject){
              PhcnDeviceData.findAll({
                  where:{
                      duid: data.duid
                  },
                  attributes: ['duid',[sequelize.fn('sum', sequelize.col('activeenergy')), 'totalactiveenergy'],[sequelize.fn('sum', sequelize.col('reactiveenergy')), 'totalreactiveenergy']],
                  group : ['PhcnDeviceData.duid'],
                  raw: true
              }).then(myresp=>{
                  if(myresp.length > 0){
                      resolve(myresp);
                  }
                  else{
                      resolve([{duid:data.duid,totalactiveenergy:0,totalreactiveenergy:0}]);
                  }
                  
              }).catch(err=>{
                  console.log(err);
                  resolve([{duid:data.duid,totalactiveenergy:0,totalreactiveenergy:0}]);
              })
         });
    }



    static savePowerOnn(data){
          return new Promise(function(resolve,reject){
                 PhcnDevice.findOne({
                	where:{
                		duid: data.duid
                	}
                 }).then(mydevice=>{
                	 if(mydevice){
                	     
                         var myrawdate = new Date();
                         
                         myrawdate.setSeconds( myrawdate.getSeconds() - (data.elapsedTime/1));
                	       
                	     var myDateTaken = myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate();
                	     var mydateTime = myrawdate.getFullYear()+"-"+(myrawdate.getMonth()+1)+"-"+myrawdate.getDate()+' '+myrawdate.getHours()+':'+myrawdate.getMinutes()+':'+myrawdate.getSeconds();
                	     
                	     
                	     console.log(mydateTime, ' saving powertime 888888888888888888888888888888888888888888888888888888');
                	    
                	     PhcnDeviceData.findOne({
                               where:{
                                   duid: data.duid,
                                   datetaken:myDateTaken
                               }
                         }).then(mydevicedata=>{
                               if(mydevicedata){
                                      var myuptime = mydevicedata.uptime; // previously saved uptime
                                      PhcnDevice.update(
                                          {
                                            powerstatus: data.voltagea > 10 || data.voltageb > 10 || data.voltagec > 10 ? 1 : 0,
                                            status: data.voltagea > 10 || data.voltageb > 10 || data.voltagec > 10 ? 1 : 0,
                                            consumptionkw: data.activePower,
                                            activepower: data.activePower,
                                            consumptionkva: data.reactivePower,
                                            voltagea: data.voltagea,
                                            voltageb: data.voltageb,
                                            voltagec: data.voltagec,
                                            currenta: data.currenta,
                                            currentb: data.currentb,
                                            currentc: data.currentc,
                                            powerfactora: data.powerFactora,
                                            powerfactorb: data.powerFactorb,
                                            powerfactorc: data.powerFactorc,
                                            frequency: data.frequency,
                                            previousuptime: mydevicedata.uptime,
                                            sumactiveenergy: data.sumactiveenergy,
                                            totalactiveenergy: data.totalActiveEnergy,
                                            lastuptime: mydateTime
                                          },
                                          {
                                            where:{
                                              duid: data.duid 
                                            }  
                                          }
                                         ).then(()=>{
                                               console.log(myDateTaken+' '+data.duid, ' saving powertime 888888888888888888888888888888888888888888888888888888');
                                               PhcnDeviceData.update(
                                                 {
                                                    consumptionkw: data.totalActivePower,
                                                    activepower: data.totalActivePower,
                                                    consumptionkva: data.totalReactivePower,
                                                    activeenergy :(mydevicedata.activeenergy/1 + data.totalActiveEnergy/1),
                                                    reactiveenergy : (mydevicedata.reactiveenergy/1 + data.totalReactiveEnergy/1),
                                                    cost: (mydevicedata.cost/1 + data.cost/1),
                                                    lastuptime: mydateTime
                                                 },
                                                 {
                                                   where:{
                                                       duid: data.duid,
                                                       datetaken:myDateTaken
                                                   }
                                                 }
                                               ).then(()=>{
                                                   Phcnontime.update(
                                                       {
                                                         status: 0
                                                       },
                                                       {
                                                         where:{
                                                             duid: data.duid
                                                         }
                                                       }
                                                   ).then(()=>{
                                                       
                                                       Phcnontime.create({
                                                          duid: data.duid,
                                                          starttime: mydateTime,
                                                          datetaken:myDateTaken,
                                                          runtime: myuptime,
                                                          status: 1
                                                      }).then(resp=>{
                                                          console.log(' saving powertime 999999999999999999999999999999999999999999999999999999999999999999999999999999999999');
                                                          if(mydevice.source_type == 2){
                                                              RunTime.findOne({
                                                                  where:{
                                                                      duid:mydevice.source_uid,
                                                                      datetaken: myDateTaken
                                                                  }
                                                              }).then(myRunTime=>{
                                                                  if(myRunTime){
                                                                      console.log(' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                      RunTime.update(
                                                                          {duration: (data.elapsedTime/1)},
                                                                          {
                                                                              where:{
                                                                                  duid:mydevice.source_uid,
                                                                                  datetaken: myDateTaken
                                                                              }
                                                                          }
                                                                      ).then(()=>{
                                                                          GenDevice.update(
                                                                             {status: 1},
                                                                             {
                                                                                where:{duid:mydevice.source_uid}
                                                                             }
                                                                          ).then(()=>{
                                                                              resolve({status:20,device:mydevice});
                                                                          }).catch(err=>{
                                                                             console.log(err);
                                                                          })
                                                                      })
                                                                  }
                                                                  else{
                                                                      
                                                                      console.log(' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                      RunTime.create({
                                                                          duid: mydevice.source_uid,
                                                                          userid: mydevice.userid,
                                                                          siteid: mydevice.siteid,
                                                                          duration: data.elapsedTime,
                                                                          startingduration: 0,
                                                                          datetaken: myDateTaken
                                                                      }).then(()=>{
                                                                          GenDevice.update(
                                                                             {status: 1},
                                                                             {
                                                                                where:{duid:mydevice.source_uid}
                                                                             }
                                                                          ).then(()=>{
                                                                              resolve({status:20,device:mydevice});
                                                                          }).catch(err=>{
                                                                             console.log(err);
                                                                          })
                                                                      })
                                                                      
                                                                  }
                                                              })
                                                          }
                                                          else{
                                                             resolve({status:20,device:mydevice});
                                                          }
                                                      }).catch(err=>{
                                                         console.log(err);
                                                      }) 
                                                   }).catch(err=>{
                                                     console.log(err);
                                                   })    
                                                   
                                               }).catch(err=>{
                                                 console.log(err);
                                               }) 
                                             
                                             
                                         }).catch(err=>{
                                             console.log(err);
                                         }) 
                                       
                                       
                                       
                                   }
                                   else{
                                       
                                        PhcnDevice.update(
                                          {
                                            powerstatus: data.voltagea > 10 || data.voltageb > 10 || data.voltagec > 10 ? 1 : 0,
                                            status: data.voltagea > 10 || data.voltageb > 10 || data.voltagec > 10 ? 1 : 0,
                                            consumptionkw: data.activePower,
                                            activepower: data.activePower,
                                            consumptionkva: data.reactivePower,
                                            voltagea: data.voltagea,
                                            voltageb: data.voltageb,
                                            voltagec: data.voltagec,
                                            currenta: data.currenta,
                                            currentb: data.currentb,
                                            currentc: data.currentc,
                                            powerfactora: data.powerFactora,
                                            powerfactorb: data.powerFactorb,
                                            powerfactorc: data.powerFactorc,
                                            frequency: data.frequency,
                                            previousuptime: 0,
                                            lastuptime: mydateTime,
                                            sumactiveenergy: data.sumactiveenergy,
                                            totalactiveenergy: data.totalActiveEnergy
                                          },
                                          {
                                            where:{
                                              duid: data.duid 
                                            }  
                                          }
                                         ).then(()=>{
                                               
                                              PhcnDeviceData.create({
                                                    userid: mydevice.userid,
                                                    siteid: mydevice.siteid,
                                                    duid: mydevice.duid,
                                                    consumptionkw: data.totalActivePower,
                                                    activepower: data.totalActivePower,
                                                    consumptionkva: data.totalReactivePower,
                                                    activeenergy :data.totalActiveEnergy,
                                                    reactiveenergy :data.totalReactiveEnergy,
                                                    device_type: mydevice.source_type == 2 ? 1 : 2,
                                                    uptime: 0,
                                                    lastuptime: mydateTime,
                                                    datetaken: myDateTaken
                                               }).then(()=>{
                                                   Phcnontime.update(
                                                       {
                                                         status: 0
                                                       },
                                                       {
                                                         where:{
                                                             duid: data.duid
                                                         }
                                                       }
                                                   ).then(()=>{
                                                       console.log(' creating onn time now  900000000000000000000000000000000000000');
                                                       Phcnontime.create({
                                                          duid: data.duid,
                                                          starttime: mydateTime,
                                                          datetaken:myDateTaken,
                                                          runtime: 0,
                                                          status: 1
                                                      }).then(resp=>{
                                                          if(mydevice.source_type == 2){
                                                              RunTime.findOne({
                                                                  where:{
                                                                      duid:mydevice.source_uid,
                                                                      datetaken: myDateTaken
                                                                  }
                                                              }).then(myRunTime=>{
                                                                  if(myRunTime){
                                                                      console.log( ' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                      RunTime.update(
                                                                          {duration: (data.elapsedTime/1)},
                                                                          {
                                                                            where:{
                                                                                duid:mydevice.source_uid,
                                                                                datetaken: myDateTaken
                                                                            }
                                                                          }
                                                                      ).then(()=>{
                                                                          GenDevice.update(
                                                                             {status: 1},
                                                                             {
                                                                                where:{duid:mydevice.source_uid}
                                                                             }
                                                                          ).then(()=>{
                                                                              resolve({status:20,device:mydevice});
                                                                          }).catch(err=>{
                                                                             console.log(err);
                                                                          })
                                                                      })
                                                                  }
                                                                  else{
                                                                      
                                                                      console.log(' saving run time 1111111111111111111111111111111111111111111111111111111111111111111111');
                                                                      RunTime.create({
                                                                          duid: mydevice.source_uid,
                                                                          userid: mydevice.userid,
                                                                          siteid: mydevice.siteid,
                                                                          duration: data.elapsedTime,
                                                                          startingduration: 0,
                                                                          datetaken: myDateTaken
                                                                      }).then(()=>{
                                                                          GenDevice.update(
                                                                             {status: 1},
                                                                             {
                                                                                where:{duid:mydevice.source_uid}
                                                                             }
                                                                          ).then(()=>{
                                                                              resolve({status:20,device:mydevice});
                                                                          }).catch(err=>{
                                                                             console.log(err);
                                                                          })
                                                                      })
                                                                      
                                                                  }
                                                              })
                                                          }
                                                          else{
                                                             resolve({status:20,device:mydevice});
                                                          }
                                                      }).catch(err=>{
                                                         console.log(err);
                                                      }) 
                                                   }).catch(err=>{
                                                     console.log(err);
                                                   })
                                                   
                                               }).catch(err=>{
                                                 console.log(err);
                                               }) 
                                             
                                             
                                         }).catch(err=>{
                                           console.log(err);
                                         }) 
                                       
                                   }
                             }).catch(err=>{
                                console.log(err)
                             })
                	     
                	             
                	     
                	 }
                	 else{
                        reject({status:70,device:{}});
                	 }
                 }).catch(err=>{
                     reject({status:71,device:err});
                 });
          });
        
    }
    
    
    
    
    
	 
    

   
	 
}


module.exports = ApiController;