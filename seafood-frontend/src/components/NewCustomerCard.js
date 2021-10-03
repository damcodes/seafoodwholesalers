import { Segment, Form, Button, Grid, Input } from 'semantic-ui-react';
import { useState } from 'react';
import StateSelection from '../components/StateSelection';
import RouteSelection from '../components/RouteSelection';
import PhoneInput from 'react-phone-number-input/input';

const NewCustomerCard = ({ addNewCustomer }) => {

  const [ name, setName ] = useState(null);
  const [ number, setNumber ] = useState(null);
  const [ address, setAddress ] = useState(null);
  const [ city, setCity ] = useState(null);
  const [ state, setState ] = useState(null);
  const [ zip, setZip ] = useState(null);
  const [ routeId, setRouteId ] = useState(null);


  return(
    <Segment id='new-customer-card' textAlign='center'>
      <h1 id='new-customer-header'>New Customer</h1>
      <Form id='new-customer-form' onSubmit={() => addNewCustomer(name, number, address, city, state, zip, routeId)}>
        <Grid centered>
          <Grid.Row centered>
            <Grid.Column>
              <Form.Field>
                <Input id='new-customer-input' onChange={e => setName(e.target.value)} placeholder="Company/Restaurant name" />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Grid.Column>
              <Form.Field>
                <PhoneInput country='US' id='new-customer-input' value={number} onChange={setNumber} placeholder="Phone Number" />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Form.Field>
                <Input size='large' id='new-customer-input' placeholder='12345 Street Address Dr.' type='text' onChange={(e) => setAddress(e.target.value)}/>
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered columns='3'>
            <Grid.Column>
              <Form.Field>
                <Input placeholder='City' type='text' onChange={e => setCity(e.target.value)} />
              </Form.Field>
            </Grid.Column>

            <Grid.Column>
              <Form.Field>
                <StateSelection setState={setState}/>              
              </Form.Field>
            </Grid.Column>

            <Grid.Column>
              <Form.Field>
                <Input onChange={e => setZip(e.target.value)} placeholder='Zip Code'/>
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns='3' centered>
            <Grid.Column>
              <Form.Field>
                <RouteSelection setRouteId={setRouteId}/>
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns='1' centered>
            <Grid.Column centered>
              <Button 
                fluid 
                type='submit' 
                positive
              >Add Customer</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  )
}

export default NewCustomerCard