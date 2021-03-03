import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Container, Segment, Icon, List } from 'semantic-ui-react'

const PendingOrders = ({ orders, currentUser }) => {

  const [ user, setUser ] = useState(currentUser ? currentUser : {})

  // useEffect(() => {
  //   fetch(`http://localhost:3001/orders`, {
  //     method: "GET",
  //     headers: {
  //       "Content-type":"application/json",
  //       "Authorization":localStorage.getItem("auth_key")
  //     }
  //   })
  //   .then( res => res.json() )
  //   .then( orders => setOrders(orders))
  // }, [])

  return(
    <List textAlign='center' selection verticalAlign="middle">
      { orders.filter( order => order.order_status === 'pending').length !== 0 ?  
      orders.filter( order => order.order_status === 'pending').map(order => {
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
      :
      <List.Item>No Pending Orders</List.Item>
      }
    </List>
  )
}

export default PendingOrders