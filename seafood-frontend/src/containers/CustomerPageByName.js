import { useState, useEffect } from 'react'
import { Segment, Header, Icon, Grid } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'
import Adapter from '../adapters/Adapter'
import MapContainer from '../components/Map'

const CustomerPageByName = () => {

  let { name } = useParams()
  const [ company, setCompany ] = useState(null)

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

  useEffect(() => {
    Adapter.fetch("GET", "companies")
    .then( res => handleResponse(res) )
    .then( companies => {
      let company = companies.find( company => stringToSlug(company.name) === stringToSlug(name));
      setCompany(company);
    })
  }, [ name ])

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

      <div id="outer-container">
        <MapContainer company={company} />
      </div>
    </Grid>
    : 
    <Header as='h4'><Icon name='spinner'/>Loading Customer...</Header>
  )
}

export default CustomerPageByName