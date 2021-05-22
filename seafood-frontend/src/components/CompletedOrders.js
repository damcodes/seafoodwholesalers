import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'

const CompletedOrders = ({ orders, currentUser }) => {

  const [ completedOrders, setCompletedOrders ] = useState(null)
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
        setCompletedOrders(orders.filter( order => order.order_status === 'completed'))  
      } else {
        setCompletedOrders(orders.filter( order => order.order_status === 'completed' && order.user_id === currentUser.id))
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
    .then( orders => setCompletedOrders(orders.filter( order => order.order_status === 'completed')) )   
  }

  return(
      completedOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        { completedOrders.length > 0 ? 
          completedOrders.map(order => {
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
          <List.Item>No Completed Orders</List.Item>
        }
      </List>
      :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default CompletedOrders