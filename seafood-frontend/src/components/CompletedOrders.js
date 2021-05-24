import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import Adapter from '../adapters/Adapter'

const CompletedOrders = ({ orders }) => {

  const [ completedOrders, setCompletedOrders ] = useState(null)

  useEffect(() => {
    setCompletedOrders(orders)
  }, [ orders ])

  return(
      completedOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { completedOrders.length > 0 ? 
          completedOrders.map(order => {
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
          <List.Item className="orders">No Completed Orders</List.Item>
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default CompletedOrders