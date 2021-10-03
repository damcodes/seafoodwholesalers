import { useEffect, useState } from 'react';
import { Grid, Segment, Header, Icon, Label, Input, Button, Modal } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import CustomersList from '../components/CustomersList';
import NewCustomerCard from '../components/NewCustomerCard';
import Adapter from '../adapters/Adapter';

const Customers = () => {

    const [companies, setCompanies] = useState(null)
    const [sort, setSort] = useState(null)
    const [searched, setSearched] = useState(null)
    const [open, setOpen] = useState(false)
    let history = useHistory()

    useEffect(() => {
        const getCompanies = async () => {
            let companies = await Adapter.fetch("GET", `companies`);
            setCompanies(companies);
        };
        getCompanies();
    }, []);

    const addNewCustomer = async (name, number, address, city, state, zip, routeId) => {
        const fullAddress = `${address}, ${city}, ${state} ${zip}`
        const body = {
            name: name,
            phone_number: number.slice(2),
            address: fullAddress,
            route_id: routeId
        }
        let newCustomer = await Adapter.fetch("POST", `companies`, body);
        history.push(`/companies/${newCustomer.id}`);
    }

    return (companies ?
        <Grid>
            <Grid.Row columns='2'>
                <Grid.Column>
                    <Label>Sort By:</Label>
                    <select onChange={e => setSort(e.target.value)}>
                        <option></option>
                        <option value='name'>Name</option>
                    </select>
                </Grid.Column>

                <Grid.Column>
                    <Input onChange={e => setSearched(e.target.value)} icon='search' placeholder='Search...' />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <Header as='h1'>Customers</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns='2' centered>
                <Grid.Column textAlign='center'>
                    <Segment id='customers-list-card'>
                        <CustomersList sort={sort} searched={searched} companies={companies.filter(company => company.name !== 'Seafood Wholesalers')} />
                    </Segment>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={<Button positive><Icon name='plus' />Add Customer</Button>}
                        dimmer='blurring'
                    >
                        <Modal.Content>
                            <NewCustomerCard addNewCustomer={addNewCustomer} />
                        </Modal.Content>
                    </Modal>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        :
        <Header as='h2'><Icon name='spinner' />Loading Customers...</Header>
    )
}

export default Customers