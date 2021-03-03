import { Table, Icon, Button, Input } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const RouteLineItem = ({ order }) => {
  
  const [ currentOrder , setCurrentOrder ] = useState({})
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

  const routeStop = () => {
    if (order.stop === 0) return <Button onClick={() => setInput(!input)} size='tiny'>Route</Button>
    return order.stop 
  }

  return (
    <Table.Row>
      <Table.Cell textAlign='center'>
        {input ? 
          <>
            <Input onChange={e => setStop(e.target.value)} type='number'/> 
            <Button positive 
              onClick={() => {
                setInput(!input)
                if (stop !== '0') {
                  // updateStop()
                  fetch(`http://localhost:3001/orders/${order.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-type":'application/json',
                      "Authorization": localStorage.getItem('auth_key')
                    },
                    body: JSON.stringify({
                      stop: stop
                    })
                  })
                }
                }
              }>
              <Icon name='check'/>
            </Button>
          </>
          : 
          routeStop()
        }
      </Table.Cell>
      <Table.Cell textAlign='center'><Link to={`/orders/${order.id}`}>{order.order_number}</Link></Table.Cell>
      <Table.Cell textAlign='center'>{customer.company ? customer.company.name : null}</Table.Cell>
    </Table.Row>
  )

}

export default RouteLineItem