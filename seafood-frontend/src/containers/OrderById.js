import { Table, Button, Container, Icon, Label, Header, Segment } from 'semantic-ui-react'
import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProcessingOrders from '../components/ProcessingOrders'

const OrderById = () => {
  let { id } = useParams()
  let history = useHistory()
  const [ currentOrder, setCurrentOrder ] = useState(null)
  const [ orderProducts, setOrderProducts ] = useState([])
  const [ user, setUser ] = useState({})
  const [ customer, setCustomer ] = useState({})

  // const fetchOrderProducts = order => {
  //   if (order) {
  //     fetch(`http://localhost:3001/order_products`, {
  //       method: "GET",
  //       headers: {
  //         "Content-type":"application/json",
  //         "Authorization":localStorage.getItem("auth_key")
  //       }
  //     })
  //     .then( res => res.json() )
  //     .then( data => {
  //       const ops = data.filter( op => op.order_id === order.id )
  //       return orderProducts.includes(ops) ? null : setOrderProducts([...orderProducts, ops])
  //       // setOrderProducts(orderProducts.includes(ops) ? orderProducts : [...orderProducts, ops])
  //     })
  //   }
  // }

  useEffect(() => {
    fetch(`http://localhost:3001/current-user`,{
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( user => setUser(user))
  }, [])

  useEffect(() => {
    fetch(`http://localhost:3001/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( order => {
      // debugger
      setCurrentOrder(order)
      fetchCustomer(order)
      fetch(`http://localhost:3001/order_products`, {
        method: "GET",
        headers: {
          "Content-type":"application/json",
          "Authorization":localStorage.getItem("auth_key")
        }
      })
      .then( res => res.json() )
      .then( data => {
        const ops = data.filter( op => op.order_id === order.id )
        // debugger
        return setOrderProducts([...orderProducts, ops])
        // setOrderProducts(orderProducts.includes(ops) ? orderProducts : [...orderProducts, ops])
      })
    })
  }, [])

  const fetchCustomer = order => {
    fetch(`http://localhost:3001/users/${order.user_id}`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( user => setCustomer(user))
  }

  const countDecimals = (val) => {
    if( Math.floor(val) === val ) return 0
    return val.toString().split(".")[1].length || 0
  }

  const pricifyAndStringify = (num) => {
    const numString = num.toString()
    if (Number.isInteger(num)) return `$${num}.00`
    if (countDecimals(num) === 1) return `$${num}0`
    if (countDecimals(num) > 2) return `$${numString.slice(0, numString.indexOf('.') + 3)}`
    return `$${num}`
  }

  const process = () => {
    fetch(`http://localhost:3001/orders/${currentOrder.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      },
      body: JSON.stringify({
        order: {
          order_status: 'processing'
        }
      })
    })
    .then( () => history.push('/profile') )
  }
  
  const complete = () => {
    fetch(`http://localhost:3001/orders/${currentOrder.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      },
      body: JSON.stringify({
        order: {
          order_status: 'completed'
        }
      })
    })
    .then( () => history.push('/profile') )
  }

  const stringifyDate = date => {
    return date.slice(0,10)
  }

  return(
    !currentOrder || !orderProducts ? 
    <Header as='h3'><Icon name='spinner'/>Loading New Order...</Header>
    :
    <Container>
      <Segment>
        <Header as='h2'>
          {/* <Icon name='file outline' /> */}
          <span className='order-info'>Order #: {currentOrder.order_number}</span>
        </Header>
        <Header as='h3'><span className='order-info'>Customer: {customer ? `${customer.first_name} ${customer.last_name}` : null}</span></Header>
        <Header as='h3'><span className='order-info'>Company: {`${customer.company ? customer.company.name : null }`}</span></Header>
        <Header as='h3'><span className='order-info'>Date: {stringifyDate(currentOrder.created_at)}</span></Header>

        <Table striped compact celled definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign='left'></Table.HeaderCell>
              <Table.HeaderCell textAlign='right'>$/lb.</Table.HeaderCell>
              <Table.HeaderCell textAlign='right'>Order Weight</Table.HeaderCell>
              <Table.HeaderCell textAlign='right'>Cost</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentOrder.products.map( lineItem => {
              return(
                <Table.Row>
                  <Table.Cell>{lineItem.description}</Table.Cell>
                  <Table.Cell textAlign='right'>{pricifyAndStringify(lineItem.price)}</Table.Cell>
                  <Table.Cell textAlign='right'>{orderProducts[0] ? orderProducts[0].filter( op => op.product_id === lineItem.id)[0].weight : null}</Table.Cell>
                  <Table.Cell textAlign='right'>{orderProducts[0] ? pricifyAndStringify(orderProducts[0].filter( op => op.product_id === lineItem.id)[0].weight * lineItem.price) : null }</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row textAlign='center' >
              <Table.HeaderCell
                colSpan='4'
                textAlign='right'
              >
                <Label as='a' tag size='big'>{`${pricifyAndStringify(currentOrder.order_total)}`}</Label>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>

          { user.admin || user.id === currentOrder.user_id ? 
            <Table.Footer fullWidth>
              <Table.Row textAlign='center' >
                <Table.HeaderCell colSpan='4' textAlign='center'>Order Status: {currentOrder.order_status === 'completed' ? 'Being routed' : currentOrder.order_status.charAt(0).toUpperCase() + currentOrder.order_status.slice(1)}</Table.HeaderCell>
              </Table.Row>
            </Table.Footer> 
            :
            null
          }
        </Table>
      </Segment>

      { currentOrder.order_status === 'pending' && user.admin ? 
        <Button positive onClick={process}>Process</Button>
        :
        null
      }

      { currentOrder.order_status === 'processing' && user.admin ? 
        <Button positive onClick={complete}>Complete</Button> 
        : 
        null
      }
    </Container>
  )
}

export default OrderById