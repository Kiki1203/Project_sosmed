import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import Materialize from 'materialize-css';
const Newpassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [disable, setDisable] = useState(false);
  const [repeatpassword, setRepeatpassword] = useState('');
  const PostData = () => {
    setDisable(true);
    if (!password || !repeatpassword) {
      setDisable(false);
      return Materialize.toast({ html: 'Please add all the fields below', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
      setDisable(false);
      return Materialize.toast({ html: 'Password must be a minimum of 8 characters including number, Upper, Lower And one special character', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    if (!(password === repeatpassword)) {
      setDisable(false);
      return Materialize.toast({ html: 'Passwords dont match', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    fetch('/new-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
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
          Materialize.toast({ html: data.message, classes: '#64ffda teal accent-2' }, 3000, 'rounded');
          navigate('/login');
        }
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <div className="brand-auth">Sosialme</div>
        <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Reapet Password" value={repeatpassword} onChange={(e) => setRepeatpassword(e.target.value)} />
        <button style={{ marginTop: '20px' }} className="btn waves-effect waves-light" type="submit" name="action" disabled={disable ? true : false} onClick={() => PostData()}>
          Update password
        </button>
      </div>
    </div>
  );
};

export default Newpassword;
