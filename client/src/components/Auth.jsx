/* eslint-disable no-unused-vars */
import react,{useState} from 'react';
import {useCookies} from 'react-cookie';
import "./auth.css";
const Auth = ()=> {
  const [cookies , setCookie , removeCookie] = useCookies("");
  const [email , setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword]= useState("");
  const[username,setUsername] = useState("");

  // console.log(cookies);

  const [isLogin , setLogin] = useState(false)
  const [error,setError] = useState("");

  const viewLogin = (status)=>{
    setLogin(status);
    setError(null);
  }

  const handleSubmit = async (e,endpoint)=> {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword){
      setError('Make sure password & confirmPassword Matches');
      return;
    }
    const json = {email: email ,password : password ,username : username};
    console.log(json);
    const response = await fetch(`http://localhost:8000/${endpoint}`,{
      method : 'POST',
      headers : {'Content-type' : 'application/json'},
      body : JSON.stringify(json)
    })
    console.log(`${process.env.REACT_APP_PORT_URL}`);

    const data = await response.json();
    if (data.detail){
      setError(data.detail);
    }else{
        console.log("Hello");
        setCookie('Email',data.email);
        setCookie('AuthToken',data.authToken);
        setCookie('User',data.id );
        setCookie('Username',data.username);

    }
    console.log(data);

  }
  return (
    <div className="auth-container" >
      <div className="auth-container-box"  >
        <form  style = {{ height : isLogin ? '280px' : '420px'}}>
          <h2>{isLogin ? "Please Log in": "Please Sign up"}</h2>

          {!isLogin && <input type="username" name="username" id="" 
          placeholder="Username" 
          onChange={(e)=> { 
            return setUsername(e.target.value)}}
          />}

          <input type="email" name="email" id="" 
          placeholder="email" 
          onChange={(e)=> {
            console.log(e.target.value);
            return setEmail(e.target.value)}}
          />
          <input type="password" name="password" id=""  
          placeholder="password" 
          onChange={(e)=> {
            console.log(e.target.value);
            return setPassword(e.target.value)}}
          />
          {!isLogin && <input type="password" name="confirmpassword" id="" 
          placeholder="confirm password" 
          onChange={(e)=> { 
            console.log(e.target.value);
            return setConfirmPassword(e.target.value)}}
          />}
          
          <input type="submit" className='create' onClick={(e)=> handleSubmit(e,isLogin ? 'login' : 'signup')}/>
          { error && <p>{error}</p>}
        </form>
        <div className='auth-options'>
          <button className='signup' onClick={()=>viewLogin(false)
          } style = {{ backgroundColor:!isLogin? 'rgb(255,255,255':'rgb(188,188,188'}}
          >SignUp</button>
          <button className='login' onClick={()=>viewLogin(true)}
            style = {{ backgroundColor:isLogin? 'rgb(255,255,255':'rgb(188,188,188'}}
            >LogIn</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;