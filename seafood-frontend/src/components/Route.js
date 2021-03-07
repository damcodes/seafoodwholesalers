import { Grid, Table, Segment, Container, Header, Sticky } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLineItem from '../components/RouteLineItem'
import FullRouteLineItem from '../components/FullRouteLineItem'

const Route = ({ route, routeChanged, setRouteChanged }) => {
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
      <Link to={`/routes/${route.id}`}><Header className='route-headers' as='h3'>{route.name}</Header></Link>
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