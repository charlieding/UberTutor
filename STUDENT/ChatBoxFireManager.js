

var ChatBoxUti={
  GenSortedChatUID:function(tutorID, studentID){
          if(tutorID===studentID) return alert("err: self chat not allowed");
          var ret={};
          ret.tutorID=tutorID;
          ret.studentID=studentID;

          var arr=[tutorID, studentID];
          arr.sort();
          console.log(arr);
          ret.sortedUidArr=arr; 
          ret.sortedChatUid=arr.join("_");

          return ret; 
  },
  SetCurrentUserID:function(ret, currentUserID){
          ret.currUserID=currentUserID;
          ret.ownerIdIndx=ret.sortedUidArr.indexOf(currentUserID);
          if(ret.ownerIdIndx<0) return alert("not find:"+currentUserID);
          ret.targetIdIndx=0;
          if(ret.ownerIdIndx===0){
             ret.targetIdIndx=1;
          };
          ret.targetUserID=ret.sortedUidArr[ret.targetIdIndx];
  },  
};

function GenChatBoxInfo(){
        var usrsObj=null;
        var ret={};

        this.Init=function(tutorID, studentID, currentUserID){
          ret = ChatBoxUti.GenSortedChatUID(tutorID, studentID);
          ChatBoxUti.SetCurrentUserID(ret,currentUserID);
        };
        this.setUsersObj=function(UsrsObj){
          usrsObj=UsrsObj;
        };
        this.UpdateInfo=function(){
          if(!usrsObj) return alert("usrsObj null");             
          if(!ret.sortedUidArr.length) return alert("sortedUidArr null");   
        };
        this.getUsersObj=function(){
          return usrsObj;
        };
        this.data=function(){
          return ret;
        };
        this.getUser=function(ownerIdIndx){
          if(!usrsObj) return alert("usrsObj null");
          var uid=ret.sortedUidArr[ownerIdIndx];
          return usrsObj[uid];
        };
        this.getSides=function(ownerIdIndx){
          var boxsides=["left","right"];
          if( ret.currUserID === ret.sortedUidArr[ownerIdIndx]){
            boxsides=["right","left"];
          };
          return boxsides;
        };
        this.getTargetName=function(){
          if(ret.sortedUidArr.length===0) return alert("ret.sortedUidArr null");
          var uid=ret.sortedUidArr[ret.targetIdIndx];
          if(!usrsObj || !usrsObj[uid]) return alert("Something went wrong. Please refresh and try again."); //usrsObj not readu yet
          return usrsObj[uid].displayName;
        };
        this.getUid=function(MsgSnderIdIndx){
          if(ret.sortedUidArr.length==0) return alert("ret.sortedUidArr null");
          return ret.sortedUidArr[MsgSnderIdIndx];
        };
};/////////////


