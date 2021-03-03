import { useState, useEffect, useRef } from 'react' 
import { Button, Icon, Table, Container, Input, Header, Label, Grid } from 'semantic-ui-react'
import InventoryLineItem from '../components/InventoryLineItem'

const Inventory = () => {

  const [ items, setItems ] = useState([])
  const [ sort, setSort ] = useState('')
  const [ sortedUp, setSortedUp ] = useState(false)
  const [ searched, setSearched ] = useState('')
  const [ processedItems, setProcessedItems ] = useState([])
  const [ refresh, setRefresh ] = useState(500)
  const prevSearched = usePrevious(searched)

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
    if (refresh && refresh > 0 && (sort !== '' || searched !== '')) {
      const interval = setInterval(fetchProducts, refresh)
      return () => clearInterval(interval)
    }
  })

  useEffect(() => {
    let processed
    if (sort !== '' && searched !== '') {
      processed = items.filter( item => {
        // item.description.startsWith(searched || searched.toUpperCase() ? :  )
        // debugger
        // const descriptionWords = item.description.split(' ')
        if (item.description.slice(0, searched.length) === searched.slice(0,1).toUpperCase() + searched.slice(1)) {
          // debugger
          return true
        } else if (searched === prevSearched + searched.slice(prevSearched.length)) {
          // debugger
          if (item.description.includes(searched)) return true
        } //else if () {
        //   debugger
        //   return true 
        // }
        return false
        }).sort( (a, b) => {
          let op 
          if (sort === 'Weight') {
            if (!sortedUp) {
              op = b.avail_weight - a.avail_weight
            } else {
              op = a.avail_weight - b.avail_weight
            }
          } else if (sort === 'Price') {
            if (!sortedUp) {
              op = b.price - a.price
            } else {
              op = a.price - b.price
            }
          } else if (sort === 'Name') {
            op = a.description.localeCompare(b.description)
          }
          return op 
        })
    } else if (sort === '' && searched !== '') {
      // debugger
      processed = items.filter( item => {
        // item.description.startsWith(searched || searched.toUpperCase() ? :  )
        // debugger
        // const descriptionWords = item.description.split(' ')
        if (item.description.slice(0, searched.length) === searched.slice(0,1).toUpperCase() + searched.slice(1)) {
          // debugger
          return true
        } else if (searched === prevSearched + searched.slice(prevSearched.length)) {
          // debugger
          if (item.description.includes(searched)) return true
        } //else if () {
        //   debugger
        //   return true 
        // }
        return false
      })
    } else if (sort !== '' && searched === '') {
      processed = items.sort( (a, b) => {
        let op 
        if (sort === 'Weight') {
          if (!sortedUp) {
            op = b.avail_weight - a.avail_weight
          } else {
            op = a.avail_weight - b.avail_weight
          }
        } else if (sort === 'Price') {
          if (!sortedUp) {
            op = b.price - a.price
          } else {
            op = a.price - b.price
          }
        } else if (sort === 'Name') {
          op = a.description.localeCompare(b.description)
        }
        return op 
      })
    } 
    // debugger
    return processed ? setProcessedItems(processed) : setProcessedItems([])
  }, [ sort, searched, items, prevSearched, sortedUp ])

  function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

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

  const fetchProducts = () => {
    fetch('http://localhost:3001/products', {
      method: "GET",
      headers: {
        "Content-type":"applicaton/json"
        // "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( products => setItems(products) )
  }

  return( 
    <Container>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column textAlign='left'>
            <Label>
              Sort By: 
            </Label>
            <select onChange={(e) => setSort(e.target.value)}>
              <option></option>
              <option>Weight</option>
              <option>Price</option>
              <option>Name</option>
            </select>
          { sort === 'Weight' || sort === 'Price' ?
            <div>
              <Button positive={sortedUp} onClick={() => setSortedUp(!sortedUp)} ><Icon name='sort amount up' /></Button>

              <Button positive={!sortedUp} onClick={() => setSortedUp(!sortedUp)} ><Icon name='sort amount down' /></Button>
            </div>
            : 
            null  
          }
          </Grid.Column>

          <Grid.Column textAlign='right'>
            <Input icon='search' placeholder='Search...' onChange={e => setSearched(e.target.value)}/>
          </Grid.Column>
        </Grid.Row>
      </Grid> 

      { items.length > 0 || processedItems.length > 0 ? 

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
            searched !== '' ?
              <Table.Row>
                <Table.Cell colSpan='6'>
                  <Header textAlign='center' as='h3'>No Item Found</Header>
                </Table.Cell>
              </Table.Row>
            :
              items.sort((a,b) => b.active - a.active).map( item => {
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
      :
      <Header textAlign='center' colSpan='6' as='h2'><Icon name='spinner' />Loading Inventory...</Header>
      }    
    </Container>
  )
}

export default Inventory