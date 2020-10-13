import React, { useState } from 'react'
import Web3 from 'web3';
import axios from "axios"

let web3 = Web3 | undefined // Will hold the web3 instance
const REACT_APP_BACKEND_URL = "http://localhost:8000/api"
const ethereum = window.ethereum
const LS_KEY = 'login-with-metamask:auth';


export default function Login(props) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        const { onLoggedIn, setAuth } = props;
        console.log("CLICK #1",)

        // Check if MetaMask is installed
        if (!ethereum) {
            console.log("CLICK", ethereum)
            window.alert('Please install MetaMask first.');
            return;
        }


        if (!web3) {
            console.log("CLICK Request account", web3)

            try {
                // Request account access if needed
                // await ethereum.enable();
                await ethereum.request({ method: 'eth_requestAccounts' });


                // We don't know window.web3 version, so we use our own instance of Web3
                // with the injected provider given by MetaMask
                web3 = new Web3(ethereum);
            } catch (error) {
                window.alert('You need to allow MetaMask.');
                return;
            }
        }
        console.log("CLICK1", web3)

        const coinbase = await web3.eth.getCoinbase(); //Check the current active account on MetaMask
        console.log("CLICK", "coinbase", coinbase)
        if (!coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }

        const publicAddress = coinbase.toLowerCase();
        setLoading(true)

        axios({
            method: 'GET',
            url: `${REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`,

        })
            .then((response) => response.data)
            // If yes, retrieve it. If no, create it.
            .then((users) => {
                console.log("after GET publicaddress", users)
                if (users.length) {
                    return users[0]
                } else {
                    return handleSignup(publicAddress)
                }
            })


            // Popup MetaMask confirmation modal to sign message
            .then(handleSignMessage)
            // Send signature to backend on the /auth route
            .then(handleAuthenticate)
            .then(setAuth)
            // Pass accessToken back to parent component (to save it in localStorage)
            // .then(onLoggedIn)
            .catch((err) => {
                console.error(err)
                window.alert(err);
                setLoading(false)
            });

    };


    const handleSignMessage = async ({ publicAddress, nonce }) => {
        console.log("sign message", publicAddress, nonce)
        try {
            const signature = await web3.eth.personal.sign(
                `I am signing my one-time nonce: ${nonce}`,
                publicAddress,
                '', // MetaMask will ignore the password argument here

            );
            console.log("sign message", signature)
            // window.close()

            return { publicAddress, signature };
        } catch (err) {
            throw new Error('You need to sign the message to be able to log in.');
        }
    };

    const handleAuthenticate = async (data) => {
        const { publicAddress, signature } = data
        const { setAuth } = props
        console.log("handle authenticate", data)

        try {

            const res = await axios({
                method: 'POST',
                url: `${REACT_APP_BACKEND_URL}/auth`,
                data: JSON.stringify({ publicAddress, signature }),
                headers: {
                    "Content-type": "application/json"
                }



            })
            // console.log(res.data)
            // await setAuth(res.data)
            await localStorage.setItem(LS_KEY, JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            throw new Error('Authentcate failed');
        }

    }

    const handleSignup = (publicAddress) => {
        console.log("signup")
        return fetch(`${REACT_APP_BACKEND_URL}/users`, {
            body: JSON.stringify({ publicAddress }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((response) => response.json());
    };



    return (
        <div>
            <button onClick={handleClick}>Login with MetaMask</button>
        </div>
    )
}
