
window.onload = () => {
    let input = document.getElementById("zip-code-input");
    input.addEventListener("keyup", function(event){
        if(event.keyCode === 13) {
            event.preventDefault();
           searchStores();
        }
    });
}

var map;
var markers = [];
var infoWindow;


function initMap() {
    var losAngeles = {
        lat: 34.063380, 
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        
        styles : [
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#f1efe8"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "gamma": "1.19"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "gamma": "0.00"
                    },
                    {
                        "weight": "2.07"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b2ac83"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#b2ac83"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#8ac0c4"
                    }
                ]
            }
        ]

    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    

}

function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        for(var store of stores){
            var postal = store['address']['postalCode'].substring(0, 5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
   
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}


function setOnClickListener() {
var storeElements = document.querySelectorAll('.store-container');
storeElements.forEach(function(elem, index){
    elem.addEventListener('click', function(){
        new google.maps.event.trigger(markers[index], 'click'); 
    })
})
}


function displayStores(stores){
    var storesHtml = '';
    for(var [index, store] of stores.entries()){
        var address = store['addressLines'];
        var phone = store['phoneNumber'];
        
        storesHtml += `
        <div class="store-container">
        <div class="store-container-background">
        <div class="store-info-container">

        <div class="store-address">
            <span>${address[0]}</span>
            <span>${address[1]}</span>
        </div>
        <div class="store-phone-number">${phone}</div>
        </div>

        <div class="store-number-container">
            <div class="store-number">
            ${index+1}    
            </div>
        </div>
        </div>
        </div> 
    `
    document.querySelector('.stores-list').innerHTML = storesHtml;
        
    }

}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        
        var name = store["name"];
        var address = store["addressLines"][0];
        var status = store["openStatusText"];
        var phone = store["phoneNumber"];
            bounds.extend(latlng);
        createMarker(latlng, name, address, index+1, status, phone)
    
    }
    map.fitBounds(bounds);

}

var image = "../pin_marker.png"

function createMarker(latlng, name, address, index, status, phone){
    var html = `
    <div class="info-window-container">
        <div class="info-window-name">
       <a href="${intoLink(name)}"><b>${name}</b> <br/></a>
        </div>

        <div class="status-text">
            ${status}
        </div>

        <div class="info-window-address"> 
            <i class="fa fa-location-arrow"></i>  
            <span>${address}</span>
        </div>

        <div class="info-window-phone">
            <i class="fa fa-phone"></i>
            <span>${phone}</span>
            
        </div>
    </div>
    `
    var icon = {
        url: "./icon3.png", // url
        scaledSize: new google.maps.Size(50, 50), // size
    };

    
    var marker = new google.maps.Marker({
      map: map,
      optimized: false,
      position: latlng,
      label: index.toString(),
      icon: icon


    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    },
    
    );

    markers.push(marker);



}


function intoLink(name) {
    let newname = name.replace(/&/g, '%26').replace(/ /g, '+').replace(/#/g, '%23');
    let link = `https://www.google.com/maps/dir/?api=1&destination=${newname}`;
    // https://www.google.com/maps/search/?api=1&query=${newname}
return link;
}





