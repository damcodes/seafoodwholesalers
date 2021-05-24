import React from 'react'
import { Link } from 'react-router-dom'
import { List } from 'semantic-ui-react'

const PendingOrders = ({ orders }) => {
  return(
    <List animated textAlign='center' selection verticalAlign="middle">
      { orders.filter( order => order.order_status === 'pending').length > 0 ?  
      orders.filter( order => order.order_status === 'pending').map(order => {
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
      <List.Item className='orders'>No Pending Orders</List.Item>
      }
    </List>
  )
}

export default PendingOrders