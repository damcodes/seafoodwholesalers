import { Table, Header } from 'semantic-ui-react';
import LineItem from './LineItem';

const TodaysCatch = ({ sort, searched, sortedUp, prevSearched, items, target, setTarget, totalCost, setTotalCost, cart, setCart }) => {

  const sortAlgo = (a, b) => {
    let op 
    if (sort === 'Weight') {
      if (!sortedUp) {
        op = b.avail_weight - a.avail_weight;
      } else {
        op = a.avail_weight - b.avail_weight;
      }
    } else if (sort === 'Price') {
      if (!sortedUp) {
        op = b.price - a.price;
      } else {
        op = a.price - b.price;
      }
    } else if (sort === 'Name') {
      op = a.description.localeCompare(b.description);
    }
    return op;
  }

  const searchAlgo = item => {
    if (item.description.slice(0, searched.length) === searched.slice(0,1).toUpperCase() + searched.slice(1) || item.item_number.slice(0, searched.length) === searched) {
      return true;
    } else if (searched === prevSearched + searched.slice(prevSearched.length)) {
      if (item.description.toUpperCase().includes(searched.toUpperCase()) || item.item_number.includes(searched)) {
        return true;
      }
    } else if (prevSearched.slice(0, searched.length) === searched) {
      if (item.description.toUpperCase().includes(searched.toUpperCase()) || item.item_number.includes(searched)) {
        return true;
      }
    }
    return false;
  }

  const isNum = (str) => {
    return /^\d+$/.test(str)
  }

  if (sort && !searched) {
    items = items.sort(sortAlgo)
  } else if (!sort && searched) {
    items = items.filter(searchAlgo)
  } else if (sort && searched) {
    items = items.sort(sortAlgo).filter(searchAlgo)
  }

  return(
    <>
      {
        items.map( item => {
          return(
            <LineItem
              key={item.id} 
              id={item.item_number}
              item={item} 
              prevTarget={target}
              totalCost={totalCost}
              setTotalCost={setTotalCost}
              setCart={setCart}
              cart={cart}
              setTargetAndTotalCost={(newTarget, cost) => {
                if (newTarget.value.length > 1) {
                  setTotalCost(0)
                }
                if (cost === 0) {
                  setTotalCost(0)
                }
                if (isNum(newTarget.value)) {
                  setTotalCost(cost)
                }
                if (newTarget !== target && isNum(newTarget.value)) {
                  setTotalCost(totalCost + cost) 
                }
                return setTarget(newTarget)
              }}
            />
          )
        })
      }

      {searched !== '' && items.length === 0 ? 
        <Table.Row>
          <Table.Cell colSpan='6'>
            <Header textAlign='center' as='h3'>No Item Found</Header>
          </Table.Cell>
        </Table.Row>
        :
        null
      }
    </>
  )
}

export default TodaysCatch