import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Table, Container, Input, Label, Header, Grid } from 'semantic-ui-react';
import TodaysCatch from '../components/TodaysCatch';
import Order from '../components/Order';
import Adapter from '../adapters/Adapter';

const NewOrder = () => {
  
  let history = useHistory()

  const [ user, setUser ] = useState({})
  const [ items, setItems ] = useState([])
  const [ target, setTarget ] = useState(null)
  const [ cart, setCart ] = useState([])
  const [ totalCost, setTotalCost ] = useState(0)
  const [ confirming, setConfirming ] = useState(false)
  const [ currentOrder, setCurrentOrder ] = useState(null)
  const [ sort, setSort ] = useState('')
  const [ sortedUp, setSortedUp ] = useState(false)
  const [ searched, setSearched ] = useState('')
  const prevSearched = usePrevious(searched)

  useEffect(() => {
    Adapter.fetch("GET", "current-user")
    .then( res => res.json() )
    .then( user => setUser(user) )
  }, [])

  useEffect(() => {
    Adapter.fetch("GET", "products")
    .then( res => res.json() )
    .then( products => setItems(products) )
  }, [])

  useEffect(() => {
    if (cart.length > 0) { 
      const total = cart.map( line => line.cost).reduce( (num1, num2) => num1 + num2)
      setTotalCost(total)
    } else {
      setTotalCost(0)
    }
  }, [cart])

  function usePrevious(value) { // holds value of previous search input
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const countDecimals = (val) => {
    if( Math.floor(val) === val ) return 0
    return val.toString().split(".")[1].length || 0
  }

  const pricifyAndStringify = (num) => {
    if (Number.isInteger(num)) return `$${num}.00`
    if (countDecimals(num) === 1) return `$${num}0`
    return `$${num}`
  }

  const newOrder = () => {
    const body = {
      order: {
        user_id: user.id,
        order_total: totalCost,
        order_status: 'pending'
      }
    }
    Adapter.fetch("POST", "orders", body)
    .then( res => res.json() )
    .then( newOrder => {
      setCurrentOrder(newOrder)
      cart.map( lineItem => newOrderProduct(lineItem, newOrder))
    })
  }

  const newOrderProduct = (item, order) => {
    const body = {
      order_product: {
        order_id: order.id, 
        product_id: item.id,
        weight: item.orderWeight
      }
    }

    Adapter.fetch("POST", "order_products", body)
    .then( res => res.json() )
    .then( data => {
      updateProduct(item)
      history.push(`/orders/${order.order_number}`)
    })
  }

  const updateProduct = (item) => {
    const body = {
      product: {
        avail_weight: item.avail_weight - item.orderWeight
      }
    }
    Adapter.fetch("PATCH", `products/${item.id}`, body)
  }

  const submitOrder = () => {
    newOrder()
  }

  return( 
    confirming ? 

    <div>
      <Order cart={cart} />
      <br/>
      <Button positive onClick={submitOrder}>Confirm and Submit</Button>
      <Button onClick={() => {
                if (confirming) {
                  window.location.replace('/new-order')
                }
                setConfirming(!confirming)
                }
              }
      >
        Back
      </Button>
    </div>

    :

    <Container>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column textAlign='left'>
            <Label>
              Sort By: 
            </Label>
            <select onChange={(e) => setSort(e.target.value)}>
              <option></option>
              <option>Price</option>
            </select>
            { sort === 'Price' ?
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

      { items.length > 0 ?
      <Table striped compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell id='new-order-price-header'>$/lb.</Table.HeaderCell>
            <Table.HeaderCell id='new-order-weight-header'>Available Weight</Table.HeaderCell>
            <Table.HeaderCell id='weight-ordered-header'>Order Weight</Table.HeaderCell>
            <Table.HeaderCell id='line-total-header'>Cost</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <TodaysCatch 
            items={items.filter(item => item.avail_weight > 0 && item.active)}
            sort={sort}
            searched={searched}
            sortedUp={sortedUp}
            target={target}
            prevSearched={prevSearched}
            setTarget={setTarget}
            totalCost={totalCost}
            setTotalCost={setTotalCost}
            cart={cart}
            setCart={setCart}
          />
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row >
            <Table.HeaderCell 
              colSpan='7'
              id='total-price-footer'
            >
              <Label as='a' tag>
                {`Order Total: ${pricifyAndStringify(totalCost)}`}
              </Label>
            </Table.HeaderCell>
          </Table.Row>

          <Table.Row>
            <Table.HeaderCell 
              colSpan='7'
              id='submit-order-footer'
            >
              <Button 
                id='submit-order-btn'
                size='small'
                positive={true}
                onClick={() => setConfirming(!confirming)}
              >
                <Icon name='paper plane' />Submit
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
      :
      <Header textAlign='center' colSpan='6' as='h2'><Icon name='spinner' />Loading Today's Catch...</Header>
      }
    </Container> 
  )
}

export default NewOrder