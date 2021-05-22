import { List, Segment, Header, Grid } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'

const CustomersList = ({ sort, searched, companies }) => {
  let history = useHistory()
  let customers = []

  const searchAlgo = (company) => {
    return company.name.toUpperCase().slice(0, searched.length) ===  searched.toUpperCase(); 
  }

  const sortAlgo = (a, b) => {
    if (a[sort].includes('Fiesta') && b[sort].includes("Fiesta")) {
      return Number(a[sort].split(' ')[1]) - Number(b[sort].split(' ')[1])
    }
    return a[sort].localeCompare(b[sort]) 
  }

  
  if (sort && !searched) {
    customers = companies.sort(sortAlgo)
  } else if (!sort && searched) {
    customers = companies.filter(searchAlgo)
  } else if (sort && searched) {
    customers = companies.sort(sortAlgo).filter(searchAlgo)
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