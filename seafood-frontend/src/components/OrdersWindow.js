import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Container, Segment, Icon, List } from 'semantic-ui-react'

const OrdersWindow = ({ orders, currentUser }) => {

  // const [ userOrders, setUserOrders ] = useState(currentUser ? currentUser.orders : {})

  return( 
    // <Container textAlign='center' id='orders-window'>
      // <Header textAlign='center' as='h2' >Your Orders</Header>
      <List textAlign='center' selection verticalAlign="middle">
        { orders.filter( order => order.order_status !== 'completed').map(order => {
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
        }
      </List>
    // </Container>
  )
}

export default OrdersWindow
