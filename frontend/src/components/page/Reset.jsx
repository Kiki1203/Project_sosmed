import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Materialize from 'materialize-css';
const Reset = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(false);

  const PostData = () => {
    setDisable(true);
    if (!email) {
      setDisable(false);
      return Materialize.toast({ html: 'Please add all the fields below', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    fetch('/reset-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDisable(false);
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
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button style={{ marginTop: '20px' }} className="btn waves-effect waves-light" type="submit" name="action" disabled={disable ? true : false} onClick={() => PostData()}>
          reset password
        </button>
      </div>
    </div>
  );
};

export default Reset;
