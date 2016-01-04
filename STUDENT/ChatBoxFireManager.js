

var ChatFireMsgManager=function(currUserID){
  this.usrsRef = new Firebase("https://ubertutoralpha.firebaseio.com/users/");
  this.currUserID=currUserID;
  this.targetUserIdArr=[];


     var sortedChatUidConnectedArr=[];

     function GenChatBoxInfo(tutorID, studentID, currUserID, usrsObj){
      if(tutorID===studentID) return alert("self chat");
        var arr=[tutorID, studentID];
        arr.sort();
        console.log(arr);
        var ret={};
        ret.currUserID=currUserID;
        ret.ownerIdIndx=arr.indexOf(currUserID);
        if(ret.ownerIdIndx<0) return alert("not find:"+currUserID);
        ret.targetIdIndx=0;
        if(ret.ownerIdIndx===0){
           ret.targetIdIndx=1;
        }
        ret.targetUserID=arr[ret.targetIdIndx];
        ret.sortedChatUid=arr.join("_");



        ret.uidArr=arr;
        ret.usrArr=[];
        for(var i=0;i<arr.length;i++){
                var uid=arr[i];
                ret.usrArr[i]=usrsObj[uid];
        };

        this.data=ret;

        this.getUser=function(ownerIdIndx){
          return ret.usrArr[ownerIdIndx];
        };
        this.getSides=function(ownerIdIndx){
          var boxsides=["left","right"];
          if( ret.currUserID === ret.uidArr[ownerIdIndx]){
            boxsides=["right","left"];
          };
          return boxsides;
        };
        this.getTargetName=function(){
          return ret.usrArr[ret.targetIdIndx].displayName;
        };

     };

      var chatboxInfo=null;
      var onChatChange = null;
      var chatRef = null;      
      function DisconnectChat(){
        //Remove old chat box listener 
        if(onChatChange){
          chatRef.off("child_added", onChatChange);
          delete onChatChange;
          delete onChatChange;
          onChatChange=null;
          chatRef=null;
        }
      };
      function FireChatUsers(tutorID, studentID, currUserID){
          var usrsRef = new Firebase("https://ubertutoralpha.firebaseio.com/users/");
          usrsRef.once("value",function(snapshot){
              var usrsObj=snapshot.val();
              once_value_users(tutorID, studentID, currUserID,usrsObj);
          });        
      }
      function once_value_users(tutorID, studentID, currUserID, usrsObj){
        chatboxInfo=new GenChatBoxInfo(tutorID, studentID, currUserID, usrsObj);
        $("#boxtitle").text(chatboxInfo.getTargetName());
        FireChatMsgs(chatboxInfo);
      };
      function FireChatMsgs(chatboxInfo){

        //DisconnectChat();
        //Sort which id is first to generate unique ID
        var sortedChatUid = chatboxInfo.data.sortedChatUid;//"facebook:10205542375624024_facebook:1129363767081285";
        console.log("sortedChatUid",sortedChatUid);
        if(sortedChatUidConnectedArr.indexOf(sortedChatUid)>=0){
          return;
        };
        sortedChatUidConnectedArr.push(sortedChatUid);


        chatRef = new Firebase("https://ubertutoralpha.firebaseio.com/chat/"+sortedChatUid);
        //load messages via child added
        onChatChange = chatRef.on("child_added",on_child_added_msg);
      };
      function on_child_added_msg(snapshot){
        var msgObj = snapshot.val();
        var utc=snapshot.key();
        console.log("key="+utc,msgObj);

        var ownerIdIndx=msgObj.ownerIdIndx;
        var boxsides=chatboxInfo.getSides(ownerIdIndx);
        var usr=chatboxInfo.getUser(ownerIdIndx);

        var localTime = moment.utc(utc).toDate();
        var datetime  = moment(localTime).format("MMM D hh:mm a");     
        msgAdded2Ui(msgObj.msg, datetime,  usr, boxsides);    
      };
      function msgAdded2Ui(msg, datetime, usr, boxsides){
            var chatMsg='<div class="direct-chat-msg '+boxsides[0]+'">'+
                            '<div class="direct-chat-info clearfix">'+
                              '<span class="direct-chat-name pull-'+boxsides[0]+'">'+usr.displayName+'</span> '+
                              '<span class="direct-chat-timestamp pull-'+boxsides[1]+'"> '+datetime+'</span>'+
                            '</div><!-- /.direct-chat-info -->'+
                            '<img class="direct-chat-img" src="'+usr.imgUrl+'" alt="message user image"><!-- /.direct-chat- img  -->'+
                            '<div class="direct-chat-text">'+
                              msg+
                            '</div><!-- /.direct-chat-text -->'+
                        '</div><!-- /.direct-chat-msg -->';
           $(chatMsg).appendTo("#chatMessages")[0].scrollIntoView();
      };


      this.CloseChatBox=function(){
        DisconnectChat();
      }    


      this.SendMsg=function(msg){
        var ownerIdIndx=""+chatboxInfo.data.ownerIdIndx;
        //var timestamp=Firebase.ServerValue.TIMESTAMP;

        // Record the current time immediately, and queue an event to
// record the time at which the user disconnects.
//var sessionsRef = chatRef;//new Firebase('https://samplechat.firebaseio-demo.com/sessions/');
//var mySessionRef = sessionsRef.push();
//mySessionRef.onDisconnect().update({ endedAt: Firebase.ServerValue.TIMESTAMP });
//mySessionRef.update({ startedAt: Firebase.ServerValue.TIMESTAMP });
        var utc=moment.utc().format();
        chatRef.child(utc).set({msg:msg, ownerIdIndx:ownerIdIndx});
      };
      FireChatUsers(tutorID, studentID, currUserID);

};////

      var fireChatBox=null;
      function chatBox(tutorID, studentID, currUserID){
          $("#chatMessages").empty();
          if(tutorID===studentID) return alert("self chat:",tutorID,studentID,currUserID);

          if(null===fireChatBox){
            fireChatBox=new MyFireChatBox(tutorID, studentID, currUserID);            
          }

      };

      //add new message using set
      function sendMsg(){
        var msg=$("#msg").val();
        msg=$.trim(msg);
        if(msg.length===0)return;
        //var ownerIdIndx=mfcb.chatboxInfo.data.ownerIdIndx;
        var datetime=moment().format();
        console.log(datetime);
        //chatRef.child(datetime).set({msg:msg, ownerIdIndx:ownerIdIndx});
        fireChatBox.SendMsg(msg);
        $("#msg").val('');
      };
      function msgkeydwn(e){
        //console.log(e);
        if(e.keyCode===13 || e.which===13){
           sendMsg();
        };
        return true;
      };

  $(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});


   