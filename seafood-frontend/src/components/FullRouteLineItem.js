import { Table, Icon, Button, Input, List } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const FullRouteLineItem = ({ order, setRouteChanged, shipped }) => {
  
  const [ currentOrder , setCurrentOrder ] = useState(null)
  const [ customer, setCustomer ] = useState({})
  const [ input, setInput ] = useState(false)
  const [ stop, setStop ] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/users/${order.user_id}`, {
      method: 'GET',
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( user => setCustomer(user) )
  }, [ order ])

  const handleResponse = res => {
    return res.json()
    .then(json => {
      if (!res.ok) {
        const err = Object.assign({}, json, {
          status: res.status,
          statusText: res.statusText
        })
        return Promise.reject(err)
      }
      return json 
    })
  }

  const routeStop = (order) => {
    if (order.stop === 0 && !shipped) return <Button onClick={() => setInput(!input)} size='tiny'>Route</Button>
    if (order.order_status === 'delivered')  return order.stop
    return <Button positive onClick={() => setInput(!input)} size='tiny'>{order.stop}</Button>
  }
  
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    const timeStr = date.toLocaleTimeString()
    return timeStr
  }

  const updateStopNumber = () => {
    if (stop !== '0' && stop !== '') {
      fetch(`http://localhost:3001/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-type":'application/json',
          "Authorization": localStorage.getItem('auth_key')
        },
        body: JSON.stringify({
          order: {
            stop: stop
          }
        })
      })
      .then( res => handleResponse(res))
      .then( order => {
        setInput(!input)
        setCurrentOrder(order)
      })
    }
    setRouteChanged({changed: true, id: order.id})
  }
  
  return (!currentOrder ? 
    <Table.Row>
      <Table.Cell textAlign='center'>
        {input ? 
          <>
            <Input onChange={e => setStop(e.target.value)} type='number'/> 
            <Button positive 
              onClick={() => updateStopNumber()
            }>
              <Icon name='check'/>
            </Button>
          </>
          : 
          routeStop(order)
        }
      </Table.Cell>
      <Table.Cell textAlign='center'><Link to={`/orders/${order.id}`}>{order.order_number}</Link></Table.Cell>
      <Table.Cell textAlign='center'>{customer.company ? customer.company.name : null}</Table.Cell>
      <Table.Cell textAlign='center'>{formatTime(order.created_at)}</Table.Cell>
      <Table.Cell textAlign='center'>{`${order.order_status.slice(0,1).toUpperCase() + order.order_status.slice(1)} @ ${formatTime(order.updated_at)}`}</Table.Cell>
    </Table.Row>
    :
    <Table.Row>
      <Table.Cell textAlign='center'>
        {input ? 
          <>
            <Input onChange={e => setStop(e.target.value)} type='number'/> 
            <Button positive 
              onClick={() => updateStopNumber()
            }>
              <Icon name='check'/>
            </Button>
          </>
          : 
          routeStop(currentOrder)
        }
      </Table.Cell>
      <Table.Cell textAlign='center'><Link to={`/orders/${currentOrder.id}`}>{currentOrder.order_number}</Link></Table.Cell>
      <Table.Cell textAlign='center'>{customer.company ? customer.company.name : null}</Table.Cell>
      <Table.Cell textAlign='center'>{formatTime(currentOrder.created_at)}</Table.Cell>
      <Table.Cell textAlign='center'>{currentOrder.order_status === 'completed' ? formatTime(currentOrder.updated_at) : currentOrder.order_status.slice(0,1).toUpperCase() + currentOrder.order_status.slice(1)}</Table.Cell>
    </Table.Row>
  )

}

export default FullRouteLineItem