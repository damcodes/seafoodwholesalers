import { React } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '50%',
  height: '50%',
  margin: '0 auto'
}

const MapContainer = ({ props, company }) => {
  console.log(company.latitude)
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
    />
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDZxCxi-32IM8lsrdzPD71VezjtxFKg3Zc'
})(MapContainer);