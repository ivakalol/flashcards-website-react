import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Breadcrumb.css';

function Breadcrumb({ path }) {
  // Render a breadcrumb item based on whether it's the current page
  const renderBreadcrumbItem = (item, index, isLast) => {
    return (
      <React.Fragment key={item.id}>
        <span className="breadcrumb-separator" aria-hidden="true">/</span>
        {isLast ? (
          <span className="breadcrumb-item current" aria-current="page">
            {item.title}
          </span>
        ) : (
          <Link 
            to={`/deck/${item.id}`} 
            className="breadcrumb-item"
          >
            {item.title}
          </Link>
        )}
      </React.Fragment>
    );
  };

  // Early return if no path is provided
  if (!path || path.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link to="/" className="breadcrumb-item">Home</Link>
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return renderBreadcrumbItem(item, index, isLast);
      })}
    </nav>
  );
}

// Define PropTypes for better documentation
Breadcrumb.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired
    })
  )
};

export default Breadcrumb;