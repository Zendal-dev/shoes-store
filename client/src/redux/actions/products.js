import {
   CLEAR_PRODUCTS,
   SET_IS_LOADING,
   SUCCESS_FETCHING_PRODUCTS,
   ERROR_FETCHING_PRODUCTS
} from '../actionTypes/products'
import { productsAPI } from './../../api'
import { checkAndSetAppError } from './app'

const setIsLoading = bool => ({
   type: SET_IS_LOADING,
   payload: bool
})

const successFetching = (items, totalCount) => ({
   type: SUCCESS_FETCHING_PRODUCTS,
   payload: { items, totalCount }
})

const errorFetching = error => ({
   type: ERROR_FETCHING_PRODUCTS,
   payload: error
})

const clearProducts = {
   type: CLEAR_PRODUCTS
}

export const fetchProducts = (filters, currentPage) => async (dispatch, getState) => {
   dispatch(setIsLoading(true))

   const token = getState().auth.token

   if (!token) {
      dispatch(clearProducts)
   }

   const pagination = {
      page: currentPage,
      limit: getState().filters.pageLimit
   }

   try {
      const { products, totalCount } = await productsAPI.fetchProducts(filters, pagination, token)
      dispatch(successFetching(products, totalCount))
   } catch (e) {
      dispatch(checkAndSetAppError(e))
      dispatch(errorFetching(e.response.data))
      dispatch(setIsLoading(false))
   }
}