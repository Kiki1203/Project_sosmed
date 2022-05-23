import React, { useState, useEffect, useContext } from 'react';
// import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
const PostDetail = () => {
  const [postDetail, setPostDetail] = useState([]);
  //   const { state, dispatch } = useContext(UserContext);
  const { postid } = useParams();

  useEffect(() => {
    fetch(`/postdetail/${postid}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPostDetail(result.post);
      });
  }, []);

  return (
    <div className="home">
      <div className="home-card-1">
        <div>
          <h2 className="header">Post Details</h2>
          <div className="card horizontal">
            <div className="card-image km2">
              <img className="km2" src={postDetail.Photo} alt={postDetail.title} />
            </div>
            <div className="card-stacked ">
              <div className="card-content ">
                <div>
                  <h3>{postDetail.postedBy?.username}</h3>
                  <p>Title:{postDetail.title}</p>
                  <p>Caption:{postDetail.body}</p>
                  <div style={{ display: 'flex' }}>
                    <i className="material-icons" style={{ color: 'red' }}>
                      favorite
                    </i>
                    <span>{postDetail.likes?.length}</span>
                  </div>
                  <hr />
                </div>
                {postDetail.comments?.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: '500' }}>{record.postedBy?.username}:</span> {record.text}
                    </h6>
                  );
                })}
                <input type="text" placeholder="add a comment" />
              </div>
              <div className="card-action">
                <a>{postDetail.updatedAt}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default PostDetail;
