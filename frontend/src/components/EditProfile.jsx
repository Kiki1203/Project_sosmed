import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Materialize from 'materialize-css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [Bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState(undefined);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (url) {
      editFields();
    }
  }, [url]);

  const editPic = () => {
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
        setUrl(data.url);
        setDisable(false);
      })
      .catch((err) => {
        console.log(err);
        setDisable(false);
      });
  };

  const editFields = () => {
    setDisable(true);
    if (!username || !fullName || !Bio) {
      setDisable(false);
      return Materialize.toast({ html: 'Please add all the fields below', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
    }

    fetch('/updateProfile', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        username,
        Bio,
        fullName,
        pic: url,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        setDisable(false);
        console.log(data);
        localStorage.setItem('user', JSON.stringify({ ...state, pic: data.pic, username: data.username, fullName: data.fullName, Bio: data.Bio }));
        dispatch({ type: 'UPDATEPROFILE', payload: { pic: data.pic, username: data.username, fullName: data.fullName, Bio: data.Bio } });
        if (data.error) {
          setDisable(false);
          Materialize.toast({ html: data.error, classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
        } else {
          setDisable(false);
          Materialize.toast({ html: 'Update success', classes: 'teal lighten-2' }, 3000, 'rounded');
          navigate('/profile');
        }
      })
      .catch((err) => {
        setDisable(false);
        console.log(err);
      });
  };

  const editData = () => {
    if (image) {
      editPic();
    } else {
      editFields();
    }
  };

  return (
    <div className="card input-filed" style={{ margin: '10px auto', maxWidth: '500px', padding: '30px', textAlign: 'center' }}>
      <div>
        <div>username</div>
        <input type="text" placeholder={state ? state.username : 'Loading'} onChange={(e) => setUsername(e.target.value)} />
        <div>Fullname</div>
        <input type="text" placeholder={state ? state.fullName : 'Loading'} onChange={(e) => setFullName(e.target.value)} />
        <div>email</div>
        <input type="text" placeholder={state ? state.email : 'Loading'} disabled />
        <div>bio</div>
        <input type="text" placeholder={state ? state.Bio : 'Loading'} onChange={(e) => setBio(e.target.value)} />
        <div>photo profile</div>
        <div className="file-field input-field">
          <div className="btn" disabled={disable ? true : false}>
            <span>Upload-pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect waves-light buttonSubmit" type="submit" name="action" disabled={disable ? true : false} onClick={() => editData()}>
          EDit
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
