import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Container, Segment, Icon, List } from 'semantic-ui-react'

const CompletedOrders = ({ orders, currentUser }) => {

  const [ incomingOrders, setIncomingOrders ] = useState([])
  const [ allOrders, setAllOrders ] = useState([])
  // const [ user, setUser ] = useState(currentUser)
  const [ refresh, setRefresh ] = useState(2000)

  // useEffect(() => {
  //   fetch(`http://localhost:3001/orders`, {
  //     method: "GET",
  //     headers: {
  //       "Content-type":"application/json",
  //       "Authorization":localStorage.getItem("auth_key")
  //     }
  //   })
  //   .then( res => res.json() )
  //   .then( orders => setOrders(orders) )
  // }, [])

  useEffect(() => {
    if (refresh && refresh > 0 && currentUser.admin) {
      const interval = setInterval(fetchAllOrders, refresh)
      return () => clearInterval(interval)
    }
  })

  const fetchAllOrders = () => {
    fetch(`http://localhost:3001/orders`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( orders => setAllOrders(orders) )   
  }

  return( 
    // <Container textAlign='center' id='orders-window'>
      incomingOrders.length > 0 || allOrders.length > 0 ?
      <List className='order-route-card' textAlign='center' selection verticalAlign="middle">
        { !currentUser.admin ? 
          orders.filter( order => order.order_status === 'completed' && order.user_id === currentUser.id).map(order => {
            return(
              <List.Item key={order.id} as='a'>
                <Link to={`/orders/${order.id}`}>
                  <List.Content >
                    <List.Header >{`#${order.order_number}`}</List.Header>
                  </List.Content>
                </Link>
              </List.Item>
            )
          })
          :
          allOrders.filter( order => order.order_status === 'completed').map(order => {
            return(
              <List.Item key={order.id} as='a'>
                <Link to={`/orders/${order.id}`}>
                  <List.Content>
                      <List.Header>{`#${order.order_number}`}</List.Header>
                  </List.Content>
                </Link>
              </List.Item>
            )
          })
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default CompletedOrders