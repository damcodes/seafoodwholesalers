import { useEffect, useState } from 'react'
import { Header, Grid, Table, Segment } from 'semantic-ui-react'
import Route from './Route'

const RouteById = ({ id }) => {

  const [ route, setRoute ] = useState(null)
  const [ routeChanged, setRouteChanged ] = useState(false)

  const handleResponse = res => {
    return res.json()
    .then(json => {
      if (!res.ok) {
        const err = Object.assign({}, json, {
          status: res.status,
          statusText: res.statusText
        })
        return Promise.reject(err)
      }
      return json 
    })
  }

  useEffect(() => {
    fetch(`http://localhost:3001/routes/${id}`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => handleResponse(res) )
    .then( route => setRoute(route) )
  }, [ id ])

  useEffect(() => {
    // debugger
    if (routeChanged) {
      fetch(`http://localhost:3001/routes/${id}`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => handleResponse(res) )
    .then( route => {
      setRoute(route) 
      setRouteChanged(false)
    })
    }
  }, [ routeChanged, id ])
  // debugger
  
  return(
    route ? 
    <Grid>
      <Grid.Row textAlign='center'>
        {/* <Grid.Column /> */}

        <Grid.Column >
          <Segment id='route-by-id-card'>
            <Route setRouteChanged={setRouteChanged} route={{...route, routeById: true}} />
          </Segment>
        </Grid.Column>

        {/* <Grid.Column /> */}
      </Grid.Row>
    </Grid>
    :
    <Header as='h3'>Loading...</Header>
  )

}

export default RouteById