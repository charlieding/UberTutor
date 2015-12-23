

function MyMapUti(){
    var marker=null;
    var infowindow=null;
    var map=null;
    
    this.initialize=function(lat,lng, labeltxt) {
        var centerLatLng = new google.maps.LatLng(lat, lng);
      var mapProp = {
        center:centerLatLng,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.TERRAIN 
      };
      map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
      
      google.maps.event.addListener(map, 'click', function(event) {
        $("#posit").text(event.latLng.toString());
        infowindow.close();
        marker.setMap(null);
      });
      
      
      //center marker
      // marker=new google.maps.Marker({
         //position:centerLatLng,
      // });
      // marker.setMap(map);
      // infowindow = new google.maps.InfoWindow({
         //  content:labeltxt
         //  });
      // infowindow.open(map,marker);
      
      
      
        //
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

        //img
        var pinIcon = new google.maps.MarkerImage(
            "../img/map-pointer-a.gif?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00",
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(32, 32)
        );
        marker = new google.maps.Marker({
          map:map,
          draggable:false,
          optimized:false, // <-- required for animated gif
          animation: google.maps.Animation.DROP,
          position: centerLatLng,
          icon: pinIcon,

        });

    }
};//

var mmu=new MyMapUti();

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
    
    mmu.initialize(currentLatLng.coords.latitude,currentLatLng.coords.longitude,"default center");
    setTimeout(cleanmap,8000);
}    
function cleanmap() {
    console.log("cleanmap");
    $("a[target='_new']").text("");
    $("a:contains('Terms')").text("");
    $("span:contains('Map')").text("");
}

getLocation();
  
  

