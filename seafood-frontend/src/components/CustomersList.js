import { List } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const CustomersList = ({ sort, searched, companies }) => {

  let customers = []
  if (sort && !searched) {
    customers = companies.sort( (a, b) => {
      if (a[sort].includes('Fiesta') && b[sort].includes("Fiesta")) {
        return Number(a[sort].split(' ')[1]) - Number(b[sort].split(' ')[1])
      }
      return a[sort].localeCompare(b[sort]) 
    })
    // debugger
  } else if (!sort && searched) {
    customers = companies.filter( company => company.name.toUpperCase().slice(0, searched.length) ===  searched.toUpperCase() )
    // debugger
  } else {
    customers = companies
  }

  return(
    <List>
      { customers.map( company => {
        return <List.Item><Link to={`/companies/${company.id}`}>{company.name}</Link></List.Item>
      })}
    </List>
  )
}

export default CustomersList