var ChatBoxFireManager=function(){
      var chatRef = new Firebase("https://ubertutoralpha.firebaseio.com/chat/"); 
      var usersObj=null;//global

      var chatRooms={};

      var chatMsgAddRefs = {};  
      var chatNofiyChangeRefs = {};  
      var chatNofiyAddRefs = {};  

      var chatStats="stats" ;

      //not tested yet.
      function DisconnectChat(chatuid){
        var chatBind = chatMsgAddRefs[sortedChatUid];
        //return;
        //Remove old chat box listener 
        if(chatBind){
          chatRef.off("child_added", chatBind).remove();
          chatMsgAddRefs[sortedChatUid]=null;

          chatRef.off("child_added", chatNofiyChangeRefs[sortedChatUid]).remove();
          chatRef.off("child_added", chatNofiyAddRefs   [sortedChatUid]).remove();  
          
          chatNofiyChangeRefs[sortedChatUid]=null;  
          chatNofiyAddRefs   [sortedChatUid]=null;      
        }
      };
      function FireUsers(){
          if(null===usersObj){
            var usrsRef = new Firebase("https://ubertutoralpha.firebaseio.com/users/");
            usrsRef.once("value",function(snapshot){
                usersObj=snapshot.val();//one time global.
                once_users();
            });              
          }else{
            once_users();
          }
      };
      function once_users(){
        if(null==usersObj) return alert("usersObj is null");
        $.each(chatRooms,function(chatuid,room){
            room.Info.setUsersObj(usersObj);
            FireChatRoom(chatuid);
        });
      };
      function FireChatRoom(chatuid){
        if(undefined === chatRooms[chatuid]){
          return alert(chatuid+" is not added into rooms yet");
        }

        if(options && options.currentChatUid===chatuid){
          if( options.initChatBoxFunc ){
              options.initChatBoxFunc(chatuid);
          }                  
        };           
        if(chatMsgAddRefs[chatuid]){
              if( options && options.currentChatUid===chatuid){              
                chatRef.child(chatuid).child("utc").once("value",on_child_value_msg);
              }                         
              return;
        };

        //load messages via child added
        var chatBind = chatRef.child(chatuid).child("utc").on("child_added",on_child_added_msg);
        chatMsgAddRefs[chatuid]=chatBind;

        //stats fires
        chatNofiyChangeRefs[chatuid]=chatRef.child(chatuid).child(chatStats).on("child_changed",child_changed_msg_stats);
        chatNofiyAddRefs   [chatuid]=chatRef.child(chatuid).child(chatStats).on("child_added",child_changed_msg_stats);        
      }

      function child_changed_msg_stats(snapshot){
        var chatuid=snapshot.ref().parent().parent().key();
        var uidIdx=snapshot.key();
        var count=snapshot.val();
        console.log('child_changed_msg_stats', chatuid,uidIdx,count);
        var chatboxInfo=chatRooms[chatuid].Info;
        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        if(uidIdx===ownerIdIndx){
          console.log("its count is for me.");
          if(callbackfun.notifyStats){
             callbackfun.notifyStats(chatuid, count);
          }
        };
      };

      function on_child_value_msg(snapshot){
        var key=snapshot.ref().parent().key();
        console.log('hi, key',key);
        var val=snapshot.val();
        console.log(val);
        if(null===val) return;
        $.each(val, function(utc,msgObj){
          msgAdded2page(key, utc,msgObj,false);   
        });
      };
      function on_child_added_msg(snapshot){
        var chatUid=snapshot.ref().parent().parent().key();
        var utc = snapshot.key();
        var msgObj = snapshot.val();
        msgAdded2page(chatUid, utc,msgObj,true);  
      };
      function msgAdded2page(chatUid, utc, msgObj, bScroolToView){
        console.log("key="+utc,msgObj, options);

        var chatboxInfo=chatRooms[chatUid].Info;

        var snderIdIndx=msgObj.ownerIdIndx;
        var boxsides=chatboxInfo.getSides(snderIdIndx);
        var snder   =chatboxInfo.getUser(snderIdIndx);
        var snderUid=chatboxInfo.getUid(snderIdIndx);

        var localTime = moment.utc(utc).toDate();
        var datetime  = moment(localTime).format("MMM D hh:mm a"); 

         
        if(callbackfun.on_msg2chatbox){
           callbackfun.on_msg2chatbox(chatUid, datetime, msgObj, snder, boxsides,bScroolToView);
        }
        return;
      };



      this.CloseChatBox=function(chatuid){
        DisconnectChat(chatuid);
      }    




      //api bind to a button.
      this.AddChatRoom=function(tutorID, studentID, currentUserID){
        var ret = ChatBoxUti.GenSortedChatUID(tutorID, studentID);
        if(chatRooms[ret.sortedChatUid]!=undefined){
          return ret.sortedChatUid;
        }
        chatRooms[ret.sortedChatUid]={};
        chatRooms[ret.sortedChatUid].Info=new GenChatBoxInfo();
        chatRooms[ret.sortedChatUid].Info.Init(tutorID, studentID, currentUserID);
        return ret.sortedChatUid;
      };
   
      //api bind to a button.
      var options=null;
      this.FireChatRooms=function(opts){
        if(opts){
          options={};
          options.currentChatUid=opts.currentChatUid;
          options.initChatBoxFunc=opts.initChatBoxFunc;//avoid race         
        };

        FireUsers();
      };      

      this.SendMsg=function(currChatuid, msg){
        var chatboxInfo=chatRooms[currChatuid].Info;
        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        var targetIdIndx=""+chatboxInfo.data().targetIdIndx;


        var utc=moment.utc().format();

        chatRef.child(currChatuid+"/utc/"+utc).set({msg:msg, ownerIdIndx:ownerIdIndx});

        //stats target incremental.
        chatRef.child(currChatuid+"/"+chatStats+"/"+targetIdIndx).transaction(function(count){
          if(count===null){
            return 1;
          }
          return count+1;
        });
      };      
      var callbackfun={};
      this.SetNotifications=function(callbackfunc){
        callbackfun.notifyStats=callbackfunc;
      };
      this.ClearMyStats=function(currChatuid){
        var chatboxInfo=chatRooms[currChatuid].Info;
        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        chatRef.child(currChatuid+"/"+chatStats+"/"+ownerIdIndx).transaction(function(count){          
          console.log("ClearMyStats");
          return 0;
        });
      };

      //api bind to a button.
      this.Set_FireMsg2Chatbox=function(callbackfunc){
        callbackfun.on_msg2chatbox=callbackfunc;
      };

      this.GetChatboxInfo=function(chatuid){
        return chatRooms[chatuid].Info;
      };
};////////////////////////////////////////////