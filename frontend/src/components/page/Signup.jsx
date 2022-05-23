import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Materialize from 'materialize-css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState(undefined);
  const [repeatpassword, setRepeatpassword] = useState('');
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    setDisable(true);
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'sosmed');
    data.append('cloud_name', 'dpifptkbz');
    fetch('https://api.cloudinary.com/v1_1/dpifptkbz/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setDisable(false);
        setUrl(data.url);
      })
      .catch((err) => {
        setDisable(false);
        console.log(err);
      });
  };

  const uploadFields = () => {
    setDisable(true);
    if (!username || !password || !email || !repeatpassword) {
      setDisable(false);
      return Materialize.toast({ html: 'Please add all the fields below', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      setDisable(false);
      return Materialize.toast({ html: 'Invalid Email', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
      setDisable(false);
      return Materialize.toast({ html: 'Password must be a minimum of 8 characters including number, Upper, Lower And one special character', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    if (!(password === repeatpassword)) {
      setDisable(false);
      return Materialize.toast({ html: 'Passwords dont match', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }
    fetch('/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setDisable(false);
          Materialize.toast({ html: data.error, classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
        } else {
          setDisable(false);
          Materialize.toast({ html: data.massage, classes: '#64ffda teal accent-2' }, 3000, 'rounded');
          navigate('/login');
        }
      })
      .catch((err) => {
        setDisable(false);
        console.log(err);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <div className="brand-auth">Sosialme</div>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Reapet Password" value={repeatpassword} onChange={(e) => setRepeatpassword(e.target.value)} />
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light " disabled={disable ? true : false}>
            <span>Upload pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect waves-light" type="submit" name="action" disabled={disable ? true : false} onClick={() => PostData()}>
          Sign up
        </button>
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '20px' }}>Already have an account?</div>
          <Link to="/login" style={{ textDecoration: 'none', fontSize: '15px' }}>
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
