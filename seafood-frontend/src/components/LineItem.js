import { Table, Input, Checkbox, Button, Icon } from 'semantic-ui-react'
import { useState, useEffect } from 'react'

const LineItem = ({ item, prevTarget, setTargetAndTotalCost, setCart, cart, setTotalCost }) => {

  const [ availWeight, setAvailWeight ] = useState(item.avail_weight)
  const [ orderedWeight, setOrderedWeight ] = useState(0)
  const [ cost, setCost ] = useState(0)
  const [ checked, setCheck ] = useState(false)
  const [ lineOrder, setLineOrder ] = useState({})


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

  useEffect(() => {
    setAvailWeight(item.avail_weight - orderedWeight)
    setCost(orderedWeight * item.price)
  }, [ item.price, orderedWeight, item.avail_weight ])

  useEffect(() => {
    checked ? setCart([...cart, lineOrder]) : setCart(() => cart.filter( current => current.description !== lineOrder.description))
  }, [ checked, lineOrder ])
  
  const isNum = (str) => {
    return /^\d+$/.test(str)
  }

  return(
    <Table.Row >
      <Table.Cell collapsing>
        
      </Table.Cell>
      <Table.Cell>{item.description}</Table.Cell>
      <Table.Cell id='new-order-price'>{pricifyAndStringify(item.price)}</Table.Cell>
      <Table.Cell id='new-order-weight'>{availWeight}</Table.Cell>
      <Table.Cell id='weight-ordered'>
        <Input
          onChange={ e => {
                      if (e.target.value === '') {
                        setOrderedWeight(0)
                      } 
                      if (e.target.value.length > 1 && e.target === prevTarget) {
                        setTargetAndTotalCost(e.target, 0)
                      }
                      if (prevTarget && (e.target.value !== prevTarget.value) && isNum(e.target.value)) {
                        setCost(cost + (Number(e.target.value) * item.price))
                      }
                      return setOrderedWeight(Number(e.target.value))
                    }}
          label={{ basic: true, content: 'lbs' }}
          labelPosition='right'
          disabled={checked}
          id={`${item.id}-weight`}
          type="number"
        />
      </Table.Cell>
      <Table.Cell className='line-item-total'>
        { pricifyAndStringify(cost) }
      </Table.Cell>
      <Table.Cell collapsing>
        <Button 
          toggle={true}
          positive={checked ? false : true}
          onClick={() => {
            setLineOrder({...item, orderWeight: orderedWeight, cost: cost})
            return setCheck(!checked)
          }} 
        >
          {checked ? <Icon name='pencil alternate' /> : <Icon name='check'/>}
        </Button>
      </Table.Cell>
    </Table.Row>
  )

}

export default LineItem