import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Container, Segment, Icon, List } from 'semantic-ui-react'

const IncomingOrders = () => {

  const [ orders, setOrders ] = useState([])
  const [ refresh, setRefresh ] = useState(2000)

  useEffect(() => {
    fetch(`http://localhost:3001/orders`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( orders => setOrders(orders) )
  }, [])

  useEffect(() => {
    if (refresh && refresh > 0) {
      const interval = setInterval(fetchOrders, refresh)
      return () => clearInterval(interval)
    }
  })

  const fetchOrders = () => {
    fetch(`http://localhost:3001/orders`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( orders => setOrders(orders) )
  }

  return( 
    // <Container textAlign='center' id='orders-window'>
      orders.length > 0 ? 
      <List className='order-route-card' textAlign='center' selection verticalAlign="middle">
        { orders.filter( order => order.order_status === 'pending').map(order => {
            return(
              <List.Item key={order.id} as='a'>
                <Link to={`/orders/${order.id}`}>
                  {/* <Icon name='angle double right' /> */}
                  <List.Content >
                    <List.Header >{`#${order.order_number}`}</List.Header>
                  </List.Content>
                </Link>
              </List.Item>
            )
          })
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
    // </Container>
  )
}

export default IncomingOrders