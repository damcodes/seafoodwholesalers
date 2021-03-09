import { List, Segment, Header, Grid } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'

const CustomersList = ({ sort, searched, companies }) => {
  let history = useHistory()
  let customers = []

  
  if (sort && !searched) {
    customers = companies.sort( (a, b) => {
      if (a[sort].includes('Fiesta') && b[sort].includes("Fiesta")) {
        return Number(a[sort].split(' ')[1]) - Number(b[sort].split(' ')[1])
      }
      return a[sort].localeCompare(b[sort]) 
    })
  } else if (!sort && searched) {
    customers = companies.filter( company => company.name.toUpperCase().slice(0, searched.length) ===  searched.toUpperCase() )
  } else if (sort && searched) {
    customers = companies.sort( (a, b) => {
      if (a[sort].includes('Fiesta') && b[sort].includes("Fiesta")) {
        return Number(a[sort].split(' ')[1]) - Number(b[sort].split(' ')[1])
      }
      return a[sort].localeCompare(b[sort]) 
    })
    .filter( company => company.name.toUpperCase().slice(0, searched.length) ===  searched.toUpperCase() )
  } else {
    customers = companies
  }

  return(
    <List selection>
      { customers.map( company => {
        return(
          <List.Item onClick={() => history.push(`/companies/${company.id}`)}>
            <Segment>
              <Grid>
                <Grid.Row columns='2'>
                  <Grid.Column>
                    <Header as='h3'>{company.name}</Header>
                  </Grid.Column>

                  <Grid.Column>
                    <Header as='h3'>{`(${company.phone_number.slice(0,3)}) ${company.phone_number.slice(3,6)}-${company.phone_number.slice(6,10)}`}</Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </List.Item>
        )
      })}
    </List>
  )
}

export default CustomersList