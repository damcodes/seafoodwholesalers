import React from 'react'
import {  Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'

const OrdersWindow = ({ orders, currentUser }) => {
  return(
    orders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { orders.filter( order => order.order_status !== 'completed').length > 0 ? 
            orders.filter( order => order.order_status !== 'completed').map(order => {
              return(
                <List.Item key={order.id} as='a'>
                  <Link to={`/orders/${order.order_number}`}>
                     <List.Content >
                      <List.Header >{`#${order.order_number}`}</List.Header>
                    </List.Content>
                  </Link>
                </List.Item>
              )
            })
            :
            <List.Item>No Active Orders</List.Item>
        }
      </List>
    : 
    <Header as='h4' ><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default OrdersWindow
