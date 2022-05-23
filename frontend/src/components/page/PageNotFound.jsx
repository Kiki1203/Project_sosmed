import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound(props) {
  return (
    <div>
      <div className="Error404">404</div>
      <div className="MassageError">Sorry, Page Not Found</div>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="BackHome">⬅️Back to Home </div>
      </Link>
    </div>
  );
}

export default PageNotFound;
