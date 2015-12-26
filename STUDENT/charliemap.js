var MyMapUti={
  getMarkImg:function(latlng,imgUrl){
      var dataType=typeof(latlng);
      if( dataType==="string"){
        latlng=MyMapUti.mapLatLng(latlng);
      }
        var pinIcon = new google.maps.MarkerImage(
            imgUrl,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(32, 32)
        );
        var markerimg = new google.maps.Marker({
          //map:map,
          draggable:false,
          optimized:false, // <-- required for animated gif
          animation: google.maps.Animation.DROP,
          position: latlng,
          icon: pinIcon,
        });
        return markerimg;
  },
  mapLatLng:function(slatlng){
      var dataType=typeof(slatlng);
      if( dataType==="string"){
        var arr=slatlng.split(",");
        var latlng=new google.maps.LatLng(arr[0],arr[1]);
        return latlng;
      }
      return null;
  },
};
function FbaseUsers(map){
    function userMarkImg(userObj){
            var latlng=userObj.latlng;
            if( !userObj.latlng || userObj.latlng.length===0){
                latlng=new google.maps.LatLng(+34.070044598142, -84.16012274947661);
            };
            var imgUrl=userObj.imgUrl;
            if(!imgUrl || imgUrl.length===0){
                imgUrl="../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00";
            };
            return MyMapUti.getMarkImg(latlng,imgUrl);
    }; 
    var markImgArr={};
    function userMarkImgUpdate(uid,snapshot,ops){
         console.log(uid+", ops="+ops);
         var latlng = snapshot.val();
         var key = snapshot.key();
         console.log(key+" := "+latlng);

         if(key!="latlng"){
            return;
         }
         console.log("op..");
         var mark=markImgArr[uid];
         mark.setMap(null);

         if("child_changed"===ops)  {
           var pos=MyMapUti.mapLatLng(latlng);           
           mark.setOptions({position:pos,map:map}); 
           markImgArr[uid]=mark;                        
         }
    };
    function uerMarkImgAdd(snapshot){
          var userObj = snapshot.val();
          var uid=snapshot.key();
          //$.each(usersObj,function(uid,userObj){
            console.log("uid="+uid);
            console.log(userObj);

            if(userObj.type!="tutor"){
              //return;
            }

            var markimg=userMarkImg(userObj);
            markimg.setMap(map);
            markImgArr[uid]=markimg;

            ref.child(uid).on("child_removed",function(snapshot,prevKey){
                console.log("prevKey="+prevKey);
                userMarkImgUpdate(uid,snapshot,'child_removed');
            });
            ref.child(uid).on("child_changed",function(snapshot,prevKey){
                console.log("prevKey="+prevKey);
                userMarkImgUpdate(uid,snapshot,'child_changed');
            });

          //});      
    };

    var ref = new Firebase("https://ubertutoralpha.firebaseio.com/users");

    ref.on("value",function(snapshot){
        //usersMarkImgs(snapshot);
    });
    ref.on("child_added",function(snapshot){
        uerMarkImgAdd(snapshot);
    });


 
};
    
function MyMapMgr(){
    var map=null;
    var markerCentr=null;
    var markerApptment=null;
    var infowindow=null;
    var centerLatLng=null;
    var draggableCursor=null;
    
    this.initialize=function(lat,lng, labeltxt) {
      centerLatLng = new google.maps.LatLng(lat, lng);
      var mapProp = {
        center:centerLatLng,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.TERRAIN 
      };
      map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
      
      google.maps.event.addListener(map, 'click', function(event) {
        //markerApptment.setMap(map);
        if(null!=draggableCursor){
           draggableCursor=null;
           map.setOptions({draggableCursor:null});
           markerApptment.setOptions({map:map,position:event.latLng});
           $("#eventPos").val(event.latLng.toString());
        }
        //infowindow.close();
        //mark.setMap(null);
      });
      
      
      //center mark
      // mark=new google.maps.Marker({
         //position:centerLatLng,
      // });
      // mark.setMap(map);
      // infowindow = new google.maps.InfoWindow({
         //  content:labeltxt
         //  });
      // infowindow.open(map,mark);
      
      
      
        //circle
        var myCity = new google.maps.Circle({
            center:centerLatLng,
            radius:20,
            strokeColor:"#990099",
            strokeOpacity:0.3,
            strokeWeight:30,
            fillColor:"#0000ee",
            fillOpacity:0.4,
            clickable:true
          });
        myCity.setMap(map);

        //img marker
        markerCentr=MyMapUti.getMarkImg(centerLatLng,"../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00");
        markerCentr.setMap(map);


        ////
        markerApptment=MyMapUti.getMarkImg(null,"../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00");

        var fbu=new FbaseUsers(map);

    };

    this.resetMap=function(){
      map.setOptions({center: centerLatLng});

    };
    this.getMap=function(){
      return map;
    };
    this.setMeetingPlace=function(){
       draggableCursor='crosshair';
       map.setOptions({draggableCursor:draggableCursor});
    };
    this.cleanMap=function (callbackfunc) {
        console.log("cleanMap");
        $("a[target='_new']").text("");
        $("a:contains('Terms')").text("");
        $("span:contains('Map')").text("");
        if(callbackfunc){
          callbackfunc(centerLatLng);
        }
    };



};//



var mmm=new MyMapMgr();




function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("not support navigator.geolocation");
    }
}
function showPosition(position) {
    var currentLatLng=position;
    var ss = "" + position.coords.latitude + ", " + position.coords.longitude; 
    console.log("ok currentLatLng="+ss);
    
    mmm.initialize(currentLatLng.coords.latitude,currentLatLng.coords.longitude,"default center");
    setTimeout(cleanmap,8000);
}    
function cleanmap() {
    mmm.cleanMap(null);
}

getLocation();





  
  
  $(document).ready(function(){ 
    $("#resetMap").click(function(){
      mmm.resetMap();
    });  
    $("#cursorChange").click(function () {
       mmm.setMeetingPlace();//getMap().setOptions({draggableCursor:'crosshair'});
    });
    //$("#tables_container").append(archinfo01.GetTable());  
    //$("#tables_container").append(archinfo01.GetFreqTable({scale:10}));
  });
  
  

