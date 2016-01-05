


var ChatBoxFireManager=function(){


     function GenChatBoxInfo(){
        var usrsObj=null;
        var ret={};
        this.Init=function(tutorID, studentID, currentUserID){
          if(tutorID===studentID) return alert("self chat");
          ret.currUserID=currentUserID;
          ret.tutorID=tutorID;
          ret.studentID=studentID;

          var arr=[tutorID, studentID];
          arr.sort();
          console.log(arr);



          ret.ownerIdIndx=arr.indexOf(currentUserID);
          if(ret.ownerIdIndx<0) return alert("not find:"+currentUserID);
          ret.targetIdIndx=0;
          if(ret.ownerIdIndx===0){
             ret.targetIdIndx=1;
          };
          ret.targetUserID=arr[ret.targetIdIndx];
          ret.sortedChatUid=arr.join("_");

          ret.sortedUidArr=arr;  
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
          return usrsObj[uid].displayName;
        };
        this.getUid=function(MsgSnderIdIndx){
          if(ret.sortedUidArr.length==0) return alert("ret.sortedUidArr null");
          return ret.sortedUidArr[MsgSnderIdIndx];
        };
     };//////////////

      var chatboxInfo=new GenChatBoxInfo();
      var chatBind = null;
      var chatRef = new Firebase("https://ubertutoralpha.firebaseio.com/chat/");   
      var msgChatIdRefObj = {};  
      var chatElemMap = {};  
      var chatStats="stats" ;

      function DisconnectChat(){
        return;
        //Remove old chat box listener 
        if(chatBind){
          chatRef.off("child_added", chatBind);
          delete chatBind;
          delete chatBind;
          chatBind=null;
          chatRef=null;
        }
      };
      function FireUsers(){
          if(null===chatboxInfo.getUsersObj() ){
            var usrsRef = new Firebase("https://ubertutoralpha.firebaseio.com/users/");
            usrsRef.once("value",function(snapshot){
                var usrsObj=snapshot.val();
                chatboxInfo.setUsersObj(usrsObj);
                once_users();
            });              
          }else{
            once_users();
          }
      };
      function once_users(){
        chatboxInfo.UpdateInfo();
        $("#boxtitle").text(chatboxInfo.getTargetName())
                      .attr("chatuid",chatboxInfo.data().sortedChatUid);

        FireChatMsgs(chatboxInfo);
      };
      function FireChatMsgs(chatboxInfo){

        //DisconnectChat();
        //Sort which id is first to generate unique ID
        var sortedChatUid = chatboxInfo.data().sortedChatUid;//"facebook:10205542375624024_facebook:1129363767081285";
        console.log("sortedChatUid",sortedChatUid);


        if(!chatElemMap[sortedChatUid]){
          chatElemMap[sortedChatUid]=chatElm;
        }

        if(msgChatIdRefObj[sortedChatUid]){
          //var msgsRef = new Firebase("https://ubertutoralpha.firebaseio.com/chat/"+sortedChatUid);
          chatRef.child(sortedChatUid).child("utc").once("value",on_child_value_msg);
          return;
        };

        //chatRef = new Firebase("https://ubertutoralpha.firebaseio.com/chat/"+sortedChatUid);
        //msgChatIdRefObj[sortedChatUid]=chatRef;

        //load messages via child added
        chatBind = chatRef.child(sortedChatUid).child("utc").on("child_added",on_child_added_msg);
        msgChatIdRefObj[sortedChatUid]=chatBind;

        //stats 
        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        var spath="./"+sortedChatUid+"/"+chatStats+"/"+ownerIdIndx;
        console.log(spath);
        chatRef.child(sortedChatUid).child(chatStats).on("child_changed",child_changed_msg_stats);
        chatRef.child(sortedChatUid).child(chatStats).on("child_added",child_changed_msg_stats);
      };

      function child_changed_msg_stats(snapshot){
        var chatuid=snapshot.ref().parent().parent().key();
        var uidIdx=snapshot.key();
        var count=snapshot.val();
        console.log('child_changed_msg_stats', chatuid,uidIdx,count);

        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        if(uidIdx===ownerIdIndx){
          console.log("its count is for me.");
          if(chatboxInfo.notifyStats){
            chatboxInfo.notifyStats(chatuid, count);
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
        console.log("key="+utc,msgObj);

        var snderIdIndx=msgObj.ownerIdIndx;
        var boxsides=chatboxInfo.getSides(snderIdIndx);
        var snder=chatboxInfo.getUser(snderIdIndx);
        var snderUid=chatboxInfo.getUid(snderIdIndx);

        var localTime = moment.utc(utc).toDate();
        var datetime  = moment(localTime).format("MMM D hh:mm a"); 


        var currChatuid=$("#boxtitle").attr("chatuid");


        if( currChatuid===chatUid){
          msgAdded2ChatBox(msgObj.msg, datetime,  snder, boxsides, bScroolToView);            
          return;
        }; 
      };
      function msgAdded2ChatBox(msg, datetime, snder, boxsides,bScroolToView){
            var chatMsg='<div class="direct-chat-msg '+boxsides[0]+'">'+
                            '<div class="direct-chat-info clearfix">'+
                              '<span class="direct-chat-name pull-'+boxsides[0]+'">'+snder.displayName+'</span> '+
                              '<span class="direct-chat-timestamp pull-'+boxsides[1]+'"> '+datetime+'</span>'+
                            '</div><!-- /.direct-chat-info -->'+
                            '<img class="direct-chat-img" src="'+snder.imgUrl+'" alt="message user image"><!-- /.direct-chat- img  -->'+
                            '<div class="direct-chat-text">'+
                              msg+
                            '</div><!-- /.direct-chat-text -->'+
                        '</div><!-- /.direct-chat-msg -->';
           var ele=$(chatMsg).appendTo("#chatMessages");
           if(bScroolToView){
             ele[0].scrollIntoView();
           }
          
      };


      this.CloseChatBox=function(){
        DisconnectChat();
      }    


      this.SendMsg=function(msg){
        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        var targetIdIndx=""+chatboxInfo.data().targetIdIndx;
        //var timestamp=Firebase.ServerValue.TIMESTAMP;

        // Record the current time immediately, and queue an event to
// record the time at which the user disconnects.
//var sessionsRef = chatRef;//new Firebase('https://samplechat.firebaseio-demo.com/sessions/');
//var mySessionRef = sessionsRef.push();
//mySessionRef.onDisconnect().update({ endedAt: Firebase.ServerValue.TIMESTAMP });
//mySessionRef.update({ startedAt: Firebase.ServerValue.TIMESTAMP });

        var currChatuid=$("#boxtitle").attr("chatuid");
        var utc=moment.utc().format();

        chatRef.child(currChatuid+"/utc/"+utc).set({msg:msg, ownerIdIndx:ownerIdIndx});


        //stats target incremental.
        chatRef.child(currChatuid+"/stats/"+targetIdIndx).transaction(function(count){
          if(count===null){
            return 1;
          }
          return count+1;
        });

      };


      var chatElm=null;
      this.SetSession=function(chatElem){
        chatElm=chatElem;
        var tutorID=$(chatElem).attr("tutorID"),
        studentID=$(chatElem).attr("studentID"),
        currentUserID=$(chatElem).attr("currentUserID");
        console.log("wei",tutorID,studentID,currentUserID);
        chatboxInfo.Init(tutorID, studentID,currentUserID);

        FireUsers();

        var chatuid = chatboxInfo.data().sortedChatUid;
        return chatuid;
      };
      
      this.SetNotifications=function(callbackfunc){
        chatboxInfo.notifyStats=callbackfunc;
      };


      this.ClearMyStats=function(){
        var currChatuid=$("#boxtitle").attr("chatuid");
        var ownerIdIndx=""+chatboxInfo.data().ownerIdIndx;
        chatRef.child(currChatuid+"/stats/"+ownerIdIndx).transaction(function(count){          
          console.log("ClearMyStats");
          return 0;
        });
      };

};////////////////////////////////////////////