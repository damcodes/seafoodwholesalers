import { Grid, Container, Header, Icon } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import Route from '../components/Route'

const Routes = () => {
  
  const [ routes, setRoutes ] = useState([])
  const [ refreshInterval, setRefreshInterval ] = useState(2000)
  
  useEffect(() => {
    fetch(`http://localhost:3001/routes`)
    .then( res => res.json() )
    .then( routes => setRoutes(routes) )
  }, [])

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchRoutes, refreshInterval)
      return () => clearInterval(interval)
    }
  })

  const fetchRoutes = () => {
    fetch(`http://localhost:3001/routes`)
    .then( res => res.json() )
    .then( routes => setRoutes(routes) )
  }


    return(
    <Container>
      { routes.length > 0 ? 
      <Grid centered>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Route route={routes[0]} />
          </Grid.Column>

          <Grid.Column>
            <Route route={routes[1]} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Route route={routes[2]} />
          </Grid.Column>

          <Grid.Column>
            <Route route={routes[3]} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Route route={routes[4]} />
          </Grid.Column>

          <Grid.Column>
            <Route route={routes[5]} />
          </Grid.Column>
        </Grid.Row>

      </Grid>
      :
      <Header textAlign='center' colSpan='6' as='h2'><Icon name='spinner' />Loading Info...</Header>
      } 
    </Container>
  )
}

export default Routes