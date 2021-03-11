import React from 'react'
import {  Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'

const OrdersWindow = ({ orders, currentUser }) => {

  // const [ userOrders, setUserOrders ] = useState(currentUser ? currentUser.orders : {})
  const [ activeOrders, setActiveOrders ] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/orders`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( orders => {
      if (currentUser.admin) {
        setActiveOrders(orders)  
      } else {
        setActiveOrders(orders.filter( order => order.order_status !== 'completed' && order.user_id === currentUser.id))
      }
    })
  }, [ currentUser ])

  return(
    activeOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { orders.filter( order => order.order_status !== 'completed').map(order => {
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
        }
      </List>
    : 
    <Header as='h4' ><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default OrdersWindow
