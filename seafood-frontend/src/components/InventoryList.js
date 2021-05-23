import { Header, Table } from 'semantic-ui-react';
import InventoryLineItem from './InventoryLineItem';

const InventoryList = ({ sort, searched, items, sortedUp, prevSearched, deleteItem }) => {

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
    } else {
      op = b.active - a.active;
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

  if (sort && !searched) {
    items = items.sort(sortAlgo);
  } else if (!sort && searched) {
    items = items.filter(searchAlgo);
  } else if (sort && searched) {
    items = items.sort(sortAlgo).filter(searchAlgo);
  } else {
    items = items.sort(sortAlgo);
  }

  return(
    <>
      {items.map( item => {
        return(
          <InventoryLineItem
            key={item.id}
            item={item}
            deleteItem={deleteItem}
          />
        )
      })}

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

export default InventoryList