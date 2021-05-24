import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import Adapter from '../adapters/Adapter'

const ProcessingOrders = ({ orders, currentUser }) => {

  const [ processingOrders, setProcessingOrders ] = useState(null)
  
  useEffect(() => {
    setProcessingOrders(orders)
  }, [ orders ])
  
  return(
    processingOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        {processingOrders.length > 0 ? 
            processingOrders.map(order => {
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
            <List.Item className='orders'>No Processing Orders</List.Item>
        }
      </List>
    :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default ProcessingOrders