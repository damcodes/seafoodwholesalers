import { useState, useEffect } from 'react' 
import { Redirect, useHistory } from 'react-router-dom'
import { Button, Checkbox, Icon, Table, Container, Input, Tab, Label, Segment, Grid } from 'semantic-ui-react'
import LineItem from '../components/LineItem'
import Order from '../components/Order'

const NewOrder = () => {
  
  let history = useHistory()

  const [ user, setUser ] = useState({})
  const [ items, setItems ] = useState([])
  const [ target, setTarget ] = useState(null)
  const [ cart, setCart ] = useState([])
  const [ totalCost, setTotalCost ] = useState(0)
  const [ confirming, setConfirming ] = useState(false)
  const [ currentOrder, setCurrentOrder ] = useState(null)
  const [ sort, setSort ] = useState(null)
  const [ searched, setSearched ] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/current-user', {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( user => setUser(user) )
  }, [])

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
    if (cart.length > 0) { 
      const total = cart.map( line => line.cost).reduce( (num1, num2) => num1 + num2)
      setTotalCost(total)
    } else {
      setTotalCost(0)
    }
  }, [cart])

  const countDecimals = (val) => {
    if( Math.floor(val) === val ) return 0
    return val.toString().split(".")[1].length || 0
  }

  const pricifyAndStringify = (num) => {
    const numString = num.toString()
    if (Number.isInteger(num)) return `$${num}.00`
    if (countDecimals(num) === 1) return `$${num}0`
    if (countDecimals(num) > 2) return `$${numString.slice(0, numString.indexOf('.') + 3)}`
    return `$${num}`
  }

  const isNum = (str) => {
    return /^\d+$/.test(str)
  }

  const newOrder = () => {
    fetch('http://localhost:3001/orders', {
      method: "POST",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }, 
      body: JSON.stringify({
        order: {
          user_id: user.id,
          order_total: totalCost,
          order_status: 'pending'
        }
      })
    })
    .then( res => res.json() )
    .then( newOrder => {
      setCurrentOrder(newOrder)
      cart.map( lineItem => newOrderProduct(lineItem, newOrder))
    })
  }

  const newOrderProduct = (item, order) => {
    fetch('http://localhost:3001/order_products', {
      method: "POST",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }, 
      body: JSON.stringify({
        order_product: {
          order_id: order.id, 
          product_id: item.id,
          weight: item.orderWeight
        }
      })
    })
    .then( res => res.json() )
    .then( data => {
      updateProduct(item)
      history.push(`/orders/${order.id}`)
    })
  }

  const updateProduct = (item) => {
    fetch(`http://localhost:3001/products/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization":localStorage.getItem("auth_key")
      }, 
      body: JSON.stringify({
        product: {
          avail_weight: item.avail_weight - item.orderWeight
        }
      })
    })
  }

  const submitOrder = () => {
    // setConfirming(!confirming)
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
      >Back</Button>
    </div>

    :

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
                <option>Price</option>
                <option>Name</option>
              </select>
            {/* </Segment> */}
          </Grid.Column>

          <Grid.Column textAlign='right'>
            {/* <Segment> */}
              <Input icon='search' placeholder='Search...' onChange={e => setSearched(e.target.value)}/>
            {/* </Segment> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
          { (sort && sort !== '') || (searched && searched !== '') ?
            items.filter(item => item.active && item.avail_weight > 0 && (item.description.toUpperCase().includes(searched) || item.description.toLowerCase().includes(searched)))
                 .sort( (a,b) => {
                              let op
                              if (sort === "Price") {
                                op = b.price - a.price
                              } else if (sort === "Name") {
                                op = a.description.localeCompare(b.description)
                              }
                              return op
                            })
                 .map(item => {
              return(
                <LineItem 
                  key={item.id} 
                  id={item.item_number}
                  item={item} 
                  prevTarget={target}
                  totalCost={totalCost}
                  setTotalCost={setTotalCost}
                  setCart={setCart}
                  cart={cart}
                  setTargetAndTotalCost={(newTarget, cost) => {
                    if (newTarget.value.length > 1) {
                      setTotalCost(0)
                    }
                    if (cost === 0) {
                      setTotalCost(0)
                    }
                    if (isNum(newTarget.value)) {
                      setTotalCost(cost)
                    }
                    if (newTarget !== target && isNum(newTarget.value)) {
                      setTotalCost(totalCost + cost) 
                    }
                    return setTarget(newTarget)
                  }}
                />
            )})
            : 
            items.filter(item => item.avail_weight > 0 && item.active)
                 .map(item => {
              return(
                <LineItem 
                  key={item.id} 
                  id={item.item_number}
                  item={item} 
                  prevTarget={target}
                  totalCost={totalCost}
                  setTotalCost={setTotalCost}
                  setCart={setCart}
                  cart={cart}
                  setTargetAndTotalCost={(newTarget, cost) => {
                    if (newTarget.value.length > 1) {
                      setTotalCost(0)
                    }
                    if (cost === 0) {
                      setTotalCost(0)
                    }
                    if (isNum(newTarget.value)) {
                      setTotalCost(cost)
                    }
                    if (newTarget !== target && isNum(newTarget.value)) {
                      setTotalCost(totalCost + cost) 
                    }
                    return setTarget(newTarget)
                  }}
                />
            )})            
          }
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
      
    </Container> 
  )
}

export default NewOrder