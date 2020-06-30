import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
// or
//import { GoogleLogin } from 'react-google-login';
 
const gmail_registration = ()=>{


    const responseGoogle = (response) => {
    console.log(response);
    }
    
    ReactDOM.render(
    <GoogleLogin
        clientId="21224864813-mgujbp92ji9aqkot1ifuujan8d6qf7o4.apps.googleusercontent.com"
        
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
    />,
    document.getElementById('googleButton')
    );

    
    export default gmail_registration
}