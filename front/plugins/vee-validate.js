import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'

// extend('required', required)
// extend('email', email)
// extend('max', max)
// extend('min',min)
// for (let rule in rules) {
//   extend(rule, rules[rule])
// }

Vue.use(VeeValidate)
Validator.localize('ja', ja)
