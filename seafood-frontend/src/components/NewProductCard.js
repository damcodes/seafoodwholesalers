import { Segment, Form, Button, Grid, Input, Header, Label, Checkbox, Icon } from 'semantic-ui-react'
import { useState, useEffect } from 'react' 

const NewProductCard = ({ addNewItem, setOpen }) => {

  const [ description, setDescription ] = useState(null)
  const [ itemNumber, setItemNumber ] = useState(null)
  const [ price, setPrice ] = useState(null)
  const [ initialWeight, setInitialWeight ] = useState(null)
  const [ active, setActive ] = useState(false)

  return(
    <Segment id='new-product-card'>
      <Header id='new-product-header' as='h2'>New Item</Header>
      <Form id='new-product-form' onSubmit={e => {
        addNewItem(e, description, itemNumber, price, initialWeight, active)
        setOpen(false)
      }}>
        <Grid centered>
          <Grid.Row centered>
            <Grid.Column>
              <Form.Field>
                <Input type='text' id='new-customer-input' onChange={e => setDescription(e.target.value)} placeholder='Description' />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns='4'>
            <Grid.Column>
              <Input type='text' onChange={e => setItemNumber(e.target.value)} placeholder='Item Number' />
            </Grid.Column>

            <Grid.Column>
              <Input labelPosition='left' type='number' step='0.01' onChange={e => setPrice(Number(e.target.value))} placeholder='Price/lb.'>
                <Label basic>$</Label>
                <input />
              </Input>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns='4'>
            <Grid.Column> 
              <Input labelPosition='right' type='number' onChange={e => setInitialWeight(Number(e.target.value))} placeholder='Available Weight'>
                <input />
                <Label basic>lbs</Label>
              </Input>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row centered>
            <Label horizontal>Active?</Label>
            <Checkbox 
              slider 
              onClick={() => setActive(!active)}
            />
          </Grid.Row>

          <Grid.Row centered>
            <Button 
              fluid 
              positive 
              type='submit'
            >
              <Icon name='plus'/>Add Item
            </Button>
          </Grid.Row>

        </Grid>
      </Form>
    </Segment>
  )
}

export default NewProductCard