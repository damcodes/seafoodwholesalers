import {Table} from 'semantic-ui-react'
import { useState, useEffect } from 'react'

const RouteLineItem = ({ order }) => {
  
  const [ customer, setCustomer ] = useState({})

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

  return (
    <Table.Row>
      <Table.Cell></Table.Cell>
      <Table.Cell textAlign='center'>{order.order_number}</Table.Cell>
      <Table.Cell textAlign='center'>{customer.company ? customer.company.name : null}</Table.Cell>
    </Table.Row>
  )

}

export default RouteLineItem