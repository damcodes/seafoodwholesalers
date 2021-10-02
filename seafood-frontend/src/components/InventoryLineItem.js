import { Table, Input, Checkbox, Icon, Button, Label, Modal, Header } from 'semantic-ui-react'
import { useState } from 'react'
import Adapter from '../adapters/Adapter'

const InventoryLineItem = ({ item, deleteItem }) => {

  const [ currentItem, setCurrentItem ] = useState(item)
  const [ availWeight, setAvailWeight ] = useState(item.avail_weight)
  const [ itemNumber, setItemNumber ] = useState(item.item_number)
  const [ checked, setCheck ] = useState(item.active)
  const [ description, setDescription ] = useState(item.description)
  const [ weightChange, setWeightChange] = useState(0)
  const [ price, setPrice ] = useState(0)
  const [ updatePriceState, setUpdatePriceState ] = useState(true)
  const [ updatedItemNumberState, setUpdateItemNumberState ] = useState(false)
  const [ updateDescriptState, setUpdateDescriptionState ] = useState(false)
  const [ open, setOpen ] = useState(false)

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

  const persistAvailWeight = async (weight) => {
    const body = {
      product: {
        avail_weight: weight
      }
    }
    let res = await Adapter.fetch("PATCH", `products/${currentItem.id}`, body)
    let updatedItem = await Adapter.handleResponse(res);
    setCurrentItem(updatedItem);
  }

  const handlePriceChange = () => {
    const body = {
      product: {
        price: price
      }
    }
    Adapter.fetch("PATCH", `products/${item.id}`, body)
    .then( res => res.json() )
    .then( updated => setCurrentItem(updated))
  }

  const toggleActive = (check) => {
    const body = {
      product: {
        active: check
      }
    }
    Adapter.fetch("PATCH", `products/${item.id}`, body)
    .then( res => res.json() )
    .then( updatedItem => setCurrentItem(updatedItem))
  }

  const handleEditItemNumber = () => {
    setUpdateItemNumberState(!updatedItemNumberState)
    const body = {
      product: {
        item_number: itemNumber
      }
    }
    Adapter.fetch("PATCH", `products/${currentItem.id}`, body)
    .then( res => res.json() )
    .then( data => setCurrentItem(data) )
  }

  const handleEditDescription = () => {
    setUpdateDescriptionState(!updateDescriptState);
    const body = {
      product: {
        description: description
      }
    }
    Adapter.fetch("PATCH", `products/${currentItem.id}`, body)
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

        <Modal
          centered
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          open={open}
          trigger={<Button id='delete-product-btn' size='mini'><Icon size='large' name='trash alternate outline' /></Button>}
        >
          <Modal.Content>
            <>
              <Header as='h3' textAlign='center'><span id='delete-product-msg'>DELETE ITEM?</span></Header>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Item Number</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>{currentItem.item_number}</Table.Cell>
                    <Table.Cell>{currentItem.description}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => setOpen(false)}
              negative
            >
              No
            </Button>

            <Button
              onClick={() => deleteItem(currentItem)}
              positive
            >
              Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </Table.Cell>

      <Table.Cell>
        {updatedItemNumberState ? <Input onChange={e => setItemNumber(e.target.value)} value={itemNumber} size="mini" type="text" /> : itemNumber}
        <br/>
        { checked && !updatedItemNumberState ? <Button id="edit-item-number" onClick={() => setUpdateItemNumberState(!updatedItemNumberState)} textAlign='center' size='mini'><Icon name='edit outline' /></Button> : null }
        { checked && updatedItemNumberState ? <Button onClick={handleEditItemNumber} textAlign='center' size='mini'><Icon name='check'/></Button> : null}
      </Table.Cell>

      <Table.Cell>
        {updateDescriptState ? <Input onChange={e => setDescription(e.target.value)} value={description} size="mini" type="text" /> : description}
        <br/>
        { checked && !updateDescriptState ? <Button id="edit-description" onClick={() => setUpdateDescriptionState(!updateDescriptState)} textAlign='center' size='mini'><Icon name='edit outline' /></Button> : null }
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
                      <Button id="edit-price" onClick={e => {
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
        <Button id='minus-weight' size='mini' onClick={e => {
                                  handleWeightChange(e, 'minus')
                              }}>
          <Icon name='minus'/>
        </Button>
        <Button id="plus-weight" size='mini' onClick={e => handleWeightChange(e, 'plus')}>
          <Icon name='plus'/>
        </Button>
      </Table.Cell> : <Table.Cell /> 
      }  
    </Table.Row>
  )

}

export default InventoryLineItem