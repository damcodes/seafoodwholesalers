import { Grid, Table, Segment, Container, Header } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import RouteLineItem from '../components/RouteLineItem'

const Route = ({ route }) => {
  console.log(route)
  return( 
    route ? 
    <Segment textAlign='center'>
      <Header className='route-headers' as='h3'>{route.name}</Header>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign='center'>Stop</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Order #</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Company</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          { route.orders.map( order => {
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