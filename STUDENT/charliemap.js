var MyMapUti={
  getMarkImg:function(latlng,imgUrl){
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
  getCircle:function(latlng){
  },
};
function FbaseUsers(map){

    var ref = new Firebase("https://ubertutoralpha.firebaseio.com/users");
    var markImgArr=[];
    ref.on("value",function(snapshot){
          var usersObj = snapshot.val();
          var dlt=0;
          $.each(usersObj,function(uid,userObj){
            console.log("uid="+uid);
            console.log(userObj);


            var latlng=null;
            if( !!userObj.latlng ){
                latlng=new google.maps.LatLng(userObj.latlng);
            }else{
                latlng=new google.maps.LatLng(dlt+34.070044598142, -84.16012274947661);
                dlt+=1.0;
            };
            var imgUrl=userObj.imgUrl;
            if(!imgUrl || imgUrl.length===0){
              imgUrl="../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00";
            };
            var markimg=MyMapUti.getMarkImg(latlng,imgUrl);
            markimg.setMap(map);
            markImgArr.push(markimg);


            ref.child(uid).on("child_removed",function(snapshot){
                  var users = snapshot.val();
                  console.log(users);
            });
            ref.child(uid).on("child_changed",function(snapshot){
                  var users = snapshot.val();
                  console.log(users);
            });

          });



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
//fbu.showTutors();

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
  
  

