import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Breadcrumb.css';

function Breadcrumb({ path }) {
  if (!path || path.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb">
      <Link to="/" className="breadcrumb-item">Home</Link>
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <span className="breadcrumb-separator">/</span>
          {index === path.length - 1 ? (
            <span className="breadcrumb-item current">{item.title}</span>
          ) : (
            <Link to={`/deck/${item.id}`} className="breadcrumb-item">{item.title}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;