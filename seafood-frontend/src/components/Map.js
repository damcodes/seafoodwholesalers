import { React } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { useState } from 'react';

const mapStyles = {
  width: '50%',
  height: '50%',
  margin: '0 auto'
}

const MapContainer = ({ company }) => {
  const [ activeMarker, setActiveMarker ] = useState({});
  const [ selectedPlace, setSelectedPlace ] = useState({});
  const [ showingInfoWindow, setShowingInfoWindow ] = useState(false);

  const onMarkerClick = (props, marker, e) => {
    setActiveMarker(marker);
    setSelectedPlace(props);
    setShowingInfoWindow(true);
  }

  const onClose = props => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  }

  return(
    <Map
      google={window.google}
      zoom={14}
      style={mapStyles}
      initialCenter={
        {
          lat: company.latitude,
          lng: company.longitude
        }
      }
    >
      <Marker 
        onClick={onMarkerClick}
        name={company.name}
      />

      <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={onClose}
      >
        <div>
          <h4>{selectedPlace.name}</h4>
        </div>
      </InfoWindow>
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDZxCxi-32IM8lsrdzPD71VezjtxFKg3Zc'
})(MapContainer);