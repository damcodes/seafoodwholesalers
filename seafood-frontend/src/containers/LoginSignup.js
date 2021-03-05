import React, { useState, useEffect } from 'react'
import { Button, Header } from 'semantic-ui-react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { Redirect, useHistory } from 'react-router-dom'

function LoginSignup({ setUser, logIn, isLoggedIn, error, setError }) {

  const [ loginState, setLoginState ] = useState(true)
  const [ loggedIn, setLoggedIn ] = useState(isLoggedIn)
  // const [ error, setError ] = useState(null)
  const history = useHistory()

  const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
  }

  const handleResponse = res => {
    return res.json()
    .then(json => {
      if (!res.ok) {
        const err = Object.assign({}, json, {
          status: res.status,
          statusText: res.statusText
        })
        return Promise.reject(err)
      }
      return json 
    })
  }


  const login = (e, email, password) => {
    e.preventDefault()
    if (isBlank(email) || isBlank(password)) {
      alert('Email and Password required')
      return
    }
    logIn(loggedIn)
    // setLoggedIn(true)
    fetch('http://localhost:3001/login', {
      method: "POST",
      headers: { "Content-type":"application/json" },
      body: JSON.stringify({
        user: {
          email: email,
          password: password
        }
      })
    })
    .then( res => handleResponse(res) )
    .then( data => {
      setLoggedIn(true)
      const newUser = JSON.parse(data.user)
      localStorage.setItem('auth_key', data['jwt'])
      // logIn(loggedIn)
      // setLoggedIn(true)
      setUser(newUser)
      setError(null)
    })
    .catch(err => {
      setError(err.message)
      console.log(err.message)
    })
  }
  
  const signup = (e, firstName, lastName, email, password, company) => {
    e.preventDefault()
    if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(password) || company === 'none') {
      alert('All fields are required')
      return
    }
    
    fetch('http://localhost:3001/users', {
      method: "POST",
      headers: { "Content-type":"application/json" },
      body: JSON.stringify({
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          company: company
        }
      })
    })
    .then( res => res.json() )
    .then( data => {
      localStorage.setItem('auth_key', data['jwt'])
      logIn(loggedIn)
      setLoggedIn(true)
      setUser(JSON.parse(data.user))
    }) 
  }

  const buttonText = loginState ? "Don't have an account? Sign Up!" : "Already have an account? Login!"

  return(
    <div>
      { error && error.length > 0 && loginState ? <Header id='login-error-handling' as='h4'>{error}</Header> : null }
      { loggedIn ? <Redirect to='/profile' /> : null }
      { loginState ? <Login login={login} /> : <Signup signup={signup} /> }
      <Button onClick={() => {
          setLoginState(!loginState) 
          // setError(null)
        }}>{buttonText}</Button>
    </div>
  )
}

export default LoginSignup
