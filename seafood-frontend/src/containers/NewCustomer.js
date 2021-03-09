import { Grid } from 'semantic-ui-react'
import NewCustomerCard from '../components/NewCustomerCard'
import { useHistory } from 'react-router-dom'

const NewCustomer = () => {

  let history = useHistory()

  const handleResponse = res => {
    return res.json()
    .then(json => {
      if (!res.ok) {
        const err = Object.assign({}, json, {
          status: res.status,
          statusText: res.statusText
        })
        return Promise.reject(err)
      }
      return json 
    })
  }

  const addNewCustomer = (name, address, city, state, zip, routeId) => {
    const fullAddress = `${address}, ${city}, ${state} ${zip}`
    fetch(`http://localhost:3001/companies`, {
      method: "POST",
      headers: {
        "Content-type":'application/json',
        "Authorization": localStorage.getItem('auth_key')
      },
      body: JSON.stringify({
        company: {
          name: name, 
          address: fullAddress,
          route_id: routeId
        }
      })
    })
    .then( res => handleResponse(res) )
    .then( customer => history.push(`/companies/${customer.id}`))
  }
  
  return(
    <Grid>
      <Grid.Row columns='3'>
        <Grid.Column />

        <Grid.Column>
          <NewCustomerCard addNewCustomer={addNewCustomer}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

}

export default NewCustomer