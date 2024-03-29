<template>
  <v-app>
    <v-form v-model="valid" class="form">
      <v-container>
        <v-row class="row">
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
        </v-row>
        <v-btn @click="login()">ログイン</v-btn>
        <v-btn @click="register()">会員登録</v-btn>
        <v-btn @click="guestLogin()">ゲストログイン</v-btn>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'LoginPage',
  mixins: [validationMixin],
  middleware: 'login',
  validations: {
    email: { required, email },
  },

  data() {
    return {
      email: '',
      password: '',
      valid: false,
      passwordRules: {
        required: (value) => !!value || '入力してください',
        min: (v) => v.length >= 8 || '８文字以上入力してください',
        max: (v) => v.length <= 20 || '20文字以下で入力してください',
      },
      showPassword: false,
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
  mounted() {
    this.email = ''
    this.password = ''
  },
  methods: {
    register() {
      this.$router.push('/register')
    },
    async login() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        return response
      } catch (e) {
        alert(
          '本登録が終わっていないまたはパスワードもしくはEmailが間違っています'
        )
      }
    },
    async guestLogin() {
      const response = await this.$auth.loginWith('local', {
        data: {
          email: process.env.GUEST_EMAIL,
          password: process.env.GUEST_PASSWORD,
        },
      })
      return response
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
