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
        </v-row>
        <v-btn>ログイン</v-btn>
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
  validations: {
    email: { required, email },
  },

  data() {
    return {
      email: '',
      password: '',
      valid: false,
      // emailRules: [
      //   (v) => !!v || 'E-mail is required',
      //   (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      // ],
      passwordRules: {
        required: (value) => !!value || '入力してください',
        min: (v) => v.length >= 8 || '８文字以上入力してください',
        max: (v) => v.length <= 20 || '20文字以下で入力してください',
      },
      show1: false,
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
}
</script>

<style scoped>
.form {
  width: 50%;
  margin-inline: auto;
}

.row {
  display: block;
}
</style>
