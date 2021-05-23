import { Table, Button, Container, Icon, Label, Header, Segment } from 'semantic-ui-react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Adapter from '../adapters/Adapter'

const OrderByName = () => {
  let { order_number } = useParams()
  let history = useHistory()
  const [ currentOrder, setCurrentOrder ] = useState(null)
  const [ orderProducts, setOrderProducts ] = useState([])
  const [ user, setUser ] = useState({})
  const [ customer, setCustomer ] = useState({})

  useEffect(() => {
    Adapter.fetch("GET", "current-user")
    .then( res => res.json() )
    .then( user => setUser(user))
  }, [])

  useEffect(() => {
    Adapter.fetch("GET", "orders")
    .then( res => res.json() )
    .then( orders => {
      // debugger
      const order = orders.find( order => order.order_number === parseInt(order_number))
      setCurrentOrder(order)
      fetchCustomer(order)
      Adapter.fetch("GET", "order_products")
      .then( res => res.json() )
      .then( data => {
        const ops = data.filter( op => op.order_id === order.id )
        return setOrderProducts([...orderProducts, ops])
      });
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
    const body = {
      order: {
        order_status: 'processing'
      }
    }
    Adapter.fetch("PATCH", `orders/${currentOrder.id}`, body)
    .then( () => history.push('/profile') )
  }
  
  const complete = () => {
    const body = {
      order: {
        order_status: 'completed'
      }
    }
    Adapter.fetch("PATCH", `orders/${currentOrder.id}`, body)
    .then( () => history.push('/profile') )
  }

  const stringifyDate = date => {
    return date.slice(0,10)
  }

  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    const timeStr = date.toLocaleTimeString()
    return timeStr
  }

  const markDelivered = () => {
    const body = {
      order: {
        order_status: 'delivered'
      }
    }
    Adapter.fetch("PATCH", `orders/${currentOrder.id}`, body)
    .then( () => history.push('/profile') )
  }

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
        <Header as='h3'><span className='order-info'>Company: {customer.company ? <Link to={() => `/companies/${stringToSlug(customer.company.name)}`}>{customer.company.name}</Link> : null }</span></Header>
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
                <Table.HeaderCell colSpan='4' textAlign='center'>Order Status: {currentOrder.order_status === 'completed' ? 'Being routed' : currentOrder.order_status === 'shipped' ? `Shipped @ ${formatTime(currentOrder.updated_at)}` : currentOrder.order_status.charAt(0).toUpperCase() + currentOrder.order_status.slice(1)}</Table.HeaderCell>
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

      { currentOrder.order_status === 'shipped' && user.admin ? 
        <Button positive onClick={markDelivered}>Mark as Delivered</Button>
        :
        null
      }
    </Container>
  )
}

export default OrderByName