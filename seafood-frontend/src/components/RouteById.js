import { useEffect, useState } from 'react'
import { Header, Grid, Segment, Table } from 'semantic-ui-react'
import Adapter from '../adapters/Adapter'
import FullRouteLineItem from '../components/FullRouteLineItem'

const RouteById = ({ id, shipped }) => {

    const [route, setRoute] = useState(null);
    const [routeChanged, setRouteChanged] = useState(false);

    useEffect(() => {
        const getRoute = async () => {
            let route = await Adapter.fetch("GET", `routes/${id}`);
            setRoute(route);
        }
        getRoute();
    }, [id])

    return (
        route ?
            <Grid>
                <Grid.Row textAlign='center'>
                    <Grid.Column >
                        <Segment textAlign='center' id='route-show-card-segment' >
                            <Header className='route-headers' as='h3'>{route.name}</Header>
                            <Table celled selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell textAlign='center'>Stop</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>Order #</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>Company</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>Time Placed</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>Order Status</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body className='route-card-list'>
                                    {route.orders.length > 0 ?
                                        route.orders.sort((a, b) => a.stop - b.stop).map(order => {
                                            return (
                                                <FullRouteLineItem order={order} shipped={shipped} routeChanged={routeChanged} setRouteChanged={setRouteChanged} />
                                            )
                                        })
                                        :
                                        <>
                                            <Table.Row>
                                                <Table.Cell />
                                                <Table.Cell />
                                                <Table.Cell><Header textAlign='center' as='h4'>No orders</Header></Table.Cell>
                                                <Table.Cell />
                                                <Table.Cell />
                                            </Table.Row>
                                        </>
                                    }
                                </Table.Body>
                            </Table>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            :
            <Header as='h3'>Loading...</Header>
    )

}

export default RouteById