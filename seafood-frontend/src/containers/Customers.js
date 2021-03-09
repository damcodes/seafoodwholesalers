import { useEffect, useState } from 'react'
import { Grid, List, Segment, Header, Icon, Label, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import CustomersList from '../components/CustomersList'

const Customers = () => {

  const [ companies, setCompanies ] = useState(null)
  const [ sort, setSort ] = useState(null)
  const [ searched, setSearched ] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/companies`, {
      method: "GET",
      headers: {
        'Content-type':'application/json',
        'Authorization': localStorage.getItem('auth_key')
      }
    })
    .then( res => res.json() )
    .then( companies => setCompanies(companies) )
  }, [])

  return(companies ? 
    <Grid>
      <Grid.Row columns='2'>
        <Grid.Column>
          <Label>Sort By:</Label>
          <select onChange={e => setSort(e.target.value)}>
            <option></option>
            <option value='name'>Name</option>
          </select>
        </Grid.Column>

        <Grid.Column>
          <Input onChange={e => setSearched(e.target.value)} icon='search' placeholder='Search...'/>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row columns='2' centered>
        <Grid.Column textAlign='center'>
          <Segment>
            <CustomersList sort={sort} searched={searched} companies={companies.filter(company => company.name !== 'Seafood Wholesalers')} />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    :
    <Header as='h2'><Icon name='spinner'/>Loading Customers...</Header>
  )
}

export default Customers