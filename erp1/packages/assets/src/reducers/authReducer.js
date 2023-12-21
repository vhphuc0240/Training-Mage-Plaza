import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {reducer} from '@assets/actions/authAction';
import PropTypes from 'prop-types';

/** @type {React.Context<IAuthReducer>} */
const AuthReducer = createContext({});

export const useAuth = () => useContext(AuthReducer);

/**
 * @param children
 * @param user
 * @return {JSX.Element}
 * @constructor
 */
export const AuthProvider = ({children, user}) => {
  const [state, dispatch] = useReducer(
    reducer,
    user?.stsTokenManager || JSON.parse(atob(localStorage.getItem('token')))
  );
  const handleDispatch = (type, payload = undefined) => dispatch({type, payload});

  return (
    <AuthReducer.Provider value={{state, dispatch: handleDispatch}}>
      {children}
    </AuthReducer.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
  activeShop: PropTypes.any
};
