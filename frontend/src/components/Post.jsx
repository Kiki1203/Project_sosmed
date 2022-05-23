import React, { useState, useEffect } from 'react';
import Materialize from 'materialize-css';
import { useNavigate } from 'react-router-dom';
const Post = () => {
  const [title, setTitles] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      fetch('/createpost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            Materialize.toast({ html: data.error, classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
          } else {
            Materialize.toast({ html: 'Created post success', classes: '#64ffda teal accent-2' }, 3000, 'rounded');
            navigate('/');
          }
        });
    }
  }, [url]);
  const postDetails = () => {
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
        setDisable(false);
        console.log(err);
      });
  };
  return (
    <div className="card input-filed" style={{ margin: '10px auto', maxWidth: '500px', padding: '30px', textAlign: 'center' }}>
      <div>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitles(e.target.value)} />
        <input type="text" placeholder="caption" value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="file-field input-field">
          <div className="btn" disabled={disable ? true : false}>
            <span>Upload</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect waves-light buttonSubmit" type="submit" name="action" disabled={disable ? true : false} onClick={() => postDetails()}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Post;
