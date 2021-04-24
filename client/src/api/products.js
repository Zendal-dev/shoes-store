import { instance } from './api'
import { delay } from '../utils'

const productsAPI = {
   async fetchProducts(sortByObj, pagination) {
      await delay()

      const { price, sizes, category } = sortByObj
      const { page, limit } = pagination

      const limitUrl = limit
         ? `limit=${limit}&`
         : ''

      const pageUrl = page >= 1
         ? `page=${page}&`
         : ''

      const sizesUrl = sizes.length > 0
         ? `sizes=${ sizes.join(',') }&`
         : ''

      const categoryUrl = (category !== 'all') && category
         ? `category=${category}&` : ''

      const priceRangeUrl = !price.order
         ? `priceRange=${price.from || 0}-${price.to || 0}&` : ''

      const priceSortUrl = price.order ? (
         price.order === 'asc' ? `priceSort=asc&` :
         price.order === 'desc' ? `priceSort=desc&` : ''
      ) : ''

      const url = ['products?']

      url.push(categoryUrl)
      url.push(priceSortUrl)
      url.push(priceRangeUrl)
      url.push(sizesUrl)
      url.push(pageUrl)
      url.push(limitUrl)

      const response = await instance.get(url.join(''))

      return response.data
   }
}

export default productsAPI