import React, { Component } from 'react';
import '../styles/App.css';
import Locations from './Locations'
import { locations, locationsDetails } from '../utils/foursquareAPI';
import notAvailable from '../img/not-available.jpg';

class SideBarList extends Component {

  state = {
    query: '',
    venues: [],
    venuesDetails: [],
    filteredVenues: null,
    apiReturned: false // api tracker before render
  }

  componentDidMount () {
    locations(this.props.mapCenter)
    .then( venues => {
      this.setState({
        venues: venues,
        filteredVenues: venues,
        apiReturned: true
      });
      if (venues) {
        this.addMarkers(venues); //call add Markers when venues is true
      }
    })
  }

  addMarkers (venues) {
    const { map, bounds, infowindow } = this.props;

    venues.forEach(location =>  {
      const position = {
        lat: location.location.lat,
        lng: location.location.lng
      }

      location.marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: location.name,
        id: location.id
      });

      bounds.extend(position); //centers to the lat lng postion

      location.marker.addListener('click', function() {
        // Google's marker drop animation
        this.setAnimation(window.google.maps.Animation.DROP);

        // Get venue's infomation on specific marker click
        locationsDetails(this.id)
        .then(data => {
          const venue = data.response.venue;

          // secondary values if data is not sufficient
          this.url = venue.canonicalUrl ? venue.canonicalUrl : 'https://foursquare.com/';
          this.photo = venue.bestPhoto ? `${venue.bestPhoto.prefix}width150${venue.bestPhoto.suffix}` : notAvailable;
          this.phone = venue.contact.formattedPhone ? venue.contact.formattedPhone : '';
          this.address = venue.location.address && venue.location.city ? venue.location.address + ', ' + venue.location.city
                          : 'Sorry, there is no current address for this venue.';

          // infowindonw content
          this.infoContent =
            `<div class="infowindow-container">
              <img class="photo" src=${this.photo} alt="${this.title}">
              <div class="infowindow-content">
                <h2 class="name">${this.title}</h2>
                <p class="address"> ${this.address}</p>
                <a class="contact" href="tel:${this.phone}"> ${this.phone}</a>
                <a class="more-info" href="${this.url}" target="_blank">Read more ..</a>
              </div>
            </div>`

          infowindow.setContent(this.infoContent); // set dynamic content to all marker's info window
          infowindow.open(map, this); // open info window and anchors to it's marker's postions
        })
        .catch(error =>  { // infowindow content when unable to get api response
          this.infoContent = `<div class="venue-error"  role="alert">
                  <h3>Foursquare request for ${this.title} was not successful.</h3>
                  <p>Refresh or try again later...</p>
                </div>`

           infowindow.setContent(this.infoContent);
          infowindow.open(map, this);
        });
      });
    });
  }

  // sidebar close function & animation
  slideClose = () => {
    document.querySelector('.sidebar-container').style.margin = "0 0 0 -500px";
    setTimeout(function() {
      document.querySelector('.hamburger-container-out').style.display = "inline-block";
    }, 200)
  }

  // sidebar open function & animation
  slideOpen = () => {
    document.querySelector('.sidebar-container').style.margin = "0";
    document.querySelector('.hamburger-container-out').style.display = "none";
  }

  filterVenues = (event) => {
    const { venues } = this.state;
    const { infowindow } = this.props;
    const query = event.target.value.toLowerCase();

    // updates state according to user input
    this.setState({ query: query })

    // closes any opened info window while search query is processing
    infowindow.close();

    // filter markers by venue name
    const filteredVenues = venues.filter((venue) => {
      const match = venue.name.toLowerCase().indexOf(query) > -1;
      venue.marker.setVisible(match); // what is on the sidebar list will reflect the map's marker
      return match;
    })

    // Updates the filterVenues object within state
    this.setState({filteredVenues: filteredVenues })
  }

  render() {
    const { apiReturned, filteredVenues, query } = this.state;

    return (
      <div>
        <div className="hamburger-container-out" onClick={this.slideOpen}>
          <i
            className="fas fa-bars hamburger-out">
          </i>
        </div>
        <div className="sidebar-container">
          <h1 className="title">MELBOURNE ALL THINGS BEER
            <span className="close-btn" onClick={this.slideClose}>&times;</span>
          </h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Filter by Name"
              value={query}
              onChange={this.filterVenues}
              aria-labelledby="text filter"
              role="search"
            />
          </div>

          { apiReturned && filteredVenues.length > 0 ? // show venue list when api data exsits and filtered
          <div className="list-container">
            <ul className="venue-list">
              {filteredVenues.map((venue, id) =>
                <Locations
                  key={venue.id}
                  venue={venue}
                />
              )}
            </ul>
          </div>
          // returns this message when no venues were matched
          : <p id="filter-error" className="no-result">Sorry, no venues matched</p>
          }
        </div>
      </div>
    );
  }
}

export default SideBarList
