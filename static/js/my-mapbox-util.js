function showMapboxGeocoder(map) {
    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: {
            color: 'blue'
        },
        mapboxgl: mapboxgl
    });

    map.addControl(geocoder);
}

function addMarker(map, name, address, long, lat, type) {
    //Create the popup with the address

    var markerColor;
    var markerIcon = "";
    if (type == "O") {
        markerColor = "green"
        markerIcon = '<svg width="1.5em" height="1em" viewBox="0 0 16 16" class="bi bi-house-door-fill" fill="' + markerColor + '" xmlns="http://www.w3.org/2000/svg">\
                            <path d="M6.5 10.995V14.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5V11c0-.25-.25-.5-.5-.5H7c-.25 0-.5.25-.5.495z"/>\
                            <path fill-rule="evenodd" d="M13 2.5V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>\
                        </svg>'
    } else if (type == "D") {
        markerColor = "red"
        markerIcon = '<svg width="1.5em" height="1em" viewBox="0 0 16 16" class="bi bi-flag-fill" fill="' + markerColor + '" xmlns="http://www.w3.org/2000/svg">\
                            <path fill-rule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>\
                            <path fill-rule="evenodd" d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916A.5.5 0 0 1 3.5 9V3a.5.5 0 0 1 .223-.416l.04-.026z"/>\
                        </svg>'
    } else {
        markerColor = "blue"
        markerIcon = '<svg width="1.5em" height="1em" viewBox="0 0 16 16" class="bi bi-person-fill" fill="' + markerColor + '" xmlns="http://www.w3.org/2000/svg">\
                            <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\
                        </svg>'
    }

    var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(markerIcon + " <b>" + name + "</b>" + "<br />" + address);
    console.log("Adding map marker of type " + type + " for " + address + " with long lat as " + long + ":" + lat)

    //Create the marker using Longitude & Latitude for the address
    var marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([long, lat])
        .setPopup(popup)
        .addTo(map);
}

function getLatLongForAddress(addresses, addressLatLongs) {

}