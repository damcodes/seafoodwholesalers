import React, { useState, useEffect } from 'react'
import { Button, Form, Segment, Header } from 'semantic-ui-react'

function Login({ login }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return(
    <Segment >
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