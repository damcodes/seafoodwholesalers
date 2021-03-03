import { Table, Input, Checkbox, Icon, Button, Label, Divider, Container } from 'semantic-ui-react'
import { useState, useEffect } from 'react'

const InventoryLineItem = ({ item, deleteItem }) => {

  const [ currentItem, setCurrentItem ] = useState(item)
  const [ availWeight, setAvailWeight ] = useState(item.avail_weight)
  const [ weightChange, setWeightChange] = useState(0)
  const [ price, setPrice ] = useState(0)
  const [ itemNumber, setItemNumber ] = useState(item.item_number)
  const [ checked, setCheck ] = useState(item.active)
  const [ updatePriceState, setUpdatePriceState ] = useState(true)
  const [ updatedItemNumberState, setUpdateItemNumberState ] = useState(false)
  const [ updateDescriptState, setUpdateDescriptionState ] = useState(false)
  const [ description, setDescription ] = useState(item.description)

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

  const handleWeightChange = (e, operation) => {
    if (operation === 'minus') {
      const newWeight = availWeight - weightChange
      setAvailWeight(newWeight)
      persistAvailWeight(newWeight)
    } else if (operation === 'plus') {
      const newWeight = availWeight + weightChange
      setAvailWeight(newWeight)
      persistAvailWeight(newWeight)
    }
  }

  const persistAvailWeight = (weight) => {
    fetch(`http://localhost:3001/products/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      },
      body: JSON.stringify({
        product: {
          avail_weight: weight 
        }
      })
    })
  }

  const handlePriceChange = e => {
    fetch(`http://localhost:3001/products/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      },
      body: JSON.stringify({
        product: {
          price: price 
        }
      })
    })
    .then( res => res.json() )
    .then( updated => {
      setCurrentItem(updated)
    })
  }

  const toggleActive = (check) => {
    fetch(`http://localhost:3001/products/${currentItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }, 
      body: JSON.stringify({
        product: {
          active: check
        }
      })
    })
    .then( res => res.json() )
    .then( updatedItem => setCurrentItem(updatedItem))
  }

  const handleEditItemNumber = () => {
    setUpdateItemNumberState(!updatedItemNumberState)
    fetch(`http://localhost:3001/products/${currentItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }, 
      body: JSON.stringify({
        product: {
          item_number: itemNumber
        }
      })
    })
    .then( res => res.json() )
    .then( data => setCurrentItem(data) )
  }

  const handleEditDescription = () => {
    setUpdateDescriptionState(!updateDescriptState)
    fetch(`http://localhost:3001/products/${currentItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem('auth_key')
      }, 
      body: JSON.stringify({
        product: {
          description: description
        }
      })
    })
    .then( res => res.json() )
    .then( data => setCurrentItem(data) )
  }

  return(
    <Table.Row verticalAlign='middle'>
      <Table.Cell collapsing>
        <Checkbox 
          toggle={true}
          checked={checked} 
          onClick={() => {
            setCheck(!checked)
            toggleActive(!checked)
          }} 
        />
        <br/>
        <Button id='delete-product-btn' size='mini' onClick={e => deleteItem(currentItem)}><Icon size='large' name='trash alternate outline' /></Button>
      </Table.Cell>

      <Table.Cell>
        {updatedItemNumberState ? <Input onChange={e => setItemNumber(e.target.value)} placeholder={itemNumber} size="mini" type="text" /> : itemNumber}
        <br/>
        { checked && !updatedItemNumberState ? <Button onClick={handleEditItemNumber} textAlign='center' size='mini'><Icon name='edit outline' /></Button> : null }
        { checked && updatedItemNumberState ? <Button onClick={handleEditItemNumber} textAlign='center' size='mini'><Icon name='check'/></Button> : null}
      </Table.Cell>

      <Table.Cell>
        {updateDescriptState ? <Input onChange={e => setDescription(e.target.value)} placeholder={description} size="mini" type="text" /> : description}
        <br/>
        { checked && !updateDescriptState ? <Button onClick={handleEditDescription} textAlign='center' size='mini'><Icon name='edit outline' /></Button> : null }
        { checked && updateDescriptState ? <Button onClick={handleEditDescription} textAlign='center' size='mini'><Icon name='check'/></Button> : null}
      </Table.Cell>

      {
        checked ? <Table.Cell textAlign='right'>
                    <Input 
                      type="number"
                      label={{basic: true, content: "$"}}
                      labelPosition='left'
                      size='mini'
                      onChange={e => {
                        const str = e.target.value
                        if (isNum(str) || str.indexOf('.') > -1) {
                          const num = Number(str)
                          setPrice(num)
                        } else if (str === '') {
                          setPrice(0)
                        }
                      }}

                    >
                    </Input>
                    <br />
                    <div>
                      <Label>
                        Current
                        <Label.Detail >{pricifyAndStringify(currentItem.price)}</Label.Detail>
                        <br/>
                        New
                        <Label.Detail >{pricifyAndStringify(price)}</Label.Detail>
                      </Label>
                      <br/>
                      <br/>
                      <Button onClick={e => {
                                  setUpdatePriceState(!updatePriceState)
                                  handlePriceChange(e)
                                  
                                }} 
                                size='mini'>Update Price
                      </Button>
                    </div>
                  </Table.Cell> 
                    : 
                  <Table.Cell id='inventory-price'>{pricifyAndStringify(currentItem.price)}</Table.Cell>
      }

      <Table.Cell id='new-order-weight'>{availWeight}</Table.Cell>

      {
        checked ? <Table.Cell id='changed-weight'>
        <Input
          onChange={e => {
            const value = e.target.value
            if (isNum(value)) {
              const change = Number(value)
              setWeightChange(change)
            }
          }}
          type='number'
          label={{ basic: true, content: 'lbs' }}
          labelPosition='right'
          id={`${item.id}-weight`}
          size='mini'
        />
        <br/>
        <Button size='mini' onClick={e => {
                                  handleWeightChange(e, 'minus')
                              }}>
          <Icon name='minus'/>
        </Button>
        <Button size='mini' onClick={e => handleWeightChange(e, 'plus')}>
          <Icon name='plus'/>
        </Button>
      </Table.Cell> : <Table.Cell /> 
      }  
    </Table.Row>
  )

}

export default InventoryLineItem