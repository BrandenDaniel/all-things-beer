//variables holding url parameter values
const url = 'https://api.foursquare.com/v2/venues/';
const time = '20180420';
const distance = '12000';
const client_id = 'GL4TLL3EYFHWADPX0A2G0P2QEYMUYAYTIP24RIFZIE2HY5OG';
const client_secret = 'TNB2G1WLYPOLDOX3XK3SDG1N3S3VC3GGK4GCJWEUXLK3D202';
const query = 'beer';
const limit = '30';

export const locations = (mapCenter) => {

  //inserting variables in the url with ES6 syntax
  const requestURL = `${url}search?ll=${mapCenter.lat},${mapCenter.lng}&query=${query}&v=${time}&radius=${distance}&limit=${limit}&client_id=${client_id}&client_secret=${client_secret}`
  return fetch(requestURL).then(response => {
    if (!response.ok) {
      throw response
    } else
      return response.json()
  }).then(data => {
    const venues = data.response.venues;
    return venues;
  })
}

//this particular call uses the id provided by the locations api call for more details on venues
export const locationsDetails = (id) => {

  const requestURL = `${url}${id}?client_id=${client_id}&client_secret=${client_secret}&v=${time}`
  return fetch(requestURL).then(response => {
    if (!response.ok) {
      throw response //show error when bad response
    } else
      return response.json()
  })
}
