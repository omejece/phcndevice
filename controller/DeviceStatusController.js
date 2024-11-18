
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
const Site = require('../models').Site;
var uniqid = require('uniqid');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

let sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = {
    
       offGenDevice: (data)=>{
          return new Promise((resolve,reject)=>{
              
              var foundDevice = data;
              
              if(foundDevice.status == 1){
                  
                   GenDevice.findOne({
                      where:{
                         duid: foundDevice.source_uid
                      }
                  }).then(myGenDevice=>{
                      if(myGenDevice){
                          
                          console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 1 888888888888888888888888888888888888888888888888888888888888888888888");
                           GenDevice.update(
                               {
                                    status: 0,
                                    frequency: 0,
                                    voltage: 0,
                                    voltagea: 0,
                                    voltageb: 0,
                                    voltagec: 0,
                                    currenta: 0,
                                    currentb: 0,
                                    currentc: 0,
                                    powerfactora: 0,
                                    powerfactorb: 0,
                                    powerfactorc: 0,
                                    activepower: 0,
                                    reactivepower: 0
                               },
                               {
                                where:{
                                   duid: foundDevice.source_uid
                                }
                               }
                           ).then(()=>{
                               
                                 console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 3 888888888888888888888888888888888888888888888888888888888888888888888");
                                 PhcnDevice.update(
                                      {
                                        status:0,
                                        powerstatus:0,
                                        consumptionkw:0,
                                        activepower: 0,
                                        consumptionkva:0,
                                        voltagea:0,
                                        voltageb:0,
                                        voltagec:0,
                                        currenta:0,
                                        currentb:0,
                                        currentc:0,
                                        powerfactora:0,
                                        powerfactorb:0,
                                        powerfactorc:0,
                                        frequency:0
                                      },
                                      {
                                        where:{duid:foundDevice.duid}
                                      }
                                  ).then(()=>{
                                         
                                         if(myGenDevice.status == 1){
                                    
                                             console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 2 888888888888888888888888888888888888888888888888888888888888888888888");
                                             var offTime = new Date ();
                                             var myTime = offTime.getTime() + 510000;
                                             var myDateTime = new Date(myTime);
                                             var myDate = myDateTime.getFullYear()+'-'+(myDateTime.getMonth() + 1)+'-'+myDateTime.getDate();
                                             var myTime = myDateTime.getHours() +':'+myDateTime.getMinutes()+':'+myDateTime.getSeconds();
                                             Genofftime.create({
                                                userid: myGenDevice.userid,
                                                duid: myGenDevice.duid,
                                                timetaken: myTime,
                                                datetaken: myDate
                                             }).then(()=>{
                                                 console.log("999999999999999999999999999999999999999999999999999999999999999999 success see 99999999999999999999999999999999999999999999999999999999999");
                                                 resolve('success');
                                             }).catch(err=>{
                                                 console.log("999999999999999999999999999999999999999999999999999999999999999999 error see 99999999999999999999999999999999999999999999999999999999999");
                                                 console.log(err);
                                                 reject(err);
                                             });     
                                
                                    
                                         }
                                       
                                      
                                   }).catch(err=>{
                                     console.log("9101010101010101010101010101101010 error see 99999999999999999999999999999999999999999999999999999999999");
                                     console.log(err);
                                     reject(err);
                                 });  
                                
                               
                           }).catch(err=>{
                             console.log("999999999999999999999999999999999999999999999999999999999999999999 error see 99999999999999999999999999999999999999999999999999999999999");
                             console.log(err);
                             reject(err);
                          });   
                          
                      } 
                  }).catch(err=>{
                     console.log("999999999999999999999999999999999999999999999999999999999999999999 error see 99999999999999999999999999999999999999999999999999999999999");
                     console.log(err);
                     reject(err);
                 });   
                  
              }
              else{
                   resolve('device is off');
              }
              
          })
      },
    
     
      offNepaDevice: (data)=>{
          
          var foundDevice = data;
          return new Promise((resolve,reject)=>{
              
               if(foundDevice.status == 1){
                   
                       console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 3 888888888888888888888888888888888888888888888888888888888888888888888");
                                   
                       PhcnDevice.update(
                          {
                            status:0,
                            powerstatus:0,
                            consumptionkw:0,
                            activepower: 0,
                            consumptionkva:0,
                            voltagea:0,
                            voltageb:0,
                            voltagec:0,
                            currenta:0,
                            currentb:0,
                            currentc:0,
                            powerfactora:0,
                            powerfactorb:0,
                            powerfactorc:0,
                            frequency:0
                          },
                          {
                            where:{duid:foundDevice.duid}
                          }
                       ).then(()=>{
                             
                                    
                                 console.log("8888888888888888888888888888888888888888888888888888888888888888888888 checking off 4 888888888888888888888888888888888888888888888888888888888888888888888");
                                 var offTime = new Date ();
                                 var myTime = offTime.getTime() - 510000;
                                 var myDateTime = new Date(myTime);
                                 var myDate = myDateTime.getFullYear()+'-'+(myDateTime.getMonth() + 1)+'-'+myDateTime.getDate();
                                 var myTime = myDateTime.getHours() +':'+myDateTime.getMinutes()+':'+myDateTime.getSeconds();
                                 Phcnofftime.create({
                                    userid: foundDevice.userid,
                                    duid: foundDevice.duid,
                                    timetaken: myTime,
                                    datetaken: myDate
                                 }).then(()=>{
                                     resolve('success');
                                 });
                                
                            
                          
                       });
                  
               }
               else{
                   resolve('device is off');
               }
              
              
          })
      },
    
}






