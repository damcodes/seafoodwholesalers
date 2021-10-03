import React, { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import Errors from './Errors'

function Login({ login, loginError }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return(
    <Segment >
        { loginError ? <Errors loginError={loginError} /> : null }
        <h1>Login</h1>
        <Form onSubmit={e => login(e, email, password)} >
          <Form.Field>
            <input onChange={e => setEmail(e.target.value)} placeholder='Email' />
          </Form.Field>
          <Form.Field>
            <input onChange={e => setPassword(e.target.value)} type='password' placeholder='Password' />
          </Form.Field>
          <Button type='submit'>Login</Button>
        </Form>
      </Segment>
  )
}

export default Login