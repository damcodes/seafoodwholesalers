import { useState, useEffect } from 'react'
import { Grid, Container, Segment, Header, Card, Icon, Input } from 'semantic-ui-react'

const UserInfo = () => {

  const [user, setUser] = useState(null);
  const [editEmailState, setEditEmailState ] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/current-user`, {
      method: "GET",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
      }
    })
    .then( res => res.json() )
    .then( user => {
      setUser(user) 
    })
  }, [ ]);

  const editEmail = () => {
    setEditEmailState(false);
    fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")            
      },
      body: JSON.stringify({
        user: {
          email: email
        }
      })
    })
    .then( res => res.json() )
    .then( user => {
      setUser(user)
    })
  }

  return(
    user ? 
    <>
      <Grid.Row centered columns={1}>
        <Container centered>
          <Card raised centered fluid> 
            <Header as='h1'>
              <br/>
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
                    {editEmailState ? <Input type="text" onChange={e => setEmail(e.target.value)} /> : user.email}
                  </Grid.Column>

                  <Grid.Column textAlign='left'>
                    {editEmailState ? <Icon id='edit-email-check' onClick={() => editEmail()} name='check'/> : <Icon id="edit-email-icon" name='edit' onClick={() => setEditEmailState(true)} /> }
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