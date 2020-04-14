import {RequestLogger}  from 'testcafe'
import LoginPage        from './page'
const page              = new LoginPage()

const logger = RequestLogger({url: 'https://login.mts.ru/amserver/UI/Login?service=login', method: 'POST'}, {
  logRequestBody: true,
  stringifyRequestBody: true,
})

fixture('Captcha')
  .page('https://login.mts.ru/amserver/UI/Login?service=login')
  .beforeEach(async t => {
    
    // Общая чать, выполняемая каждым тестом, чтобы дойти до капчи
    await t .typeText (page.phone, '9998002818')    // Вводим номер телефона
            .click    (page.submit)                 // Нажимаем войти
            .typeText (page.smsCode, '1234')        // Вводим неверный код
            .expect   (page.smsCode.value).eql('')  // Ожидаем автоочищения инпута после обработки запроса
            .typeText (page.smsCode, '1234')        // Вводим неверный код 2-й раз
            .expect   (page.smsCode.value).eql('')  // Ожидаем автоочищения инпута
            .typeText (page.smsCode, '1234')        // Вводим неверный код 3-й раз
            .hover    (page.captchaImage)           // Наводим ховер на капчу, убеждаемя, что она видна 
  })

  test
    ('Type incorrect captcha', async t => { 

      const captchaSrcOld = await page.captchaImage.getAttribute('src') // получаем атрибут src у img#captcha-image

      await t .typeText (page.captchaCode, '12345') // Вводим неверный код
              .click    (page.nextButton)           // Жмем далее
              .hover    (page.errorMessage)         // Наводим ховер на ошибку, чтобы убедиться, что она отображается
              .expect   (page.errorMessage.innerText).eql('Вы ввели неверный код.') // Проверяем текст ошибки.

      const captchaSrcNew = await page.captchaImage.getAttribute('src') // Получаем новое значение атрибута src у img#captcha-image

      await t .expect (captchaSrcNew !== captchaSrcOld).ok() // Сравниваем два значения, чтобы убедиться, что картинка капчи поменялась
  })

  test
    ('Refresh captcha', async t => { 

      const captchaSrcOld = await page.captchaImage.getAttribute('src') // получаем атрибут src у img#captcha-image

      await t .addRequestHooks(logger)      // Подключаем логгер для запроса https://login.mts.ru/amserver/UI/Login?service=login
              .click  (page.refreshCaptcha) // Рефрешим капчу
              .expect (logger.contains(record => record.response.statusCode === 200)).ok() // Ожидаем, что был отправлен успешный запрос

      const captchaSrcNew = await page.captchaImage.getAttribute('src') // Получаем новое значение атрибута src у img#captcha-image

      await t .expect (captchaSrcNew !== captchaSrcOld).ok() // Сравниваем два значения, чтобы убедиться, что картинка капчи поменялась
  })