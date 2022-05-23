import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Materialize from 'materialize-css';
import M from 'materialize-css';

const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <Link to="">
            <i data-target="modal1" className="large material-icons modal-trigger" style={{ color: 'black' }}>
              search
            </i>
          </Link>
        </li>,
        <li key="2">
          <Link to="/profile">
            <i className="material-icons iconprofile">account_box</i>
          </Link>
        </li>,
        <li key="3">
          <Link to="/post">
            <i className="material-icons iconprofile">add_to_photos</i>
          </Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">Post my following</Link>
        </li>,
        <li key="5">
          <button
            className="btn waves-effect waves-light #f44336 red"
            type="submit"
            name="action"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              Materialize.toast({ html: 'log out success', classes: '#ff8a80 red accent-1' }, 3000, 'rounded');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/login">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? '/' : '/login'} className="brand-logo">
            Socialme
          </Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
      <div id="modal1" className="modal" ref={searchModal} style={{ color: 'black' }}>
        <div className="modal-content">
          <input type="text" placeholder="search users" value={search} onChange={(e) => fetchUsers(e.target.value)} />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  key={item._id}
                  to={item._id !== state._id ? '/profile/' + item._id : '/profile'}
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch('');
                  }}
                >
                  <li key={item._id} className="collection-item">
                    {item.email}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
