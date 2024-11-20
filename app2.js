
var net = require('net');
var ApiController = require('./controller/ApiController');
var OmejeBuffer = require('./controller/OmejeBuffer');

/*Device heads*/
var serverHead = "4040";
var deviceHead = "2424";
/*End communication Heads*/


/*Device Commands*/
  var heartBeat = "7980";
  var tankHeartBeat = "7981";
  var turnOnn = "7940";
  var turnOff = "7941";
  var deviceData = "7942";
  var tankGaugeData = "7966";
  var powerData = "7967";
  var powerOnn = "7968";
  var outputControl = "7943";
  var setDeviceTime = "7944";
  var deviceLogin = "7945";
  var fuelCon = "7950";
/*End Device Commands*/





var deviceClents = [];



setInterval(()=>{
    
    ApiController.checkActivePhcnDevices().then(myresponse=>{
          console.log("turning off device");
    }).catch(err=>{
          console.log(err);
    })
    
},6000);

var server = net.createServer(function(connection) {
    console.log('new connection');
    
    connection.on('error', function(error){
         console.log(error);
    });

    connection.on('data', function(data) {

        var tData = new Buffer(data);
        var dHead = new Buffer(tData.slice(0,2));
        console.log(data);
        console.log(dHead);

        if(dHead.toString('hex') == deviceHead && tData.length > 14){
            
               console.log("Data from device");
               console.log(data);

               var mainDataLength = tData.length - 4;
               var dataWithCrcLength = tData.length - 2;
              
               var mainData = new Buffer(tData.slice(4,(mainDataLength)));
               var mainDataWithCrc = new Buffer(tData.slice(4,(dataWithCrcLength)));
               var crcData = new Buffer(tData.slice(0,(mainDataLength)));

               
               var dLength = new Buffer(tData.slice(2,4));
               var deviceId = new Buffer(tData.slice(4,18));
               var command = new Buffer(tData.slice(18,20));
               var checksum = new Buffer(tData.slice((tData.length -4),(tData.length - 2)));
               console.log(command);

               if(command.toString('hex') == deviceLogin){
                    console.log("Device login \n");
                    ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){
                            
                            var client = {
                                id: deviceId.toString(),
                                socket: connection
                            }


                            var isConnectionSaved = deviceClents.find(x=>x.id == deviceId.toString());

                            if(isConnectionSaved){
                                 deviceClents.push(client);
                            }
                            
                            var mydate = new Date();
                            var myyear = mydate.getFullYear();
                            var mydateset = '|'+mydate.getSeconds()+'|'+mydate.getMinutes()+'|'+(mydate.getHours()+ 1)+'|'+mydate.getDate()+'|'+(mydate.getMonth()+1)+'|'+myyear+'|';
                            var hexDate = OmejeBuffer.stringToHexString(mydateset);
                            var mydatalength = 22 + mydateset.length;
                            
                            console.log(mydateset);
                            var LL = mydatalength && 0x00FF;
                            var LH = mydatalength >> 8;
                            
                            LLString = Number(LL).toString(16);
                            LHString = Number(LH).toString(16);
                            
                            LHString = LHString.length > 1 ? LHString : "0"+LHString;
                            LLString = LLString.length > 1 ? LLString : "0"+LLString;
                            
                            
                            var outData =  serverHead.toString('hex')+LHString+LLString+deviceId.toString('hex')+command.toString('hex')+"01"+hexDate+"2424"+"040a";
                            console.log(OmejeBuffer.hexToBuffer(outData));
                            connection.write(OmejeBuffer.hexToBuffer(outData)); 
                         }
                         else{

                            var outData =  serverHead.toString('hex')+"0017"+deviceId.toString('hex')+command.toString('hex')+"00"+"2424"+"040a";
                            console.log(OmejeBuffer.hexToBuffer(outData));
                            connection.write(OmejeBuffer.hexToBuffer(outData));

                         }

                    }).catch(err=>{
                        console.log(err);
                    })

               }
               else if(command.toString('hex') == heartBeat){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  timetaken: mydateArray[0],
                                  datetaken: mydateArray[1],
                                  timeelapsed: mydateArray[2],
                                  devicestatus: mydateArray[3],
                              };
                              
                              console.log(dataObject);

                              ApiController.saveDeviceData(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
                   
               }
               else if(command.toString('hex') == tankHeartBeat){
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                       if(myresp.status == 20){

                            //"1|"+String(getBatteryLevel())+"|"+String(getTankHeight())+"|"+String(getDateOnly())+"|"+String(getTimeOnly());
                            var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                            console.log(datedata.toString());
                            var mydateArray = datedata.toString().split("|");
                            var datetaken = mydateArray[3].split("/");
                            var myowndate = datetaken[2]+'-'+datetaken[1]+'-'+datetaken[0];
                            var dataObject = {
                                duid: deviceId.toString(),
                                status: mydateArray[0],
                                voltage: mydateArray[1],
                                gauge: mydateArray[2],
                                datetaken: myowndate,
                                timetaken: mydateArray[4]
                            };
                            
                            console.log(dataObject);

                            ApiController.saveTankStatus(dataObject).then(myresponse=>{
                                  //console.log(myresponse);
                            }).catch(err=>{
                                  console.log(err);
                            })

                       }
                  }).catch(err=>{
                      console.log(err);
                  })
               }
               else if(command.toString('hex') == tankGaugeData){
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var datetaken = mydateArray[3].split("/");
                              var myowndate = datetaken[2]+'-'+datetaken[1]+'-'+datetaken[0];
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  status: mydateArray[0],
                                  voltage: mydateArray[1],
                                  gauge: mydateArray[2],
                                  datetaken: myowndate,
                                  timetaken: mydateArray[4]
                              };
                              
                              console.log(dataObject);

                              ApiController.saveTankGauge(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == turnOnn){

                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                            

                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  timetaken: mydateArray[0],
                                  datetaken: mydateArray[1],
                                  timeelapsed: mydateArray[2],
                                  devicestatus: mydateArray[3],
                              };
                              
                              console.log(dataObject);

                              ApiController.saveOnnTime(dataObject).then(myresponse=>{
                                    console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })

               }
               else if(command.toString('hex') == turnOff){

                    ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                               

                              var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  timetaken: mydateArray[0],
                                  datetaken: mydateArray[1],
                                  timeelapsed: mydateArray[2],
                                  devicestatus: mydateArray[3],
                              };
                              
                              console.log(dataObject);

                              ApiController.saveOffTime(dataObject).then(myresponse=>{
                                    console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })

               }
               else if(command.toString('hex') == powerData){

                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                            ApiController.getLastOnnPhcnDevice({duid:deviceId}).then(myphon=>{
                                
                                    var myrawdate = new Date();
                                    
                                    var dateOnn = new Date(myphon.starttime);
                                    
                                    console.log(myphon.starttime);
                                    
                                    console.log(myrawdate);
                                    console.log(dateOnn);
                                    
                                    
                                    
                                    
                                    
                                    var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                                    console.log(datedata.toString());
                                    var mydateArray = datedata.toString().split("|");
                                    
                                    var runtime = 0;
                                    
                                    if((mydateArray[10]/1) > 0){ // if no voltage is sensed, it means the generator is not running
                                        
                                         var runtime = myrawdate.getTime() - dateOnn.getTime();
                                    
                                         runtime = (runtime/1) + (myphon.runtime/1); //add current uptime to previous uptime
                                        
                                    }
                                    else{
                                        runtime = (myresp.device.previousuptime/1);
                                    }
                                    
                                     ApiController.getTotalDeviceConsumption({duid:deviceId}).then(myCumDatat=>{
                                         
                                            
                                            
                                            console.log(myCumDatat[0]);
                                            
                                            
                                           
                                            var totalActiveEnergy = (mydateArray[14]/1) - (myCumDatat[0].totalactiveenergy/1);
                                            var totalReactiveEnergy = (mydateArray[15]/1) - (myCumDatat[0].totalreactiveenergy/1);
                                            var vat = parseFloat(myresp.device.vat); // get the vat set in the device
                                            var cost_per_kwh = parseFloat(myresp.device.cost_per_kwh); // get the cost perkwh set in the device
                                           
                                            var dataObject = {
                                                duid: deviceId.toString(),
                                                source_uid:myresp.device.source_uid,
                                                source_type:myresp.device.source_type,
                                                frequency: mydateArray[0],
                                                voltagea: mydateArray[1],
                                                voltageb: mydateArray[2],
                                                voltagec: mydateArray[3],
                                                currenta: mydateArray[4],
                                                currentb: mydateArray[5],
                                                currentc: mydateArray[6],
                                                powerFactora: mydateArray[7],
                                                powerFactorb: mydateArray[8],
                                                powerFactorc: mydateArray[9],
                                                activePower: (mydateArray[10]/1) * 1000,
                                                reactivePower: mydateArray[11],
                                                totalActivePower: mydateArray[12],
                                                totalReactivePower: mydateArray[13],
                                                totalActiveEnergy: totalActiveEnergy,
                                                totalReactiveEnergy: totalReactiveEnergy,
                                                elapsedTime: runtime,//mydateArray[10],
                                                sumactiveenergy: (mydateArray[14]/1),
                                                date: mydateArray[16],
                                                time: mydateArray[17],
                                                vat: vat,
                                                cost: cost_per_kwh
                                            };
                                              
                                              
                                              console.log(dataObject);
                                              
                                              if(myresp.device.source_type == 2){
                                                  
                                                  
                                                  ApiController.saveProfile(dataObject).then(()=>{
                                                      ApiController.saveGenPowerData(dataObject).then(myresponse=>{
                                                            console.log("saveing data 00000000000000000000000000000000000000000");
                                                            ApiController.savePowerData(dataObject).then(myresponse=>{
                                                               //console.log(myresponse);
                                                            }).catch(err=>{
                                                               console.log(err);
                                                            });
                                                      }).catch(err=>{
                                                         console.log(err);
                                                      });
                                                  })
                                              }
                                              else{
                                                  
                                                  
                                                  ApiController.saveProfile(dataObject).then(()=>{
                                                      ApiController.savePowerData(dataObject).then(myresponse=>{
                                                          console.log("saveing data 00000000000000000000000000000000000000000");
                                                         //console.log(myresponse);
                                                      }).catch(err=>{
                                                         console.log(err);
                                                      }); 
                                                  })
                                              }
                                         
                                     }).catch(err=>{
                                         console.log(err);
                                     });

                            });

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == powerOnn){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){
                             
                             
                             ApiController.getTotalDeviceConsumption({duid:deviceId}).then(myCumDatat=>{
                                        
                                  console.log(myCumDatat[0]);
                                  
                                  
                                  var datedata = new Buffer(tData.slice(20,(mainDataLength)));
                                  console.log(datedata.toString());
                                  var mydateArray = datedata.toString().split("|");
                                  
                                
                                  var totalActiveEnergy = (mydateArray[14]/1) - (myCumDatat[0].totalactiveenergy/1);
                                  
                                  var totalReactiveEnergy = (mydateArray[15]/1) - (myCumDatat[0].totalreactiveenergy/1);
                                  var vat = parseFloat(myresp.device.vat); // get the vat set in the device
                                  var cost_per_kwh = parseFloat(myresp.device.cost_per_kwh); // get the cost perkwh set in the device
                                  var electricity_cost = totalActiveEnergy * cost_per_kwh;
                                  var consumption_cost = (electricity_cost/1) + (electricity_cost * vat);
                                 
                                  var dataObject = {
                                      duid: deviceId.toString(),
                                      source_uid:myresp.device.source_uid,
                                      source_type:myresp.device.source_type,
                                      frequency: mydateArray[0],
                                      voltagea: mydateArray[1],
                                      voltageb: mydateArray[2],
                                      voltagec: mydateArray[3],
                                      currenta: mydateArray[4],
                                      currentb: mydateArray[5],
                                      currentc: mydateArray[6],
                                      powerFactora: mydateArray[7],
                                      powerFactorb: mydateArray[8],
                                      powerFactorc: mydateArray[9],
                                      activePower: (mydateArray[10]/1) * 1000,
                                      reactivePower: mydateArray[11],
                                      totalActivePower: mydateArray[12],
                                      totalReactivePower: mydateArray[13],
                                      totalActiveEnergy: totalActiveEnergy,
                                      totalReactiveEnergy: totalReactiveEnergy,
                                      elapsedTime: 0,
                                      sumactiveenergy: (mydateArray[14]/1),
                                      date: mydateArray[16],
                                      time: mydateArray[17],
                                      vat: vat,
                                      cost: consumption_cost
                                  };
                                  
                                  
                                  console.log(dataObject);
                                  
                                  if(myresp.device.source_type == 2){
                                      ApiController.saveProfile(dataObject).then(()=>{
                                          ApiController.saveGenPowerData(dataObject).then(myresponse=>{
                                              console.log("saveing data 00000000000000000000000000000000000000000")
                                              ApiController.savePowerOnn(dataObject).then(myresponse=>{
                                                  //console.log(myresponse);
                                              }).catch(err=>{
                                                  console.log(err);
                                              }); 
                                          }).catch(err=>{
                                              console.log(err);
                                          }); 
                                      })
                                      
                                  }
                                  else{
                                      
                                      ApiController.saveProfile(dataObject).then(()=>{
                                          ApiController.savePowerOnn(dataObject).then(myresponse=>{
                                              console.log("saveing data 00000000000000000000000000000000000000000")
                                              //console.log(myresponse);
                                          }).catch(err=>{
                                              console.log(err);
                                          });
                                      })
                                       
                                  }
                                
                            }).catch(err=>{
                                console.log(err);
                            });

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == deviceData){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(21,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  runtime: mydateArray[0],
                                  status: mydateArray[1]
                              };

                              ApiController.saveDeviceData(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               else if(command.toString('hex') == fuelCon){
                   
                   ApiController.loginDevice({duid:deviceId}).then(myresp=>{
                         if(myresp.status == 20){

                              
                              var datedata = new Buffer(tData.slice(21,(mainDataLength)));
                              console.log(datedata.toString());
                              var mydateArray = datedata.toString().split("|");
                              var dataObject = {
                                  duid: deviceId.toString(),
                                  voltage: mydateArray[1],
                                  gauge: mydateArray[0]
                              };

                              ApiController.saveDeviceFuelCon(dataObject).then(myresponse=>{
                                    //console.log(myresponse);
                              }).catch(err=>{
                                    console.log(err);
                              })

                         }
                    }).catch(err=>{
                        console.log(err);
                    })
               }
               

        }
        else if(dHead.toString('hex') == serverHead && tData.length > 14){

               console.log("Data from server");
               console.log(data);

               var mainDataLength = tData.length - 4;
               var dataWithCrcLength = tData.length - 2;
              
               var mainData = new Buffer(tData.slice(4,(mainDataLength)));
               var mainDataWithCrc = new Buffer(tData.slice(4,(dataWithCrcLength)));
               var crcData = new Buffer(tData.slice(0,(mainDataLength)));

               
               var dLength = new Buffer(tData.slice(2,4));
               var deviceId = new Buffer(tData.slice(4,18));
               var command = new Buffer(tData.slice(18,20));
               var checksum = new Buffer(tData.slice((tData.length -4),(tData.length - 2)));
               console.log(command);

               if(command.toString('hex') == outputControl){
                   var sentControl = new Buffer(tData.slice(21,(mainDataLength)));
                   var outData =  serverHead.toString('hex')+"0017"+deviceId.toString('hex')+sentControl.toString('hex')+"00"+"2424"+"040a";
                   console.log(OmejeBuffer.hexToBuffer(outData));

                    var myclient = deviceClents.find(x=>x.id == deviceId.toString());

                    if(myclient){
                        myclient.socket.write(OmejeBuffer.hexToBuffer(outData));
                    }

               }
               else if(command.toString('hex') == setDeviceTime){
                   var sentControl = new Buffer(tData.slice(21,(mainDataLength)));
                   var outData =  serverHead.toString('hex')+"0017"+deviceId.toString('hex')+sentControl.toString('hex')+"00"+"2424"+"040a";
                   console.log(OmejeBuffer.hexToBuffer(outData));

                    var myclient = deviceClents.find(x=>x.id == deviceId.toString());

                    if(myclient){
                        myclient.socket.write(OmejeBuffer.hexToBuffer(outData));
                    }
               }

        }

       
    })
  
   connection.pipe(connection);

})



server.listen(9000, function() { 
   console.log('server is listening to %j', server.address().port);
});