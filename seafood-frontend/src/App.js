import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginSignup from './containers/LoginSignup'
import Home from './containers/Home'
import Profile from './containers/Profile'
import NavBar from './components/NavBar'
import Logout from './containers/Logout'
import NewOrder from './containers/NewOrder'
import Inventory from './containers/Inventory'
import OrderByName from './containers/OrderByName'
import Routes from './containers/Routes'
import Footer from './components/Footer'
import Customers from './containers/Customers'
import CustomerPageByName from './containers/CustomerPageByName'
import Adapter from './adapters/Adapter';

function App() {

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('auth_key') ? true : false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getCurrentUser = async () => {
            let currentUser = await Adapter.fetch("GET", "current-user");
            setUser(currentUser);
        }
        if (localStorage.getItem('auth_key')) {
            getCurrentUser();
        }
    }, [loggedIn])

    useEffect(() => {
        if (user && window.location.pathname === '/login') {
            window.location.replace('/profile')
        }
    }, [user])

    useEffect(() => {
        if (window.location.pathname === "/") {
            window.location.replace('/home');
        }
    })

    return (
        <div className="App">
            <img src="https://www.seafoodwholesalers.com/image/131551250.png" alt="seafood logo" />
            <Router>
                <NavBar id="navbar" user={user} />
                <Switch>
                    <Route exact path='/inventory' component={user ? Inventory : null} />
                    <Route exact path='/login' component={() => <LoginSignup isloggedIn={loggedIn} setUser={user => setUser(user)} logIn={bool => setLoggedIn(bool)} />} />
                    <Route exact path='/logout' component={() => <Logout setUser={user => setUser(user)} />} />
                    <Route exact path='/home' component={Home} />
                    <Route exact path='/profile' component={() => <Profile currentUser={user} />} />
                    <Route exact path='/new-order' component={() => <NewOrder user={user} />} />
                    <Route exact path='/orders/:order_number' component={() => <OrderByName />} />
                    <Route exact path='/routes' component={Routes} />
                    <Route exact path='/companies/:customerName' component={CustomerPageByName} />
                    <Route exact path='/companies' component={Customers} />
                </Switch>
            </Router>
            <br />
            <br />
            <Footer />
        </div>
    );
}

export default App;
