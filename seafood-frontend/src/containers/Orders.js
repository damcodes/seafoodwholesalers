import { Grid, Segment } from 'semantic-ui-react'
import { useState, useEffect } from 'react'

function Orders() {
  const [currentUser, setCurrentUser] = useState({})
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/current-user', {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }
    })
    .then( res => res.json() )
    .then( user => {
      setCurrentUser(user)
      setOrders(user.orders)
    })
  }, [])

  return(
    <div>
      <h1>Your Orders</h1>
      <Grid>
        { orders.map(order => {
            return(
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