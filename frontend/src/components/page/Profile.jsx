import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
const Profile = () => {
  const [mypics, setMyPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('/mypost', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPics(result.mypost);
      });
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 50px', borderBottom: '1px solid grey' }}>
        <div>
          <Link to="/editp" tabIndex="1">
            <img style={{ width: '160px', height: '160px', borderRadius: '80px' }} src={state ? state.pic : 'Loading'} alt="" />
          </Link>
        </div>
        <div>
          <div style={{ fontSize: '40px' }}>{state ? state.username : 'Loading'}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
            <div>{mypics.length} posts</div>
            <div>{state ? state.followers.length : '0'} followers</div>
            <div>{state ? state.following.length : '0'} followings</div>
          </div>
          <div style={{ fontSize: '15px' }}>{state ? state.email : 'Loading'}</div>
          <b style={{ fontSize: '15px' }}>{state ? state.fullName : 'Loading'}</b>
          <div style={{ fontSize: '15px' }}>{state ? state.Bio : 'Loading'}</div>

          <Link to="/editp" tabIndex="2">
            <button className="btn waves-effect waves-light  " type="submit" name="action">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => {
          return (
            <div key={item._id} tabIndex="3" className="galler1" onClick={() => navigate(`/postdetail/${item._id}`)}>
              <div className="gallery-item" tabindex="0">
                <img key={item._id} className="item" src={item.Photo} alt={item.title} />
                <div className="gallery-item-info">
                  <ul>
                    <li className="gallery-item-likes">
                      <i className="material-icons visually-hidden">favorite</i>
                      <i className="fas fa-heart" aria-hidden="true"></i> {item.likes.length}
                    </li>
                    <li className="gallery-item-comments">
                      <i className="material-icons visually-hidden">textsms</i>
                      <i className="fas fa-comment" aria-hidden="true"></i> {item.comments.length}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
