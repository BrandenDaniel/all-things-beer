import React, { Component } from 'react';
import asyncLoader from 'react-async-script-loader';
import SideBarList from './SideBarList';
import '../styles/App.css';
import { mapStyle } from '../styles/mapStyle.js';

class App extends Component {

  state = {
    map: {},
    infowindow: {},
    bounds: {},
    mapReady: false,
    mapCenter: {
      lat: -37.814,
      lng: 144.96332
    },
    mapError: false
  }

  componentWillReceiveProps({isScriptLoadSucceed}){

    // Proceed when google script is loaded
    if (isScriptLoadSucceed) {

      // instantiate google maps with essential properties
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: this.state.mapCenter,
        styles: mapStyle
      });

      //update state's map statuses
      this.setState({
        map: map,
        infowindow: new window.google.maps.InfoWindow({maxWidth: 300}),
        bounds: new window.google.maps.LatLngBounds(),
        mapReady: true
      });
    }
  }

  render() {
    const {map, infowindow, bounds, mapCenter, mapReady, mapError} = this.state;

    return (
      <div className="App">
        <div className="container" role="main">
          { mapReady ? // markers will render only after map is loaded
            <SideBarList
              map = {map}
              infowindow = {infowindow}
              bounds = {bounds}
              mapCenter = {mapCenter}
            />
          : <p className="sidebar-error">Please check your internet connection.</p> }
        </div>
        <div id="map" className="map" role="application">
          { mapError ? // fallback content to allert users that the map load was unsuccessful
            <div id="map-error" className="error" role="alert">
              <p>Google Maps did not load. Try refresing your page or try again later.</p>
            </div>
          : ''
          }
        </div>
      </div>
    );
  }
}

// Async Google API call with key
export default asyncLoader(
    ['https://maps.googleapis.com/maps/api/js?key=AIzaSyBWccwrZJmXjeHVNB-fszV24jLRIFLrVv4']
)(App);
