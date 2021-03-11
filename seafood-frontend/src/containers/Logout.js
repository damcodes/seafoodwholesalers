import { Segment, Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

const Logout = ({ setUser }) => {
  let history = useHistory()
  const logout = () => {
    localStorage.removeItem('auth_key')
    setUser(null)
  }

  return(
    <Segment>
      <p id='logging-out-message'>
        You're being logged out...<br/>Continue?
      </p>
      <div>
        <Button.Group>
          <Button onClick={() => {
            logout()
            history.push('/home')
          }}>
            Yes
          </Button>

          <Button.Or />
          
          <Button positive onClick={() => history.push('/profile')}>
            No
          </Button>
        </Button.Group>
      </div>
    </Segment>
  )
}

export default Logout