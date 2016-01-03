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
            new google.maps.Point(16, 16), /*null anchor is bottom center of the scaled image */
            new google.maps.Size(32, 32)
        );
        var markerimg = new google.maps.Marker({
          //map:map,
          draggable:true,
          optimized:false, // <-- required for animated gif
          animation: google.maps.Animation.DROP,
          position: latlng,
          icon: pinIcon,
        });
        markerimg.m_origLatLng=latlng;
        var flightPath=new google.maps.Polyline({
          path:[],
          strokeColor:"#ff0000",
          strokeOpacity:0.8,
          strokeWeight:0.5
          });
        markerimg.m_flightPath=flightPath;

        google.maps.event.addListener(markerimg,'click',function(ev) {
              console.log(ev.latLng, this.userObj,  this);
              //ChinaArchMapUti.OnClick_Circle(ev.latLng.toString() , this );
              //infowindow.setPosition(ev.latLng);
              //infowindow.open(map);
              if(this.userObj){
                findTutors();
                updateTutorProfileByObject(this.userObj);
              }
              
        });

        google.maps.event.addListener(markerimg,'dragstart',function(ev) {
              console.log(ev.latLng, this.userObj,  this);
        });
        google.maps.event.addListener(markerimg, 'drag', function() {
          console.log('Dragging...', markerimg.getPosition().lat(), markerimg.getPosition().lng());
          if(markerimg.m_isEventPos===true){
            return;
          }
          var arrLatlng=MyMapUti.getUserMarkImgFlightPath(markerimg);
          var mmap=markerimg.getMap();
          markerimg.m_flightPath.setOptions({map:mmap,path:arrLatlng});
         
          //updateMarkerPosition(markerimg.getPosition());
        });
        google.maps.event.addListener(markerimg, 'dragend', function() {
          console.log('Drag ended');
          if(markerimg.m_isEventPos===true){
            return;
          }
          //geocodePosition(markerimg.getPosition());
        });        

        return markerimg;
  },
  getUserMarkImgFlightPath:function(markerimg){
          var arrLatlng=[];
          arrLatlng.push(markerimg.getPosition());
          arrLatlng.push(markerimg.m_origLatLng);
          var x0=markerimg.m_origLatLng.lat(),
              y0=markerimg.m_origLatLng.lng();
          arrLatlng.push(new google.maps.LatLng(x0-0.00001,y0));arrLatlng.push(markerimg.m_origLatLng);
          arrLatlng.push(new google.maps.LatLng(x0+0.00001,y0));arrLatlng.push(markerimg.m_origLatLng);
          arrLatlng.push(new google.maps.LatLng(x0,y0-0.00001));arrLatlng.push(markerimg.m_origLatLng);
          arrLatlng.push(new google.maps.LatLng(x0,y0+0.00001));arrLatlng.push(markerimg.m_origLatLng);
          return arrLatlng;
  },
  mapLatLng:function(slatlng){
      var dataType=typeof(slatlng);
      if( dataType==="string"){
        var arr=slatlng.split(",");
        if(arr.length<2) return null;
        var latlng=new google.maps.LatLng(arr[0],arr[1]);
        return latlng;
      }
      return slatlng;
  },

  crossHairPolylineMark:function(centerLatLng){
     //var arr=sLatLng.split(",");
     //if(arr.length<2) return alert("fatal error for latlng");
     var x0=centerLatLng.lat(),
         y0=centerLatLng.lng();

     var arrLatlng=[];
     arrLatlng.push(new google.maps.LatLng(-10.0+x0,y0));  
     arrLatlng.push(new google.maps.LatLng(+10.0+x0,y0)); 
     arrLatlng.push(new google.maps.LatLng(x0,y0)); 
     arrLatlng.push(new google.maps.LatLng(x0,-10.0+y0)); 
     arrLatlng.push(new google.maps.LatLng(x0,+10.0+y0)); 





     var flightPath=new google.maps.Polyline({
     path:arrLatlng,
     strokeColor:"#000099",
     strokeOpacity:0.8,
     strokeWeight:0.5
     });
     return flightPath;
     //flightPath.setMap(map);
  },



};
























