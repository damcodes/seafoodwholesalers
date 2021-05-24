import { useState, useEffect } from 'react'
import { Container, Grid, Segment, Header } from 'semantic-ui-react'
import OrdersWindow from '../components/OrdersWindow'
import DailyOrders from '../components/DailyOrders'
import IncomingOrders from '../components/IncomingOrders'
import ProcessingOrders from '../components/ProcessingOrders'
import PendingOrders from '../components/PendingOrders'
import CompletedOrders from '../components/CompletedOrders'
import UserInfo from '../components/UserInfo'
import ShippedOrders from '../components/ShippedOrders'
import DeliveredOrders from '../components/DeliveredOrders'
import Adapter from '../adapters/Adapter'

function Profile() {

  const [ orders, setOrders ] = useState([])
  const [ currentUser, setUser ] = useState({})
  const [ refreshInterval ] = useState(1000)

  useEffect(() => {
    Adapter.fetch("GET", "current-user")
    .then( res => res.json() )
    .then( user => {
      setUser(user)
      setOrders(user.orders) 
    })
  }, [])

  useEffect(() => {
    Adapter.fetch("GET", "orders")
    .then( res => res.json() )
    .then(setOrders)
  }, [])

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  })

  const fetchData = () => {
    Adapter.fetch("GET", "current-user")
    .then( res => res.json() )
    .then( user => {
      setUser(user)
    })

    Adapter.fetch("GET", "orders")
    .then( res => res.json() )
    .then(setOrders)
  }
  
  return(
    <Container id='profile-page'>
      <UserInfo />
      <br/>
      { currentUser.admin ?
      <Grid centered={true}>
        <Grid.Row id='new-order' columns={2} >
          <Grid.Column>
            <Segment  textAlign='center'>
              <Header as='h2' textAlign='center'>Incoming Orders</Header>
              <IncomingOrders orders={orders.filter( order => order.order_status === 'pending')} />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Being Processed</Header>
              <ProcessingOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'processing')} />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Completed Orders</Header>
              <CompletedOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'completed')} />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Shipped Orders</Header>
              <ShippedOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'shipped')} />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Delivered Orders</Header>
              <DeliveredOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'delivered')} />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
        <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Your Orders</Header>
              <OrdersWindow currentUser={currentUser} orders={orders.filter( order => order.user_id === currentUser.id)} />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column>
            <Segment className='order-route-card' textAlign='center'>
              <Header as='h2' textAlign='center'>Orders By Date</Header>
              <DailyOrders currentUser={currentUser} orders={orders} />
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
              <PendingOrders currentUser={currentUser} orders={orders.filter(order => order.order_status === 'pending' && order.user_id === currentUser.id)} />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>In Processing</Header>
              <ProcessingOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'processing' && order.user_id === currentUser.id)}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Processed/Being Routed</Header>
              <CompletedOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'completed' && order.user_id === currentUser.id)}/>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Shipped</Header>
              <ShippedOrders currentUser={currentUser} orders={orders.filter( order => order.order_status === 'shipped' && order.user_id === currentUser.id)} />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment textAlign='center'>
              <Header as='h2' textAlign='center'>Delivered Orders</Header>
              <DeliveredOrders currentUser={currentUser} orders={orders.filter( order => order.order_stats === 'delivered' && order.user_id === currentUser.id)} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      }

    </Container>
  )
}

export default Profile