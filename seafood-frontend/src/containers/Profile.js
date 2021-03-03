import React from 'react'
import { useState, useEffect } from 'react'
import { Container, Grid, Segment, Header } from 'semantic-ui-react'
import OrdersWindow from '../components/OrdersWindow'
import DailyOrders from '../components/DailyOrders'
import IncomingOrders from '../components/IncomingOrders'
import ProcessingOrders from '../components/ProcessingOrders'
import PendingOrders from '../components/PendingOrders'
import CompletedOrders from '../components/CompletedOrders'
import UserInfo from '../components/UserInfo'

function Profile() {

  const [ orders, setOrders ] = useState([])
  // const [ admin, setAdmin ] = useState(currentUser ? currentUser.admin : null )
  const [ currentUser, setUser ] = useState({})
  const [ refreshInterval, setRefreshInterval ] = useState(2000)

  useEffect(() => {
    const auth = localStorage.getItem("auth_key")
    fetch('http://localhost:3001/current-user', {
      method: "GET", 
      headers: {
        "Content-type":"application/json",
        "Authorization": auth
      }
    })
    .then( res => res.json() )
    .then( user => {
      setUser(user)
      setOrders(user.orders) 
    })
  }, [])

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  })

  // const ifAdmin = () => {
  //   if (currentUser && currentUser.admin ) {
  //     return(
  //       // <Grid.Row id='current-orders-row'>
  //       // <Grid.Column >
  //             <DailyOrders currentUser={currentUser}/>
  //       // </Grid.Column>
  //       // {/* </Grid.Row> */}
  //     ) 
  //   }
  // }

  const fetchData = () => {
    const auth = localStorage.getItem("auth_key")
    fetch('http://localhost:3001/current-user', {
      method: "GET", 
      headers: {
        "Content-type":"application/json",
        "Authorization": auth
      }
    })
    .then( res => res.json() )
    .then( user => {
      setUser(user)
      setOrders(user.orders) 
    })
  }


  return(
    <Container>
      <UserInfo />
      <br/>
      { currentUser.admin ?
      <Grid centered={true}>
        <Grid.Row id='new-order' columns={2}>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Incoming Orders</Header>
              <IncomingOrders />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Being Processed</Header>
              <ProcessingOrders currentUser={currentUser} orders={orders}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Ready for Routing</Header>
              <CompletedOrders currentUser={currentUser} orders={orders}/>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Routes</Header>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column>
              <Segment textAlign='center'>
                <Header as='h2' textAlign='center'>Your Orders</Header>
                <OrdersWindow orders={orders} currentUser={currentUser} />
              </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Orders By Date</Header>
              <DailyOrders currentUser={currentUser} orders={orders}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      :
      <Grid centered={true} >
        <Grid.Row id='new-order' columns={2}>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Pending Orders</Header>
              <PendingOrders currentUser={currentUser} orders={orders} />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>In Processing</Header>
              <ProcessingOrders currentUser={currentUser} orders={orders}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Active Orders</Header>
              <OrdersWindow orders={orders} currentUser={currentUser} />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Being Routed</Header>
              <CompletedOrders currentUser={currentUser} orders={orders}/>
            </Segment>
          </Grid.Column>

          {/* <Segment textAlign='center' floated='right'>
            <Grid.Column floated='right'>
              <DailyOrders currentUser={currentUser}/> 
            </Grid.Column>
          </Segment> */}
        </Grid.Row>
      </Grid>
      }

    </Container>
  )
}

export default Profile