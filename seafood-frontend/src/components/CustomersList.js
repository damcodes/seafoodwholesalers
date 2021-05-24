import { List, Segment, Header, Grid } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

const CustomersList = ({ sort, searched, companies }) => {
  let history = useHistory()
  let customers = []

  const searchAlgo = (company) => {
    return company.name.toUpperCase().slice(0, searched.length) ===  searched.toUpperCase() || company.name.toUpperCase().includes(searched.toUpperCase()); 
  }

  const sortAlgo = (a, b) => {
    if (a[sort].includes('Fiesta') && b[sort].includes("Fiesta")) {
      return Number(a[sort].split(' ')[1]) - Number(b[sort].split(' ')[1])
    }
    return a[sort].localeCompare(b[sort]) 
  }

  const stringToSlug = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";

    for (var i=0; i < from.length ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
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
      {!(searched && customers.length === 0) ? 
      customers.map( company => {
        return(
          <List.Item key={company.id} onClick={() => history.push(`/companies/${stringToSlug(company.name)}`)}>
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
      })
      :
      <List.Item><Header as='h4'>No Customer Found</Header></List.Item>
    }
    </List>

  )
}

export default CustomersList