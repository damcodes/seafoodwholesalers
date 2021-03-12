import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { List } from 'semantic-ui-react'

const PendingOrders = ({ orders, currentUser }) => {

  return(
    <List textAlign='center' selection verticalAlign="middle">
      { orders.filter( order => order.order_status === 'pending').length > 0 ?  
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