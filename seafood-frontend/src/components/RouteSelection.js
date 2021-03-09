import { useState, useEffect } from 'react'

const RouteSelection = ({setRouteId}) => {

  const [ routes, setRoutes ] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/routes`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }
    })
    .then( res => handleResponse(res) )
    .then( routes => setRoutes(routes) )
  }, [])

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

  return(routes ? 
    <select onChange={e => setRouteId(e.target.value)}>
      <option value='none'>Route</option>
      { routes.filter(route => route.name !== 'SFW').map( route => {
        return <option value={route.id}>{route.name}</option>
      })}
    </select>
    : 
    null
  )
}

export default RouteSelection