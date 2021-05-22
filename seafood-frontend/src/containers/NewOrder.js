import { useState, useEffect, useRef } from 'react' 
import { useHistory } from 'react-router-dom'
import { Button, Icon, Table, Container, Input, Label, Header, Grid } from 'semantic-ui-react'
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
  const [ sort, setSort ] = useState('')
  const [ sortedUp, setSortedUp ] = useState(false)
  const [ searched, setSearched ] = useState('')
  const [ processedItems, setProcessedItems ] = useState([])
  const [ refresh ] = useState(500)
  const prevSearched = usePrevious(searched)

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

  useEffect(() => {
    if (refresh && refresh > 0) {
      const interval = setInterval(fetchProducts, refresh)
      return () => clearInterval(interval)
    }
  })


  useEffect(() => {
    let processed
    if (sort !== '' && searched !== '') {
      processed = items.filter( item => {
        if (item.description.slice(0, searched.length) === searched.slice(0,1).toUpperCase() + searched.slice(1)) {                                           
          return true
        } else if (searched === prevSearched + searched.slice(prevSearched.length)) {
          if (item.description.includes(searched)) return true
        } 
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
      processed = items.filter( item => {
        if (item.description.slice(0, searched.length) === searched.slice(0,1).toUpperCase() + searched.slice(1)) {
          return true
        } else if (searched === prevSearched + searched.slice(prevSearched.length)) {
          if (item.description.includes(searched)) return true
        } 
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
    return processed ? setProcessedItems(processed) : setProcessedItems([])
  }, [ sort, searched, items, prevSearched, sortedUp ])

  function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }


  const fetchProducts = () => {
    fetch('http://localhost:3001/products', {
      method: "GET",
      headers: {
        "Content-type":"applicaton/json"
      }
    })
    .then( res => res.json() )
    .then( products => setItems(products) )
  }

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

      { items.length > 0 || processedItems.length > 0 ?
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
          { processedItems.length > 0 ?            
            processedItems.filter( item => item.avail_weight > 0 && item.active).map(item => {
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
              searched !== '' ?
                <Table.Row>
                  <Table.Cell colSpan='6'>
                    <Header textAlign='center' as='h3'>No Item Found</Header>
                  </Table.Cell>
                </Table.Row>
              :
                items.filter( item => item.avail_weight > 0 && item.active).sort((a,b) => b.active - a.active).map( item => {
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
                  )
                })           
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
      :
      <Header textAlign='center' colSpan='6' as='h2'><Icon name='spinner' />Loading Today's Catch...</Header>
      }
    </Container> 
  )
}

export default NewOrder