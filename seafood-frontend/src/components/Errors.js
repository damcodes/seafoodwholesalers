import { Header } from 'semantic-ui-react'

const Errors = ({ loginError, signupError }) => {

  const signupErrors = () => {
    let messages = []
    for (var key in signupError) {
      if (key === 'password') {
        signupError[key].map( message => {
          if (message.indexOf('maximum') !== -1) {
            if (!messages.includes('Password is too long (40 characters maximum)')) return messages.push('Password is too long (40 characters maximum)') 
          } else if (message.indexOf('minimum') !== -1) {
            return messages.push('Password is too short (6 characters minimum)')
          }
        })
      } else if (key === 'password_confirmation') {
        messages.push("Password confirmation does not match password")
      } else if (key === 'email') {
        signupError[key].map( message => {
          if (message === 'has already been taken') {
            messages.push('Email has already been taken')
          } else {
            messages.push('Invalid email address')
          }
        })
      }
    }
    return messages.map( message => {
      return <Header id='signup-error-handling' as='h4'>{message}</Header>
    })
  }

  return( loginError && loginError.message === "Incorrect username or password" ? 
    <Header id='login-error-handling' as='h4'>{loginError.message}</Header>
    :
    signupErrors()
    )
  
}

export default Errors