import React, { Component } from 'react';

class Locations extends Component {

  // clicking on venues on the list will correspond to it's marker
  infoWindow = () => {
    window.google.maps.event.trigger(this.props.venue.marker,'click');
  }

  render() {
    //renders individual venue per list
    return (
      <li className="place">
        <div
          onClick={this.infoWindow}
          role="button"
          tabIndex={0}
          >
          {this.props.venue.name}
        </div>
      </li>
    );
  }
}

export default Locations;
