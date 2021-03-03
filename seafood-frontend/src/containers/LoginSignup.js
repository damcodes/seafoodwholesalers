import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { Redirect } from 'react-router-dom'

function LoginSignup({ setUser, logIn, isLoggedIn }) {

  const [loginState, setLoginState] = useState(true)
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
  }

  const login = (e, email, password) => {
    e.preventDefault()
    if (isBlank(email) || isBlank(password)) {
      alert('Email and Password required')
      return
    }
    logIn(loggedIn)
    setLoggedIn(true)
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
    .then( res => res.json() )
    .then( data => {
      const newUser = JSON.parse(data.user)
      localStorage.setItem('auth_key', data['jwt'])
      // logIn(loggedIn)
      // setLoggedIn(true)
      setUser(newUser)
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

  const buttonText = loginState ? "Don't have an account? Sign Up." : "Already have an account? Login."

  return(
    <div>
      { loggedIn ? <Redirect to='/profile' /> : null }
      { loginState ? <Login login={login} /> : <Signup signup={signup} /> }
      <Button onClick={() => setLoginState(!loginState)}>{buttonText}</Button>
    </div>
  )
}

export default LoginSignup
