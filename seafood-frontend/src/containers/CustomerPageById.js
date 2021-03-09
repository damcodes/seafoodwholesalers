import { useState, useEffect } from 'react'
import { Segment, Header, Icon, Grid } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

const CustomerPageById = () => {

  let { id } = useParams()
  const [ company, setCompany ] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/companies/${id}`,{
      method: "GET",
      headers: {
        'Content-type':'application/json',
        'Authorization': localStorage.getItem('auth_key')
      }
    })
    .then( res => handleResponse(res) )
    .then( company => setCompany(company) )
  })

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

  return(company ? 
    <Grid>
      <Grid.Row centered columns='2'>
        <Grid.Column textAlign='center'>
          <Segment>
            <Header as='h2'>{company.name}</Header>
            <h4>{company.address}</h4>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    : 
    <Header as='h4'><Icon name='spinner'/>Loading Customer...</Header>
  )
}

export default CustomerPageById