import { Segment, Form, Button } from 'semantic-ui-react'
import { useState, useEffect } from 'react'

function Signup({ signup }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [companies, setCompanies] = useState([])

  useEffect(async () => {
    const response = await fetch('http://localhost:3001/companies')
    const data = await response.json()
    setCompanies(data)
  }, [])

  return(
    <Segment>
      <h1>Sign Up</h1>
      <Form onSubmit={e => signup(e, firstName, lastName, email, password, company)}>
        <Form.Field>
          <input onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
        </Form.Field>
        <Form.Field>
          <input onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
        </Form.Field>
        <Form.Field>
          <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
        </Form.Field>
        <Form.Field>
          <input onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        </Form.Field>
        <Form.Field>
          <label>Company</label>
          <select onChange={e => setCompany(e.target.value)}>
            <option value="none">Select your company</option>
            {companies.slice(1).map(company => {
              return <option key={company.id} value={company.name}>{company.name}</option>
            })}
          </select>
        </Form.Field>
        <Button type='submit'>Create Account</Button>
      </Form>
    </Segment>
  )
}

export default Signup