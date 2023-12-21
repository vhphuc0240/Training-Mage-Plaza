import {handleError} from '@assets/services/errorService';
import {api, auth} from '@assets/helpers';

export const authType = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_TOAST: 'SET_TOAST',
  CLOSE_TOAST: 'CLOSE_TOAST'
};

export const reducer = (state, {type, payload}) => {
  switch (type) {
    case authType.SET_USER:
      return {...state, user: payload};
    case authType.SET_LOADING:
      return {...state, loading: payload};
    case authType.SET_TOAST:
      return {...state, toast: payload};
    case authType.CLOSE_TOAST:
      return {...state, toast: undefined};
    default:
      return state;
  }
};

export function setLoading(dispatch, payload = true) {
  dispatch(authType.SET_LOADING, payload);
}

export function setToast(dispatch, content, error = false) {
  dispatch(authType.SET_TOAST, {content, error});
}

export function closeToast(dispatch) {
  dispatch(authType.CLOSE_TOAST);
}
export async function logout() {
  try {
    // setLoading(dispatch, true);
    await auth.signOut();
    window.location.href = '/auth/login';
  } catch (e) {
    handleError(e);
    // setLoading(dispatch, false);
    // setToast(dispatch, e.message, true);
  }
}
