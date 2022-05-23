import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } });
        localStorage.setItem('user', JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } });
        localStorage.setItem('user', JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter((item) => item !== data._id);
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: '900px', margin: '0px auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 50px', borderBottom: '1px solid grey' }}>
            <div>
              <img style={{ width: '160px', height: '160px', borderRadius: '80px' }} src={userProfile.user.pic} alt="" />
            </div>
            <div>
              <div style={{ fontSize: '40px' }}>{userProfile.user.username}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                <div>{userProfile.posts.length} posts</div>
                <div>{userProfile.user.followers.length} followers</div>
                <div>{userProfile.user.following.length} following</div>
              </div>
              <div style={{ fontSize: '15px' }}>{userProfile.user.email}</div>
              <b style={{ fontSize: '15px' }}>{userProfile.user.fullName}</b>
              <div style={{ fontSize: '15px' }}>{userProfile.user.Bio}</div>

              {showfollow ? (
                <button
                  style={{
                    margin: '10px',
                  }}
                  className="btn waves-effect waves-light "
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: '10px',
                  }}
                  className="btn waves-effect waves-light "
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <div className="galler1">
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
      ) : (
        <h2>Loading...!</h2>
      )}
    </>
  );
};

export default Profile;
