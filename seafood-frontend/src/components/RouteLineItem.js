import { Table } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Adapter from '../adapters/Adapter'

const RouteLineItem = ({ order }) => {
  
  const [ currentOrder , setCurrentOrder ] = useState(order)
  const [ customer, setCustomer ] = useState({})
  const [ input, setInput ] = useState(false)
  const [ stop, setStop ] = useState(null)

  useEffect(() => {
    Adapter.fetch("GET", `users/${order.user_id}`)
    .then( res => res.json() )
    .then( user => setCustomer(user) )
  }, [ order ])

  const stringToSlug = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";

    for (var i=0; i < from.length ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
  }


  return (
    <Table.Row>
      <Table.Cell textAlign='center'>
        {order.stop}
      </Table.Cell>
      <Table.Cell textAlign='center'><Link to={`/orders/${currentOrder.order_number}`}>{currentOrder.order_number}</Link></Table.Cell>
      <Table.Cell textAlign='center'><Link to={customer.company ? `/companies/${stringToSlug(customer.company.name)}`: null}>{customer.company ? customer.company.name : null}</Link></Table.Cell>
    </Table.Row>
  )

}

export default RouteLineItem