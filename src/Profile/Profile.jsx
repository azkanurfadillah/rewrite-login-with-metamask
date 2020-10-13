// import './Profile.css';
import React, { useState, useEffect } from 'react';

import jwtDecode from 'jwt-decode';
import Blockies from 'react-blockies';

const REACT_APP_BACKEND_URL = "http://localhost:8000/api"

export default function Profile(props) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({})
    const [username, setUsername] = useState("")
    const {
        auth: { accessToken },
    } = props;
    const {
        payload: { publicAddress, id },
    } = jwtDecode(accessToken);

    useEffect(() => {


        fetch(`${REACT_APP_BACKEND_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => response.json())
            .then((user) => setUser(user))
            .catch(window.alert);
    }, [true])

    const handleChange = (e) => {
        setUsername(e.target.value)
    };

    const handleSubmit = () => {


        setLoading(true)

        if (!user) {
            window.alert(
                'The user id has not been fetched yet. Please try again in 5 seconds.'
            );
            return;
        }

        fetch(`${REACT_APP_BACKEND_URL}/users/${user.id}`, {
            body: JSON.stringify({ username }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        })
            .then((response) => response.json())
            .then((user) => {
                setLoading(false)
                setUser(user)
            })
            .catch((err) => {
                window.alert(err);
                setLoading(false)
            });
    };



    return (
        <div className="Profile">
            <p>
                Logged in as &nbsp; <Blockies seed={publicAddress} />
            </p>
            <div>
                My username is {user.username ? <pre>{user.username}</pre> : 'not set.'} My
                publicAddress is <pre>{publicAddress}</pre>
            </div>
            <div>
                <label htmlFor="username">Change username: </label>
                <input name="username" onChange={handleChange} />
                <button disabled={loading} onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            <p>
                <button onClick={props.onLoggedOut}>Logout</button>
            </p>
        </div>
    )
}



