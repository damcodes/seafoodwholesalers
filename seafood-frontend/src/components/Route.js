import { Table, Segment, Header, Modal, Button, Tab } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RouteLineItem from '../components/RouteLineItem'
import FullRouteLineItem from '../components/FullRouteLineItem'
import RouteById from '../components/RouteById'

const Route = ({ route, routeChanged, setRouteChanged }) => {

  const [ open, setOpen ] = useState(false)
  const [ currentRoute , setCurrentRoute ] = useState(null)
  const [ shipped, setShipped ] = useState(false)

  const statuses = route.orders.map( order => order.order_status ) 
  const stopNumbers = route.orders.map( order => order.stop )

  useEffect(() => {
    if (routeChanged) {
      fetch(`http://localhost:3001/routes/${route.id}`, {
        method: "GET",
        headers: {
          'Content-type':'application/json',
          'Authorization': localStorage.getItem('auth_key')
        }
      })
      .then( res => res.json() )
      .then( route => setCurrentRoute(route))
    }
  }, [ routeChanged, route ])

  const ship = () => {
    const ids = route.orders.map( order => order.id )
    ids.map( id => {
      return fetch(`http://localhost:3001/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-type':'application/json',
          'Authorization': localStorage.getItem('auth_key')
        },
        body: JSON.stringify({
          order: {
            order_status: 'shipped'
          }
        })
      })
    })
    fetch(`http://localhost:3001/routes/${route.id}`,{
      method: "PATCH",
      headers: {
        'Content-type':'application/json',
        'Authorization':localStorage.getItem('auth_key')
      },
      body: JSON.stringify({
        route: {
          status: 'shipped'
        }
      })
    })
    .then( res => res.json() )
    .then( route => {
      setCurrentRoute(route)
      setShipped(true)
    })
  }

  return( 
    route.name ? 
    route.routeById ? 
    <Segment textAlign='center' id='route-show-card-segment' >
      <Header className='route-headers' as='h3'>{route.name}</Header>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='center'>Stop</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Order #</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Company</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Time Placed</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Time Completed</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className='route-card-list'>
          { route.orders.sort( (a,b) => a.stop - b.stop ).length > 0 ? 
            route.orders.sort( (a,b) => a.stop - b.stop ).map( order => {
              return(route.routeById ? 
                <FullRouteLineItem setRouteChanged={setRouteChanged} routeChanged={routeChanged} order={order} shipped={shipped}/>
                :
                <RouteLineItem order={order} />
              )
            })
            :
            <>
              <Table.Row>
                <Table.Cell/>
                <Table.Cell/>
                <Table.Cell><Header textAlign='center' as='h4'>No orders</Header></Table.Cell>
                <Table.Cell/>
                <Table.Cell/>
              </Table.Row>
            </>
        }
        </Table.Body>

      </Table>
    </Segment>
    :
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
              <Modal.Content>
                <RouteById id={route.id}/>
              </Modal.Content>
              <Modal.Actions>
                { !shipped ? 
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