////
function FbaseUserMarkImgs(map){
    var defaultCenterLatLng=map.getCenter();//new google.maps.LatLng(+34.070044598142, -84.16012274947661);

    function userMarkImg(userObj){
            var latlng=userObj.latlng;
            if( !userObj.latlng || userObj.latlng.length===0){
                latlng=defaultCenterLatLng;
            };
            var imgUrl=userObj.imgUrl;
            if(!imgUrl || imgUrl.length===0){
                imgUrl="../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00";
            };
            var obj=MyMapUti.getMarkImg(latlng,imgUrl);
            obj.userObj=userObj;
            return obj;
    }; 
    var markImgArr={};
    function overlapAdjust(markImgArr,mark){
        function isOverLap(a,b){
        var dx=a.lat()-b.lat(),
            dy=a.lng()-b.lng();
        var dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<0.001){
          return true;
        }
        return false;
      } ;  
      var overlapIdx=0;
      var initialCenterLatLng=map.m_initialCenterLatLng;
      if(true===isOverLap(initialCenterLatLng, mark.m_origLatLng)){
            overlapIdx++;
      };      
      $.each(markImgArr,function(uid,obj){
          if(true===isOverLap(obj.m_origLatLng,mark.m_origLatLng)){
            overlapIdx++;
          };        
      });    
      var x=mark.m_origLatLng.lat()+overlapIdx*0.001/4,
          y=mark.m_origLatLng.lng()+overlapIdx*0.001/4;
      mark.setOptions({position:new google.maps.LatLng(x,y)});
      var arrLatlng=MyMapUti.getUserMarkImgFlightPath(mark);
      mark.m_flightPath.setOptions({map:map,path:arrLatlng});
    };

    var userShowCondition=null;
    function allowShowup(userObj){
      if(null===userShowCondition){//no any cpmditions.
        return true;
      }
      var ret=false;
      $.each(userShowCondition,function(key,val){
          if( userObj[key] && userObj[key] === val){
            ret=true;
          };
      });
      //todo other conditions.
      switch(userShowCondition.otherstr){
        case "admin":ret=true;
        break;
        case "guest":ret=true;
        break;        
        default:
        break;
      };        
      return ret;
    };
    function updateImgOnMap(uid,userObj,map){
        var mark=markImgArr[uid];
        if(mark){
          mark.setMap(null);
          mark.m_flightPath.setMap(null);
          delete markImgArr[uid];
        }
         
        if(map){
           mark=userMarkImg(userObj);
           if( allowShowup(userObj) ){
              mark.setMap(map);
              overlapAdjust(markImgArr,mark);
           };
           markImgArr[uid]=mark;
        }
    };

    function on_child_change(snapshot,changetype){
          var userObj = snapshot.val();
          var uid=snapshot.key();
          //console.log("uid="+uid,userObj);
          switch(changetype){
            case "child_removed":updateImgOnMap(uid,userObj,null);
            break;
            case "child_changed":updateImgOnMap(uid,userObj,map);
            break;
            default:updateImgOnMap(uid,userObj,map);
            break;
          }; 
    };
    function firemap(){
        var ref = new Firebase("https://ubertutoralpha.firebaseio.com/users");
    
        ref.on("child_added",function(snapshot){
            on_child_change(snapshot,'child_added');
            //userMarkImgAutoPosAdjust();
        });
    
        ref.on("child_removed",function(snapshot,prevKey){
          console.log("prevKey",prevKey);
            on_child_change(snapshot,'child_removed');
        });
        ref.on("child_changed",function(snapshot,prevKey){
          console.log("prevKey",prevKey);
            on_child_change(snapshot,'child_changed');
        });
    };
    this.setConditions=function(jpar){
        defaultCenterLatLng= jpar.centerLatLng||defaultCenterLatLng;
        userShowCondition=jpar.userShowCondition;
    };

    firemap();
};
    



















function MyMapMgr(){
    var map=null;
    var markerCentr=null;
    var markerApptment=null;
    var infowindow=null;
    var centerLatLng=null;
    var draggableCursor=null;

    var fbum=null;




    //geocoder for addr.
    var geocoder = new google.maps.Geocoder();
    function geocodePosition(pos) {
      geocoder.geocode({
        latLng: pos
      }, function(responses, status) {
        if (responses && responses.length > 0) {
          updateMarkerAddress(pos, responses[0].formatted_address);
        } else {
          updateMarkerAddress(pos, 'Cannot determine address at this location.');
        }
      });
    };
    function updateMarkerAddress(pos, str) {
      var slatlng=pos.toString();
      $("#eventPos").val(str).attr("latlng",slatlng).attr("title",slatlng);
    };



    
    this.initialize=function(lat,lng, labeltxt) {
      centerLatLng = new google.maps.LatLng(lat, lng);
      var mapProp = {
        center:centerLatLng,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.TERRAIN,
        mapTypeControl:false 
      };
      map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
      //map.panTo(centerLatLng);
      //map.setCenter(centerLatLng);
      map.m_initialCenterLatLng=centerLatLng;
      google.maps.event.addListener(map, 'click', function(event) {
        //markerApptment.setMap(map);
        if(null!=draggableCursor){
           draggableCursor=null;
           map.setOptions({draggableCursor:null});
           markerApptment.setOptions({map:map,position:event.latLng});

           //$("#eventPos").val(event.latLng.toString());
           geocodePosition(event.latLng);
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
        //myCity.setMap(map);

        //img marker
        markerCentr=MyMapUti.getMarkImg(centerLatLng,"./mapPinOver2.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00");
        markerCentr.setOptions({map:map,draggable:false});


        //crosshair polyline mark
        //var crosshair=MyMapUti.crossHairPolylineMark(centerLatLng);
        //crosshair.setMap(map);


        ////
        markerApptment=MyMapUti.getMarkImg(null,"../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00");
        markerApptment.m_isEventPos=true;
        google.maps.event.addListener(markerApptment, 'dragend', function() {
          console.log('Drag ended');
          if(markerApptment.m_isEventPos===true){
            geocodePosition(markerApptment.getPosition());
            return;
          }
        });      


       fbum=new FbaseUserMarkImgs(map);    
       fbum.setConditions({userShowCondition:{userType:"tutor"}});
       //fbum.setConditions({userShowCondition:null});
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



};//MyMapMgr//



var mmm=new MyMapMgr();


//var mat=window.location.search.match(/curLatLng=([0-9\+\-\.]+)[\,]([0-9\+\-\.]+)/);
//console.log(mat);
//var ref = new Firebase("https://ubertutoralpha.firebaseio.com");
// Get a database reference to our posts
//var authData = ref.getAuth();
//console.log(authData);

function startGMap(latlng){
  var mat=latlng.split(",");
  mmm.initialize(mat[0],mat[1],"default center");

  function cleanmap() {
    mmm.cleanMap(null);
  }  
  setTimeout(cleanmap,8000);
}










  
  
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
  
  

