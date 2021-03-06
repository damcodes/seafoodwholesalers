import { Header } from 'semantic-ui-react'
import { useEffect, useState } from 'react'

const Errors = ({ error }) => {

  const [ errors, setErrors ] = useState(null)
  const [ singleError, setSingleError ] = useState(null)

  useEffect(() => {
    if (error.login) {
      debugger
      setSingleError(error.login.message)
    } else if (error.signup) {
      debugger
      if (error.signup.length - 2 > 1) {
        const messages = error.signup.filter( x => x instanceof Array ).map( error => error[0])
        debugger
      }
    }
  }, [])

  return( singleError ? 
    <Header id='login-error-handling' as='h4'>{singleError}</Header>
    :
    errors ?
    errors.map( error => {
      return <Header id='login-error-handling' as='h4'>{error}</Header>
    })
    :
    null
  )
  
}

export default Errors