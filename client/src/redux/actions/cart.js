import { cartAPI } from '../../services'

import {
   CLEAR_CART,
   ADD_PRODUCT_TO_CART,
   SET_REMOVING_STATE,
   FETCH_CART_SUCCESS,
   FETCH_CART_INFO_SUCCESS,
   SET_IS_LOADED,
   SET_ADDING_STATE
} from '../actionTypes/cart'

import { setAlert } from './alert'
import { checkAndSetAppError } from './app'
import { delay, history } from '../../utils'

const addProductToCartSuccess = {
   type: ADD_PRODUCT_TO_CART
}

const clearCartAC = {
   type: CLEAR_CART
}

const setIsLoaded = bool => ({
   type: SET_IS_LOADED,
   payload: bool
})

const setAddingState = (itemId, bool) => ({
   type: SET_ADDING_STATE,
   payload: {
      itemId,
      isLoading: bool
   }
})

const setRemovingState = (itemId, bool) => ({
   type: SET_REMOVING_STATE,
   payload: {
      itemId,
      isLoading: bool
   }
})

const fetchCartInfoSuccess = (totalPrice, totalCount) => ({
   type: FETCH_CART_INFO_SUCCESS,
   payload: {
      totalPrice,
      totalCount
   }
})

const fetchCartSuccess = (products, totalPrice, totalCount) => ({
   type: FETCH_CART_SUCCESS,
   payload: {
      products,
      totalPrice,
      totalCount
   }
})

export const fetchCart = () => async dispatch => {
   try {
      dispatch(setIsLoaded(false))
      const { products, totalPrice, totalCount } = await cartAPI.fetchCart()

      dispatch(fetchCartSuccess(products, totalPrice, totalCount))
   } catch (e) {
      console.log(e)
      dispatch(checkAndSetAppError(e))
   } finally {
      dispatch(setIsLoaded(true))
   }
}

export const fetchCartInfo = () => async (dispatch, getState) => {
   try {
      if (!getState().auth.isAuthed) return null

      const { totalPrice, totalCount } = await cartAPI.fetchCartInfo()

      dispatch(fetchCartInfoSuccess(totalPrice, totalCount))
   } catch (e) {
      console.log(e)
      dispatch(checkAndSetAppError(e))
   }
}

export const addProductToCart = productId => async (dispatch, getState) => {
   try {
      if (!getState().auth.isAuthed) {
         dispatch(setAlert('Для добавления товара в корзину необходимо авторизоваться'))
         return history.push('/auth/login')
      }

      dispatch(setAddingState(productId, true))

      await delay(200)
      await cartAPI.addProductToCart(productId)

      dispatch(addProductToCartSuccess)
      dispatch(fetchCartInfo())
   } catch (e) {
      console.log(e)
      dispatch(checkAndSetAppError(e))
   } finally {
      dispatch(setAddingState(productId, false))
   }
}

export const plusItemCount = productId => async dispatch => {
   try {
      const { products, totalPrice, totalCount } = await cartAPI.plusProductCount(productId)
      dispatch(fetchCartSuccess(products, totalPrice, totalCount))
   } catch (e) {
      console.log(e)
      dispatch(checkAndSetAppError(e))
   }
}

export const minusItemCount = productId => async dispatch => {
   try {
      const { products, totalPrice, totalCount } = await cartAPI.minusProductCount(productId)
      dispatch(fetchCartSuccess(products, totalPrice, totalCount))
   } catch (e) {
      console.log(e)
      dispatch(checkAndSetAppError(e))
   }
}

export const clearCart = () => async dispatch => {
   try {
      await cartAPI.clearCart()
      dispatch(clearCartAC)
   } catch (e) {
      console.log(e)
      dispatch(checkAndSetAppError(e))
   }
}


export const removeItemFromCart = itemId => async dispatch => {
   if (window.confirm('Вы действительно хотите удалить это товар из корзины?')) {
      dispatch(setRemovingState(itemId, true))

      try {
         const { products, totalPrice, totalCount } = await cartAPI.removeFromCart(itemId)
         dispatch(fetchCartSuccess(products, totalPrice, totalCount))
      } catch (e) {
         console.log(e)
         dispatch(checkAndSetAppError(e))
      } finally {
         dispatch(setRemovingState(itemId, false))
      }
   }
}


