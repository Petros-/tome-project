import React from 'react'
import PropTypes from 'prop-types'

function Truncator({ children }) {
  return (
    <div
      className="truncate"
    >
      {children}
    </div>
  )
}

Truncator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Truncator
