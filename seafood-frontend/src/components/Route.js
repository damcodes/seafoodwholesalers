import { Table, Segment, Header, Modal, Button, Label } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RouteLineItem from '../components/RouteLineItem'
import FullRouteLineItem from '../components/FullRouteLineItem'
import RouteById from '../components/RouteById'
import Adapter from '../adapters/Adapter'

const Route = ({ route }) => {

  const [ open, setOpen ] = useState(false)
  const [ currentRoute , setCurrentRoute ] = useState(null)
  const [ shipped, setShipped ] = useState(false)

  const statuses = route.orders.map( order => order.order_status ) 
  const stopNumbers = route.orders.map( order => order.stop ) 

  // useEffect(() => {
  //   if (routeChanged) {
  //     Adapter.fetch("GET", `routes/${route.id}`)
  //     .then( res => res.json() )
  //     .then( route => setCurrentRoute(route))
  //   }
  // }, [ routeChanged, route ])

  const ship = () => {
    const orderIds = route.orders.map( order => order.id )
    orderIds.map( id => {
      const body = {
        order: {
          order_status: "shipped"
        }
      }
      return Adapter.fetch("PATCH", `orders/${id}`, body)
    })
    const body = {
      route: {
        status: 'shipped'
      }
    }
    Adapter.fetch("PATCH", `routes/${route.id}`,  body)
    .then( res => res.json() )
    .then( route => {
      setCurrentRoute(route)
      setShipped(true)
      setOpen(false)
    })
  }

  return( 
    route.name ? 
    <Segment textAlign='center' className='route-card-segment' >
      <Link>
        <Header className='route-headers' as='h3'>
          <Modal 
            className='routes-modal'
            centered
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            trigger={<Button positive >{route.name}</Button>}
            dimmer='blurring'
            >
              { route.status === 'delivered' ? <Label attached='top right'>Delivered</Label> : null }
              <Modal.Content>
                <RouteById id={route.id} shipped={shipped}/>  {/* ROUTE BY ID */}
              </Modal.Content>
              <Modal.Actions>
                { route.status !== 'shipped' ? 
                <Button
                  onClick={ship}
                  disabled={(statuses.includes('pending') || statuses.includes('processing') || stopNumbers.includes(0)) || !route.orders.length > 0}
                  positive
                >
                  Ship
                </Button>
                : 
                null
                }
              </Modal.Actions>
          </Modal>
        </Header>
      </Link>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='center'>Stop</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Order #</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Company</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className='route-card-list'>
          { route.orders.sort( (a,b) => a.stop - b.stop ).length > 0 ? 
          route.orders.sort( (a,b) => a.stop - b.stop ).map( order => {
            return(
              <RouteLineItem order={order} />
            )
          })
          : 
          <>
              <Table.Row>
                <Table.Cell/>
                <Table.Cell><Header textAlign='center' as='h4'>No orders</Header></Table.Cell>
                <Table.Cell/>
              </Table.Row>
            </>
        }
        </Table.Body>

      </Table>
    </Segment>
    :
    <div>None</div>
  )
}

export default Route