import { Grid, Table, Segment, Container, Header } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import Route from '../components/Route'

const Routes = () => {
  
  const [ routes, setRoutes ] = useState([])
  
  useEffect(() => {
    fetch(`http://localhost:3001/routes`)
    .then( res => res.json() )
    .then( routes => setRoutes(routes) )
  }, [])


    return(
    <Container>
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
    </Container>
  )
}

export default Routes