import { Grid } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import Adapter from '../adapters/Adapter';

function Orders() {
    const [currentUser, setCurrentUser] = useState({})
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const getUserAndOrders = async () => {
            let user = await Adapter.fetch('GET', 'current-user');
            setCurrentUser(user)
            setOrders(user.orders);
        };
        getUserAndOrders();
    }, [])

    return (
        <div>
            <h1>Your Orders</h1>
            <Grid>
                {orders.map(order => {
                    return (
                        <Grid.Row centered={true}>
                            {order.created_at}
                        </Grid.Row>
                    )
                })}
            </Grid>
        </div>
    )
}

export default Orders