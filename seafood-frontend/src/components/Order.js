import { Table, Container, Label } from 'semantic-ui-react';

const Order = ({ cart }) => {

  const countDecimals = (val) => {
    if( Math.floor(val) === val ) return 0
    return val.toString().split(".")[1].length || 0
  }

  const pricifyAndStringify = (num) => {
    const numString = num.toString()
    if (Number.isInteger(num)) return `$${num}.00`
    if (countDecimals(num) === 1) return `$${num}0`
    if (countDecimals(num) > 2) return `$${numString.slice(0, numString.indexOf('.') + 3)}`
    return `$${num}`
  }

  return(
    <Container>
      <Table striped compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>$/lb.</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Order Weight</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Cost</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cart.map( lineItem => {
            return(
              <Table.Row>
                <Table.Cell>{lineItem.description}</Table.Cell>
                <Table.Cell textAlign='right'>{pricifyAndStringify(lineItem.price)}</Table.Cell>
                <Table.Cell textAlign='right'>{lineItem.orderWeight}</Table.Cell>
                <Table.Cell textAlign='right'>{pricifyAndStringify(lineItem.cost)}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row textAlign='center' >
            <Table.HeaderCell
              colSpan='4'
              textAlign='right'
            >
              <Label as='a' tag size='big'>{`${pricifyAndStringify(cart.map( item => item.cost ).reduce( (num1, num2) => num1 + num2, 0))}`}</Label>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  )
}

export default Order