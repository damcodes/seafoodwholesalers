import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import Adapter from '../adapters/Adapter'

const IncomingOrders = () => {

  const [ incomingOrders, setIncomingOrders ] = useState([])
  const [ refresh ] = useState(2000)

  useEffect(() => {
    Adapter.fetch("GET", "orders")
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
    Adapter.fetch("GET", "orders")
    .then( res => res.json() )
    .then( orders => setIncomingOrders(orders.filter(order => order.order_status === 'pending')) )
  }

  return(
      incomingOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { incomingOrders.length > 0 ? 
          incomingOrders.map(order => {
            return(
              <List.Item key={order.order_number} as='a'>
                <Link to={`/orders/${order.order_number}`}>
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