import { useState, useEffect } from 'react' 
import { Button, Checkbox, Icon, Table, Container, Input, Tab, Label, Grid } from 'semantic-ui-react'
import InventoryLineItem from '../components/InventoryLineItem'

const Inventory = () => {

  const [ items, setItems ] = useState([])
  const [ sort, setSort ] = useState('')
  const [ searched, setSearched ] = useState('')
  const [ processedItems, setProcessed ] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/products', {
      method: "GET",
      headers: {
        "Content-type":"applicaton/json"
        // "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( products => setItems(products) )
  }, [])

  useEffect(() => {
    if (sort !== '' && searched !== '') {
      items.filter( item => item.description.includes(searched) )
      .sort( (a, b) => {
        let op 
        if (sort === 'Weight') {
          op = b.avail_weight - a.avail_weight
        } else if (sort === 'Price') {
          op = b.price - a.price
        } else if (sort === 'Name') {
          op = a.description.localeCompare(b.description)
        }
        return op 
      })
    } else if (sort === '' && searched !== '') {
      items.filter( item => item.description.includes(searched) )
    } else if (sort !== '' && searched === '') {
      items.sort( (a, b) => {
        let op 
        if (sort === 'Weight') {
          op = b.avail_weight - a.avail_weight
        } else if (sort === 'Price') {
          op = b.price - a.price
        } else if (sort === 'Name') {
          op = a.description.localeCompare(b.description)
        }
        return op 
      })
    } else {
      items.sort( (a,b) => b.active - a.active)
    }
    setProcessed(items)
  }, [ sort, searched, items ])

  const newItem = () => {
    fetch(`http://localhost:3001/products`, {
      method: "POST",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      },
      body: JSON.stringify({
        product: {
          active: false,
          description: "New Item",
          item_number: "New Item",
          avail_weight: 0, 
          price: 0.0
        }
      })
    })
    .then( res => res.json() )
    .then( item => setItems([...items, item]))
  }

  const deleteItem = (item) => {
    fetch(`http://localhost:3001/products/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }
    })
    .then( res => res.json() )
    .then( item => {
      const newItems = items.filter( current => current.id !== item.id )
      setItems(newItems)
    })
  }

  return( 
    <Container>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column textAlign='left'>
            {/* <Segment > */}
              <Label>
                Sort By: 
              </Label>
              <select onChange={(e) => setSort(e.target.value)}>
                <option></option>
                <option>Weight</option>
                <option>Price</option>
                <option>Name</option>
              </select>
            {/* </Segment> */}
            { sort === 'Weight' || sort === 'Price' ?
              <div>
                <Button positive><Icon name='sort amount up' /></Button>
                <Button positive><Icon name='sort amount down' /></Button>
              </div>
              : 
              null  
            }
          </Grid.Column>

          <Grid.Column textAlign='right'>
            {/* <Segment> */}
              <Input icon='search' placeholder='Search...' onChange={e => setSearched(e.target.value)}/>
            {/* </Segment> */}
          </Grid.Column>
        </Grid.Row>
      </Grid> 
      <Table striped celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Active?</Table.HeaderCell>
            <Table.HeaderCell>Item Number</Table.HeaderCell>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell id='inventory-price-header'>$/lb.</Table.HeaderCell>
            <Table.HeaderCell id='new-order-weight-header'>Available Weight</Table.HeaderCell>
            <Table.HeaderCell id='changed-weight-header'>Weight Change</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* { searched !== '' && sort !== '' ? 
            items.filter( item => item.description.includes(searched) )
            .sort( (a, b) => {
              let op 
              if (sort === 'Weight') {
                op = b.avail_weight - a.avail_weight
              } else if (sort === 'Price') {
                op = b.price - a.price
              } else if (sort === 'Name') {
                op = a.description.localeCompare(b.description)
              }
              return op 
            })
            .map(item => {
              return(
                <InventoryLineItem 
                  key={item.id} 
                  item={item}
                  deleteItem={deleteItem}
                />
              )
            })
            :
            searched !== '' && sort === '' ? 
            items.filter( item => item.description.includes(searched) )
            .map( item => {
              return(
                <InventoryLineItem 
                  key={item.id} 
                  item={item}
                  deleteItem={deleteItem}
                />
              )
            })
            : 
            items.sort( (a,b) => {
              let op 
              if (sort === 'Weight') {
                op = b.avail_weight - a.avail_weight
              } else if (sort === 'Price') {
                op = b.price - a.price 
              } else if (sort === 'Name') {
                op = a.description.localeCompare(b.description)
              }
              return op
            })
            .map( item => {
              return(
                <InventoryLineItem 
                  key={item.id} 
                  item={item}
                  deleteItem={deleteItem}
                />
              )
            })
          } */}
          { processedItems.length > 0 ? 
            processedItems.map( item => {
              return(
                <InventoryLineItem
                 key={item.id}
                 item={item}
                 deleteItem={deleteItem}
                />
              )
            })
          :
            items.map( item => {
              return( 
                <InventoryLineItem
                  key={item.id}
                  item={item}
                  deleteItem={deleteItem}
                />
              )
            }) 
          }
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row >
          </Table.Row>

          <Table.Row>
            <Table.HeaderCell 
              colSpan='6'
              id='submit-order-footer'
            >
              <Button 
                floated='left'
                id='submit-order-btn'
                size='small'
                positive={true}
                onClick={newItem}
              >
                <Icon name='plus' />Add Item
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  )
}

export default Inventory