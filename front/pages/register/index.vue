<template>
  <v-app>
    <v-form ref="form" v-model="valid" class="form">
      <v-container>
        <v-row class="row">
          <v-col>
            <v-text-field
              v-model="username"
              :rules="[usernameRules.required, usernameRules.max]"
              label="UserName"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="E-mail"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="password"
              label="Password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[
                passwordRules.required,
                passwordRules.min,
                passwordRules.max,
              ]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="repassword"
              label="RePassword"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[
                passwordRules.required,
                passwordRules.min,
                passwordRules.max,
              ]"
              :type="show2 ? 'text' : 'password'"
              name="input-10-1"
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          dark
          :disabled="
            password !== repassword ||
            password === '' ||
            email === '' ||
            username === ''
          "
          class="text-caption addChannel mr-0 px-0"
        >
          ユーザー登録
        </v-btn>

        <v-btn @click="login()">ログイン画面へ</v-btn>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'RegisterPage',
  auth: false,
  mixins: [validationMixin],
  validations: {
    email: { required, email },
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      repassword: '',
      valid: false,
      usernameRules: {
        required: (value) => !!value || '入力してください',
        max: (value) => value.length <= 20 || '20文字以下で入力してください',
      },
      passwordRules: {
        required: (value) => !!value || '入力してください',
        min: (value) => value.length >= 8 || '８文字以上入力してください',
        max: (value) => value.length <= 20 || '20文字以下で入力してください',
      },
      show1: false,
      show2: false,
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
  },

  methods: {
    login() {
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.container {
  text-align: center;
}

.form {
  width: 50%;
  margin-inline: auto;
}
.row {
  display: block;
}
</style>
