import React from 'react'
import { useState,useContext } from 'react';
import { Box, TextField, Button, styled, Typography } from '@mui/material'
import { API } from '../../service/api.js';
import { DataContext } from '../../context/DataProvider.jsx';
import { useNavigate } from 'react-router-dom';



const Component = styled(Box)`
width: 400px;
margin: auto;
box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);

`
const Image = styled('img')({
    width: 100,
    margin: 'auto',
    display: 'flex',
    padding: '50px 0 0'

});

const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  flex-direction: column;
  & > div, & > button, & > p {
    margin-top: 20px;
  }
`;
const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB6418;
    color;#fff;
    height: 48px;
    border-radius: 2px;
    `

const SignupButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #28740f0;
    height: 48px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0/ 20%);
`;

const Error = styled(Typography)`
 font-size: 10px;
 color: #ff6161;
 line-height: 0;
 margin-top: 10px;
 font-weight: 600;
`;

const Text = styled(Typography)`
     color: #878787;
     font-size: 16px;
`;
const loginInitialValue = {
   username:'',
   password:'' 
}
const  signupInitialValue = {
  name: '',
  username: '',
  password: ''
}
// https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png

export default function Login( { isUserAuthenticated}) {
    const imageURL = '';
    const [account ,toggleAccount] = useState('login');
    const [signup,setsignup] = useState(signupInitialValue);
    const [error,setError] = useState('');
    const [login,setlogin] = useState(loginInitialValue)



    const {setAccount} = useContext(DataContext);
     const navigate = useNavigate();

    const toggleSignup = ()=>{
        toggleAccount('Signup');
    }
    const toggleLogin = ()=>{
        toggleAccount('login');
    }
    const onInputChange = (e)=>{
          //console.log(e.target.name,e.target.value);
          setsignup({...signup, [e.target.name] : e.target.value});
    }
    
    const validateSignup = () => {
        if (!signup.name || !signup.username || !signup.password) {
            alert('Please fill in all fields');
            return false;
        }
        return true;
    }

    const signupuser = async() =>{
        if (!validateSignup()) return;
        //console.log('Signup data:', signup);
        
            let response = await API.userSignup(signup);
            if(response.issuccess){
                setsignup(signupInitialValue);
                toggleAccount('login')
            }
           // console.log(response);
        else {
            setError("Something went wrong! please try again later");
            console.error('Error in signupUser:', error);
            alert('Error while signing up');
        } 
    //     console.log('Signup data:', signup);
    //    let response = await API.userSignup(signup)
    //    console.log('Response:', response);
    }
    const onValueChange = (e)=>{
        setlogin({ ...login,[e.target.name]: e.target.value})  
    }
    const loginUser = async()=>{
      let response = await API.userLogin(login);
      if(response.issuccess){  
          setError('');

      sessionStorage.setItem('accessToken',`Bearer ${response.data.accessToken}`);
      sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);    
     
      setAccount({username: response.data.username , name:  response.data.name});
      isUserAuthenticated(true);

      navigate('/');

      }else{
        setError('something went  wrong please try again later');
      }
    }

    return (
        <Component>
            
            <Box>
                <Image src={imageURL} alt='' />
                {
                  account === 'login' ?

             <Wrapper>
                <TextField variant="standard" value={login.username} onChange={(e)=> onValueChange(e)} name="username" label="Enter username" />
                <TextField variant="standard" value={login.password} onChange={(e)=> onValueChange(e)} name="password" label="Enter password" />
                <LoginButton variant="contained" onClick={()=> loginUser()}>Login</LoginButton>
                <Text style={{ textAlign: 'center' }}>OR</Text>
                <SignupButton onClick={()=> toggleSignup()}>Create an account</SignupButton>
            </Wrapper> 
            :
            <Wrapper>
                <TextField variant="standard" onChange={(e)=> onInputChange(e)} name='name' label="Enter Name" />
                <TextField variant="standard" onChange={(e)=> onInputChange(e)} name='username' label="Enter Username" />
                <TextField variant="standard" onChange={(e)=> onInputChange(e)} name ='password' label="Enter Password" />

                 { error && <Error>{error}</Error>}
                <SignupButton onClick={()=> signupuser()} >Signup</SignupButton>
                <Text style={{ textAlign: 'center' }}>OR</Text>
                <LoginButton variant="contained" onClick={() => toggleLogin()}>Already have an account</LoginButton>
            </Wrapper>
}
            </Box>
        </Component>
    )
}
