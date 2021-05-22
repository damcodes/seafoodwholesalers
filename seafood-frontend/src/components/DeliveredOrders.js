import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'

const DeliveredOrders = ({ orders, currentUser }) => {

  const [ deliveredOrders, setDeliveredOrders ] = useState(null)
  const [ refresh ] = useState(2000)

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
        setDeliveredOrders(orders.filter( order => order.order_status === 'delivered'))  
      } else {
        setDeliveredOrders(orders.filter( order => order.order_status === 'delivered' && order.user_id === currentUser.id))
      }
    })
  }, [ currentUser ])
  

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
    .then( orders => setDeliveredOrders(orders.filter(order => order.order_status === 'delivered')) )   
  }

  return(
      deliveredOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { deliveredOrders.length > 0 ? 
          deliveredOrders.map(order => {
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
          <List.Item>No Delivered Orders</List.Item>
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default DeliveredOrders