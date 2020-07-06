"use strict";

const mapboxBaseUrl = 'https://api.mapbox.com/';
const mapboxGeoCoderEndpoint = 'geocoding/v5/mapbox.places/';

class ShowMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
                  zoom: 12,
                  };
      this.handleClose = this.handleClose.bind(this)
  }


  componentDidMount(){
    
    const map = new mapboxgl.Map({
      container: "mapContainer",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.props.tripAddresses.school_long_lat[0], this.props.tripAddresses.school_long_lat[1]],
      zoom: this.state.zoom
      });

      //Add an address specifier in the map where user can enter an address and place a marker
      showMapboxGeocoder(map)

      //Driver Marker
      addMarker(map, this.props.tripAddresses.driver_name, this.props.tripAddresses.driver_address, 
                this.props.tripAddresses.driver_long_lat[0], this.props.tripAddresses.driver_long_lat[1], "O")
      
      //Destination Marker
      addMarker(map, this.props.tripAddresses.school_name, this.props.tripAddresses.school_address, 
                this.props.tripAddresses.school_long_lat[0], this.props.tripAddresses.school_long_lat[1], "D")

      //Rider Markers
      for (const rider of this.props.tripAddresses.riders) {
        addMarker(map, rider.rider_name, rider.rider_address, 
                  rider.rider_long_lat[0], rider.rider_long_lat[1], "R")
      }

  }

  handleClose(event) {
    this.props.handleClose();
  }


  render() {
    return (
             <div id="mapContainer" className="mapContainer">
             </div>
    );
  }
}