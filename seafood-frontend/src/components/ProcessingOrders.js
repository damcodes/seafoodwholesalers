import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header, Icon, List } from 'semantic-ui-react'

const ProcessingOrders = ({ orders, currentUser }) => {

  const [ processingOrders, setProcessingOrders ] = useState(null)
  const [ refresh, setRefresh ] = useState(5000)

  useEffect(() => {
    if (refresh && refresh > 0 && currentUser.admin) {
      const interval = setInterval(fetchAllOrders, refresh)
      return () => clearInterval(interval)
    }
  })

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
        setProcessingOrders(orders.filter( order => order.order_status === 'processing'))  
      } else {
        setProcessingOrders(orders.filter( order => order.order_status === 'processing' && order.user_id === currentUser.id))
      }
    })
  }, [ currentUser ])

  const fetchAllOrders = () => {
    fetch(`http://localhost:3001/orders`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( ordersData => setProcessingOrders(ordersData.filter( order => order.order_status === 'processing')) )
  }

  return(
    processingOrders ? 
      <List className='order-card-list' textAlign='center' selection verticalAlign="middle">
        {processingOrders.length > 0 ? 
            processingOrders.map(order => {
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
            <List.Item>No Processing Orders</List.Item>
        }
      </List>
    :
      <Header as='h4'><Icon name='spinner'/>Loading Orders...</Header>
  )
}

export default ProcessingOrders