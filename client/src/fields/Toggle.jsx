import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types';

function Toggle({ isOn, toggle }) {
    // const [isOn, setIsOn] = useState(false)
    return (
        <div
            onClick={toggle}
            className={classNames(
                'flex w-12 h-6 bg-gray-300 m-6 rounded-md transition-all duration-150 flex-shrink-0',
                { 'bg-green-500': isOn }
            )}
        >
            <span
                className={classNames(
                    'h-6 w-6 bg-white rounded-md transition-all duration-150 shadow-sm',
                    { 'ml-6': isOn }
                )}
            ></span>
        </div>
    )
}

Toggle.propTypes = {
    isOn: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};

export default Toggle;
