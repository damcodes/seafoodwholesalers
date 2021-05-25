import { useState, useEffect } from 'react'
import { Segment, Header, Icon, Grid, Table, List } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'
import Adapter from '../adapters/Adapter'
import MapContainer from '../components/Map'
import PendingOrders from '../components/PendingOrders'
import ProcessingOrders from '../components/ProcessingOrders'
import CompletedOrders from '../components/CompletedOrders'
import ShippedOrders from '../components/ShippedOrders'
import DeliveredOrders from '../components/DeliveredOrders'

const CustomerPageByName = () => {

  let { customerName } = useParams()
  const [ company, setCompany ] = useState(null)
  const [ orders, setOrders ] = useState([]);
  const [ currentUser, setCurrentUser ] = useState({})

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

  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const dateStr = date.toLocaleDateString();
    console.log(dateStr)
    return dateStr;
  }

  useEffect(() => {
    Adapter.fetch("GET", "companies")
    .then( res => handleResponse(res) )
    .then( companies => {
      let company = companies.find( company => stringToSlug(company.name) === stringToSlug(customerName));
      setCompany(company);
    })

    Adapter.fetch("GET", "orders")
    .then( res => res.json() )
    .then( orders => {
       setOrders(orders)
    })

    Adapter.fetch("GET", "current-user")
    .then( res => res.json() )
    .then(setCurrentUser)
  }, [ customerName ])

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
  // debugger
  return(company ? 
    <Grid>
      <Grid.Row centered columns='2'>
        <Grid.Column textAlign='center'>
          <Segment>
            <Header as='h1'>{company.name}</Header>

            <Table celled>
              <Table.Body>
                <Table.Row>
                  <Table.Cell textAlign="right">
                    Address:
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    {company.address}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Customer Since:
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    {formatDate(company.created_at)}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Employees:
                  </Table.Cell>

                  <Table.Cell textAlign="left">
                    <List>
                      {company.users.map( (employee, i) => {
                        return( 
                        <List.Item key={employee.id}>
                          <div id="employee-list">
                            <div id="employee-name">{`(${i+1}) ${employee.first_name} ${employee.last_name}`}</div>
                            <div id='employee-email'>{`${employee.email} (${i+1})`}</div>
                          </div>
                        </List.Item>
                        )
                      })}
                    </List>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Pending Orders: 
                  </Table.Cell>

                  <Table.Cell>
                      <PendingOrders orders={orders.filter( order => order.route_id === company.route_id && order.order_status === "pending" && order.user.company.name === company.name)} />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Processing Orders: 
                  </Table.Cell>

                  <Table.Cell>
                    <ProcessingOrders orders={orders.filter( order => order.route_id === company.route_id && order.order_status === "processing" && order.user.company.name === company.name)} currentUser={currentUser}/>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Completed Orders: 
                  </Table.Cell>

                  <Table.Cell>
                    <CompletedOrders orders={orders.filter( order => order.route_id === company.route_id && order.order_status === "completed" && order.user.company.name === company.name)} currentUser={currentUser}/>                  
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Shipped Orders: 
                  </Table.Cell>

                  <Table.Cell>
                    <ShippedOrders orders={orders.filter( order => order.route_id === company.route_id && order.order_status === "shipped" && order.user.company.name === company.name)} currentUser={currentUser}/>                  
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell textAlign="right">
                    Delivered Orders: 
                  </Table.Cell>

                  <Table.Cell>
                    <DeliveredOrders orders={orders.filter( order => order.route_id === company.route_id && order.order_status === "delivered" && order.user.company.name === company.name)} currentUser={currentUser}/>                  
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

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