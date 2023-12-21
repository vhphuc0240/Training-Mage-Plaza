import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {reducer} from '@assets/actions/authAction';
import PropTypes from 'prop-types';

/** @type {React.Context<IUserReducer>} */
const UserReducer = createContext({});

export const useUser = () => useContext(UserReducer);

/**
 * @param children
 * @param user
 * @return {JSX.Element}
 * @constructor
 */
export const UserProvider = ({children, user}) => {
  const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem('user')));
  const handleDispatch = (type, payload = undefined) => dispatch({type, payload});

  return (
    <UserReducer.Provider value={{state, dispatch: handleDispatch}}>
      {children}
    </UserReducer.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object
};
