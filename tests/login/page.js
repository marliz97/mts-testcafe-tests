import {Selector} from 'testcafe'

export default class LoginPage {
  
  constructor() {
    this.phone          = Selector('#phone-input')
    this.submit         = Selector('mts-button').withExactText('Войти')
    this.nextButton     = Selector('mts-button').withExactText('Далее')
    this.password       = Selector('#password-input')
    this.smsCode        = Selector(() => document.querySelector('#code-input').shadowRoot.querySelector('input[name=code]'))
    this.errorMessage   = Selector(() => document.querySelector('mts-text-field').shadowRoot.querySelector('span.field-help'))
    this.captchaImage   = Selector('#captcha-image')
    this.refreshCaptcha = Selector('#refresh-link')
    this.captchaCode    = Selector(() => document.querySelector('mts-text-field').shadowRoot.querySelector('input[placeholder=Код]'))
  }
}