import { Table, Segment, Header, Modal, Button } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RouteLineItem from '../components/RouteLineItem'
import FullRouteLineItem from '../components/FullRouteLineItem'
import RouteById from '../components/RouteById'

const Route = ({ route, routeChanged, setRouteChanged }) => {

  const [ open, setOpen ] = useState(false)
  const [ currentRoute , setCurrentRoute ] = useState(null)

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
  }, [])

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
          { route.orders.sort( (a,b) => a.stop - b.stop ).map( order => {
            return(route.routeById ? 
              <FullRouteLineItem setRouteChanged={setRouteChanged} routeChanged={routeChanged} order={order} />
              :
              <RouteLineItem order={order} />
            )
          })}
        </Table.Body>

      </Table>
    </Segment>
    :
    <Segment textAlign='center' className='route-card-segment' >
      <Link>
        <Header className='route-headers' as='h3'>
          <Modal 
            className='routes-modal'
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            trigger={<Button positive >{route.name}</Button>}
            dimmer='blurring'
            >
              <Modal.Content>
                <RouteById id={route.id}/>
              </Modal.Content>
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
          { route.orders.sort( (a,b) => a.stop - b.stop ).map( order => {
            return(
              <RouteLineItem order={order} />
            )
          })}
        </Table.Body>

      </Table>
    </Segment>
    :
    <div>None</div>
  )
}

export default Route