export const getProducts = state => state.products.products
export const getIsLoading = state => state.products.isLoading
export const getTotalPages = state => Math.ceil(state.products.totalCount / state.filters.pageLimit)
export const getTotalCount = state => state.products.totalCount
export const getError = state => state.products.error
