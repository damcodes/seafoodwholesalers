import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import Adapter from '../adapters/Adapter'

const ShippedOrders = ({ orders, currentUser }) => {

  const [ shippedOrders, setShippedOrders ] = useState(null)
  const [ refresh ] = useState(2000)

  useEffect(() => {
    if (refresh && refresh > 0 && currentUser.admin) {
      const interval = setInterval(fetchAllOrders, refresh)
      return () => clearInterval(interval)
    }
  })

  useEffect(() => {
    setShippedOrders(orders)
  }, [ orders ] )

  const fetchAllOrders = () => {
    Adapter.fetch("GET", "orders")
    .then( res => res.json() )
    .then( orders => setShippedOrders(orders.filter(order => order.order_status === 'shipped')) )   
  }

  return(
      shippedOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { shippedOrders.length > 0 ? 
          shippedOrders.map(order => {
            return(
              <List.Item key={order.id} as='a'>
                <Link to={`/orders/${order.order_number}`}>
                  <List.Content className="orders">
                    <List.Header >{`#${order.order_number}`}</List.Header>
                  </List.Content>
                </Link>
              </List.Item>
            )
          })
          : 
          <List.Item className='orders'>No Shipped Orders</List.Item>
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default ShippedOrders