const { body } = require('express-validator')
const confirmPassword = require('./helpers/confirmPassword')

module.exports = [
   body('username')
      .isLength({ min: 2, max: 20 })
      .withMessage('Имя должно быть больше 2 и меньше 20 символов')
      .trim(),
   body('email')
      .isEmail()
      .withMessage('Введите корректный email')
      .trim(),
   body('password')
      .isLength({ min: 4, max: 35 })
      .withMessage('Пароль должен быть больше 4 и меньше 35 символов')
      .trim(),
   body('confirm')
      .custom(confirmPassword)
]