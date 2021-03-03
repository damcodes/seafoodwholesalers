import { Segment, Menu, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'

const Logout = ({ setUser }) => {

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
          <Button onClick={logout}>
            <Link className="logout-options" to="/home">
                Yes
            </Link>
          </Button>

          <Button.Or />
          
          <Button positive >
            <Link className="logout-options" to="/profile">
              No
            </Link>
          </Button>
        </Button.Group>
      </div>
    </Segment>
  )
}

export default Logout