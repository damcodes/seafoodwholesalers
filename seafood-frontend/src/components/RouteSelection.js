import { useState, useEffect } from 'react'
import Adapter from '../adapters/Adapter'

const RouteSelection = ({ setRouteId }) => {

    const [routes, setRoutes] = useState(null)

    useEffect(() => {
        const getRoutes = async () => {
            let routes = await Adapter.fetch('GET', `routes`);
            setRoutes(routes);
        };
        getRoutes();
    }, [])

    return (routes ?
        <select onChange={e => setRouteId(e.target.value)}>
            <option value='none'>Route</option>
            {routes.filter(route => route.name !== 'SFW').map(route => {
                return <option value={route.id}>{route.name}</option>
            })}
        </select>
        :
        null
    )
}

export default RouteSelection