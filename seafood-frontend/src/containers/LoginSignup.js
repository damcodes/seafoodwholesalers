import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { Redirect } from 'react-router-dom'
import Adapter from '../adapters/Adapter'

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
    const body = {
      user: {
        email: email, 
        password: password
      }
    }
    Adapter.fetch("POST", "login", body)
    .then( res => handleResponse(res) )
    .then( data => {
      setLoggedIn(true)
      const newUser = JSON.parse(data.user)
      localStorage.setItem('auth_key', data['jwt'])
      setUser(newUser)
    })
    .catch(err => {
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
    const body = {
      user: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        password_confirmation: passwordConf,
        company: company
      }
    }
    
    Adapter.fetch("POST", "users", body)
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
