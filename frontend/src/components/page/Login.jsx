import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';

import { Link, useNavigate } from 'react-router-dom';
import Materialize from 'materialize-css';
const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(false);

  const PostData = () => {
    setDisable(true);
    if (!password || !email) {
      setDisable(false);
      return Materialize.toast({ html: 'Please add all the fields below', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    fetch('/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDisable(false);
        console.log(data);
        if (data.error) {
          setDisable(false);
          Materialize.toast({ html: data.error, classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
        } else {
          setDisable(false);
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'USER', payload: data.user });
          Materialize.toast({ html: 'Sign in success', classes: '#64ffda teal accent-2' }, 3000, 'rounded');
          navigate('/');
        }
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <div className="brand-auth">Sosialme</div>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light" type="submit" name="action" disabled={disable ? true : false} onClick={() => PostData()}>
          Sign in
        </button>
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '20px' }}>Don't have an account?</div>
          <div>
            <Link to="/reset" style={{ fontSize: '15px' }}>
              Forgot Password
            </Link>
          </div>
          <div>
            <Link to="/signup" style={{ fontSize: '15px' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
