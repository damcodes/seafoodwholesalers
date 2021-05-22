import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'

const IncomingOrders = () => {

  const [ incomingOrders, setIncomingOrders ] = useState([])
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
    .then( orders => setIncomingOrders(orders.filter( order => order.order_status === 'pending')) )
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
    .then( orders => setIncomingOrders(orders.filter(order => order.order_status === 'pending')) )
  }

  return(
      incomingOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { incomingOrders.length > 0 ? 
          incomingOrders.map(order => {
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
          <List.Item>No Incoming Orders</List.Item>
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default IncomingOrders