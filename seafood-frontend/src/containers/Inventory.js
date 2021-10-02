import { useState, useEffect, useRef } from 'react'
import { Button, Icon, Table, Container, Input, Header, Label, Grid, Segment, Modal } from 'semantic-ui-react'
import NewProductCard from '../components/NewProductCard'
import InventoryList from '../components/InventoryList';
import Adapter from '../adapters/Adapter'

const Inventory = () => {

    const [items, setItems] = useState([])
    const [sort, setSort] = useState('')
    const [sortedUp, setSortedUp] = useState(false)
    const [searched, setSearched] = useState('')
    const [open, setOpen] = useState(false)
    const prevSearched = usePrevious(searched)

    useEffect(() => {
        const getProducts = async () => {
            let products = await Adapter.fetch("GET", "products");
            setItems(products);
        }
        getProducts();
    }, [])

    function usePrevious(value) { // holds previous search term
        const ref = useRef()
        useEffect(() => {
            ref.current = value
        })
        return ref.current
    }

    const addNewItem = (e, description, itemNumber, price, initialWeight, active) => {
        e.preventDefault()
        const body = {
            product: {
                active: active,
                description: description,
                item_number: itemNumber,
                avail_weight: initialWeight,
                price: price
            }
        }
        Adapter.fetch("POST", "products", body)
            .then(res => res.json())
            .then(item => setItems([...items, item]))
    }

    const deleteItem = (item) => {
        Adapter.fetch("DELETE", `products/${item.id}`)
            .then(res => res.json())
            .then(item => {
                const newItems = items.filter(current => current.id !== item.id)
                setItems(newItems)
            })
    }

    return (
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
                        {sort === 'Weight' || sort === 'Price' ?
                            <div>
                                <Button positive={sortedUp} onClick={() => setSortedUp(!sortedUp)} ><Icon name='sort amount up' /></Button>

                                <Button positive={!sortedUp} onClick={() => setSortedUp(!sortedUp)} ><Icon name='sort amount down' /></Button>
                            </div>
                            :
                            null
                        }
                    </Grid.Column>

                    <Grid.Column textAlign='right'>
                        <Input icon='search' placeholder='Search...' onChange={e => setSearched(e.target.value)} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {items.length > 0 ?
                <>
                    <Segment id='inventory'>
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
                                <InventoryList
                                    items={items}
                                    searched={searched}
                                    sort={sort}
                                    sortedUp={sortedUp}
                                    prevSearched={prevSearched}
                                    deleteItem={deleteItem}
                                />
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row >
                                </Table.Row>

                                <Table.Row>
                                    <Table.HeaderCell
                                        colSpan='6'
                                        id='submit-order-footer'
                                    >
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Segment>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={<Button positive><Icon name='plus' />Add Item</Button>}
                        dimmer='blurring'
                    >
                        <Modal.Content>
                            <NewProductCard setOpen={setOpen} addNewItem={addNewItem} />
                        </Modal.Content>
                    </Modal>
                </>
                :
                <Header textAlign='center' colSpan='6' as='h2'><Icon name='spinner' />Loading Inventory...</Header>
            }
        </Container>
    )
}

export default Inventory