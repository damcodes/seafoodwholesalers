import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { Redirect } from 'react-router-dom';
import Adapter from '../adapters/Adapter';

function LoginSignup({ setUser, logIn, isLoggedIn }) {

    const [loginState, setLoginState] = useState(true);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn);
    const [loginError, setLoginError] = useState(null);
    const [signupError, setSignupError] = useState(null);

    const isBlank = (str) => {
        return (!str || /^\s*$/.test(str));
    }

    const login = async (e, email, password) => {
        e.preventDefault();
        if (isBlank(email) || isBlank(password)) {
            alert('Email and Password required');
            return;
        };
        logIn(loggedIn);
        setLoggedIn(true);
        const body = {
            user: {
                email: email,
                password: password
            }
        };
        try {
            let data = await Adapter.fetch("POST", "login", body);
            setLoggedIn(true);
            const newUser = JSON.parse(data.user);
            localStorage.setItem('auth_key', data['jwt']);
            setUser(newUser);
        } catch (err) {
            setLoginError(err);
        };
    };

    const signup = async (e, firstName, lastName, email, password, passwordConf, company) => {
        e.preventDefault();
        if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(password) || company === 'none') {
            alert('All fields are required');
            return;
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
        };
        try {
            let data = await Adapter.fetch("POST", "users", body);
            setLoggedIn(true);
            const newUser = JSON.parse(data.user);
            localStorage.setItem('auth_key', data['jwt']);
            // logIn(loggedIn)
            setUser(newUser);
        } catch (err) {
            setSignupError(err);
        };
    };

    const buttonText = loginState ? "Don't have an account? Sign Up!" : "Already have an account? Login!";

    return (
        <div>
            {loggedIn ? <Redirect to='/profile' /> : null}
            {loginState ? <Login loginError={loginError ? loginError : null} login={login} /> : <Signup signupError={signupError ? signupError : null} signup={signup} />}
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

export default LoginSignup;
