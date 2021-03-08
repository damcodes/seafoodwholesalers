import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Container, Segment, Icon, List } from 'semantic-ui-react'

const ProcessingOrders = ({ orders, currentUser }) => {

  const [ allOrders, setAllOrders ] = useState([])
  // const [ user, setUser ] = useState(currentUser)
  const [ refresh, setRefresh ] = useState(2000)

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
    .then( ordersData => setAllOrders(ordersData) )
  }

  return(
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { !currentUser.admin ? 
            orders.length > 0 ? 
            orders.filter( order => order.order_status === 'processing' && order.user_id === currentUser.id).map(order => {
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
            <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
          :
          allOrders.filter( order => order.order_status === 'processing').map(order => {
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
  )
}

export default ProcessingOrders