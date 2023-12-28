import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {authType, reducer} from '@assets/actions/authAction';
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
export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem('user')));
  const updateUser = newData => {
    dispatch({type: authType.SET_USER, payload: newData});
  };
  useEffect(() => {
    if (state) {
      localStorage.setItem('user', JSON.stringify(state));
    }
  }, [state]);
  return <AuthReducer.Provider value={{state, updateUser}}>{children}</AuthReducer.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node
};
