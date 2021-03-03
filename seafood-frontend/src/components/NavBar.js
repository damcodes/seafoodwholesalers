import React, { useState } from 'react'
import { input, Menu } from 'semantic-ui-react'
import { NavLink, withRouter } from 'react-router-dom'

const NavBar = ({ user, setUser }) => {
  const [ activeItem, setActiveItem ] = useState(null)
  const [ loggedIn, setLoggedIn ] = useState(false)

  const handleItemClick = (e, { name }) => {
    setActiveItem(name)
  }

  const isLoggedIn = () => {
    const authToken = localStorage.getItem('auth_key')
    return authToken === null ? false : true
  }

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }
  
  return (
    <Menu pointing widths={10}>
      <Menu.Item
        as={NavLink} to='/home'
        name='home'
        active={activeItem === 'home'}
        onClick={handleItemClick}
      />

      <Menu.Item
        as={NavLink} to='/about'
        name='about'
        active={activeItem === 'about'}
        onClick={handleItemClick}
      />

      {user && !isEmpty(user) ? <Menu.Item 
          name='profile'
          as={NavLink} to='/profile'
          active={activeItem === 'profile'}
          onClick={handleItemClick}/> : null }

      {user && !isEmpty(user) ? <Menu.Item
        name='new order'
        as={NavLink} to='/new-order'
        active={activeItem === 'new order'}
        onClick={handleItemClick}/> : null }

      { user && !isEmpty(user) && user.admin ?
        <Menu.Item
              name={user ? 'inventory' : null}
              as={NavLink} to={ user ? '/inventory' : '/login' }
              active={activeItem === 'login'}
              onClick={handleItemClick}
            /> : null
      }

      { user && !isEmpty(user) && (user.role === 'transportation' || user.admin) ? 
        <Menu.Item
          name={user ? 'routes' : null }
          as={NavLink} to='/routes'
          active={activeItem === 'routes'}
          onClick={handleItemClick} 
          /> : null 
      }

      <Menu.Item
        name={user && !isEmpty(user) ? 'logout' : 'login'}
        as={NavLink} to={ user && !isEmpty(user) ? '/logout' : '/login' }
        active={activeItem === 'login'}
        onClick={handleItemClick}
      />
    </Menu>
  )
}

export default NavBar