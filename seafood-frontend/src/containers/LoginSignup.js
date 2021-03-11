import React, { useState, useEffect } from 'react'
import { Button, Header } from 'semantic-ui-react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { Redirect, useHistory } from 'react-router-dom'

function LoginSignup({ setUser, logIn, isLoggedIn }) {

  const [ loginState, setLoginState ] = useState(true)
  const [ loggedIn, setLoggedIn ] = useState(isLoggedIn)
  const [ loginError, setLoginError ] = useState(null)
  const [ signupError, setSignupError ] = useState(null)

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
    })
    .catch(err => {
      // debugger
      setLoginError(err)
      console.log(err.message)
    })
  }
  
  const signup = (e, firstName, lastName, email, password, passwordConf, company) => {
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
          password_confirmation: passwordConf,
          company: company
        }
      })
    })
    .then( res => handleResponse(res) )
    .then( data => {
      debugger
      setLoggedIn(true)
      const newUser = JSON.parse(data.user)
      localStorage.setItem('auth_key', data['jwt'])
      // logIn(loggedIn)
      setUser(newUser)
    }) 
    .catch( err => {
      console.log(err)
      setSignupError(err)
    })
  }

  const buttonText = loginState ? "Don't have an account? Sign Up!" : "Already have an account? Login!"

  return(
    <div>
      { loggedIn ? <Redirect to='/profile' /> : null }
      { loginState ? <Login loginError={loginError ? loginError : null} login={login} /> : <Signup signupError={signupError ? signupError : null} signup={signup} /> }
      <Button onClick={() => {
          if (loginState && loginError) {
            setLoginError(null)
          }
          if (!loginState && signupError) {
            setSignupError(null)
          }
          setLoginState(!loginState)
          
        }}>{buttonText}</Button>
    </div>
  )
}

export default LoginSignup
