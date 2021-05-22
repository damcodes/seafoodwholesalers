import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Icon, List, Input, Button } from 'semantic-ui-react'

const DailyOrders = () => {

  const [ allOrders, setAllOrders ] = useState([])
  const [ date, setDate ] = useState(null)
  const [ filtered, setFiltered ] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:3001/orders`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }
    })
    .then( res => res.json() )
    .then( data => setAllOrders(data) )
  }, [])
  
  useEffect(() => {
    console.log(date)
  }, [ date ])

  const filteredOrders = orders => {
    // debugger
    const filtered = orders.filter( order => order.created_at.slice(0,10) === date)
    return(
      <List className='order-card-list' selection verticalAlign="middle">
        { filtered.length > 0 ? 
        filtered.map( order => {
          return(
            <List.Item key={order.id} as='a'>
              {/* <Icon name='angle double right' /> */}
              <Link to={`/orders/${order.id}`}>
                <List.Content >
                  <List.Header >#{order.order_number}</List.Header>
                </List.Content>
              </Link>
            </List.Item>
          )
        })
        :
        <List.Item>
          <List.Content>
            <List.Header>No Orders</List.Header>
          </List.Content>
        </List.Item>
        }
      </List>
    )
  }

  return(
    <div>
      <Input type="date" onChange={e => {
          console.log(e.target.value)
          // console.log(Date(e.target.value).getDay())
            setDate(e.target.value.slice(0,10))
      }}/>
      <Button id="orders-by-date" floated='right' onClick={() => setFiltered(!filtered)} circular='true' >
        <Icon name='search' onClick={() => setFiltered(!filtered)}/>
      </Button>
      {  filtered ? filteredOrders(allOrders) : null }
    </div>
  )
}

export default DailyOrders