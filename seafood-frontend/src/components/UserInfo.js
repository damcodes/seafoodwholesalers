import { useState, useEffect } from 'react'
import { Grid, Container, Segment, Header, Card, Icon, Input } from 'semantic-ui-react'
import Adapter from '../adapters/Adapter';

const UserInfo = () => {

    const [user, setUser] = useState(null);
    const [editEmailState, setEditEmailState] = useState(false);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            let user = await Adapter.fetch("GET", `current-user`);
            setUser(user);
            setEmail(user.email);
        }
        getUser();
    }, []);

    const editEmail = async () => {
        setEditEmailState(false);
        let body = {
            email: email
        };
        let userRefetched = await Adapter.fetch("PATCH", `users/${user.id}`, body);
        setUser(userRefetched);
        setEmail(userRefetched.email);
    }

    return (
        user ?
            <>
                <Grid.Row centered columns={1}>
                    <Container centered>
                        <Card raised centered fluid>
                            <Header as='h1'>
                                <br />
                                {`${user.first_name}  ${user.last_name}`}
                            </Header>

                            <Segment>
                                <Grid>
                                    <Grid.Row centered columns={3}>
                                        <Grid.Column textAlign='right'>
                                            <Icon name='building' />
                                        </Grid.Column>

                                        <Grid.Column textAlign='center'>
                                            {user.company && user.company.name ? user.company.name : null}
                                        </Grid.Column>

                                        <Grid.Column textAlign='left'>
                                            {/* <Icon name='edit' /> */}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>

                            <Segment>
                                <Grid>
                                    <Grid.Row centered columns={3}>
                                        <Grid.Column textAlign='right'>
                                            <Icon name='envelope open outline' />
                                        </Grid.Column>

                                        <Grid.Column textAlign='center'>
                                            {editEmailState ? <Input type="text" onChange={e => setEmail(e.target.value)} value={email} /> : user.email}
                                        </Grid.Column>

                                        <Grid.Column textAlign='left'>
                                            {editEmailState ? <Icon id='edit-email-check' onClick={() => editEmail()} name='check' /> : <Icon id="edit-email-icon" name='edit' onClick={() => setEditEmailState(true)} />}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Card>
                    </Container>
                </Grid.Row>
            </>
            :
            <Header as='h2'><Icon name='spinner' />Loading Info...</Header>
    )

}

export default UserInfo