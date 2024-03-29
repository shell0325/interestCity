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
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[
                passwordRules.required,
                passwordRules.min,
                passwordRules.max,
              ]"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-1"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="rePassword"
              label="RePassword"
              :append-icon="showRePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[
                passwordRules.required,
                passwordRules.min,
                passwordRules.max,
              ]"
              :type="showRePassword ? 'text' : 'password'"
              name="input-10-1"
              @click:append="showRePassword = !showRePassword"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          dark
          :disabled="
            password !== rePassword ||
            password === '' ||
            email === '' ||
            username === ''
          "
          class="text-caption mr-0 px-0"
          @click="userRegister()"
        >
          ユーザー登録
        </v-btn>

        <v-btn @click="login()">ログイン画面へ</v-btn>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import axios from 'axios'
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
      rePassword: '',
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
      showPassword: false,
      showRePassword: false,
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

    async userRegister() {
      if (this.$refs.form.validate()) {
        await axios
          .post(`http://${process.env.HOST}:${process.env.API_PORT}/user`, {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then((data) => {
            if (
              data.data.data.user === 'このメールアドレスは使用されています'
            ) {
              alert('このメールアドレスは既に登録されています')
            } else if (data.data.data.user === '会員登録メールを送信しました') {
              alert('会員登録メールを送信しました\nこのページを閉じてください')
            }
          })
      }
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
