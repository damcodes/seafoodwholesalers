import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Icon, List, Input, Button } from 'semantic-ui-react';
import Adapter from '../adapters/Adapter';

const DailyOrders = () => {

  const [ allOrders, setAllOrders ] = useState([]);
  const [ date, setDate ] = useState(null);
  const [ filtered, setFiltered ] = useState(false);
  const [ orderNumber, setOrderNumber ] = useState(null);

  useEffect( () => {
    const getOrders = async () => {
        let res = await Adapter.fetch("GET", "orders");
        let data = await res.json();
        setAllOrders(data);
    }
    getOrders();
  }, [])

  const filteredOrders = orders => {
    const filtered = orderNumber ? orders.filter( order => order.created_at.slice(0,10) === date && order.order_number.toString().includes(orderNumber)) : orders.filter( order => order.created_at.slice(0,10) === date)
    console.log(filtered)
    return(
      <>
        <Input onChange={e => setOrderNumber(e.target.value)} id="search-orders" type="text" size="small" placeholder="Search Order Number..."/>
        <List className='order-card-list' selection verticalAlign="middle">
          { filtered.length > 0 ? 
          filtered.map( order => {
            return(
              <List.Item key={order.id} as='a'>
                <Link to={`/orders/${order.order_number}`}>
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
      </>
    )
  }

  return(
    <div>
      <Input type="date" onChange={e => {
          console.log(e.target.value)
            setDate(e.target.value.slice(0,10))
      }}/>
      <Button id="orders-by-date" floated='right' onClick={() => setFiltered(!filtered)} circular='true' >
        <Icon name='search' onClick={() => setFiltered(!filtered)}/>
      </Button>
      {  filtered ? filteredOrders(allOrders) : null }
    </div>
  )
}

export default DailyOrders;