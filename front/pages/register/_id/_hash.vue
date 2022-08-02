<template>
  <v-app>
    <p v-show="userData.certification === false">登録完了しました。</p>
    <p v-show="userData.certification === true">登録済みです。</p>
    <nuxt-link to="/login">ログインページへ遷移</nuxt-link>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CertificationPage',
  auth: false,
  computed: {
    ...mapGetters({
      userData: 'user/getUser',
    }),
  },
  mounted() {
    this.userCertification()
  },
  methods: {
    ...mapActions({
      certificationUser: 'user/certificationUser',
      findUser: 'user/findCertificationUser',
    }),

    async userCertification() {
      const userId = await this.$route.params.id.split('_')[1]
      await this.findUser(userId)
      const path = this.$route.fullPath
      const now = new Date()
      const nowTime = now.setHours(now.getHours())
      const time = path.split('?expires=')[1]
      if (time > nowTime === false) {
        this.certification = 'このURLはすでに有効期限切れか、正しくありません。'
        alert('このURLはすでに有効期限切れか、正しくありません。')
        this.$router.push({
          path: '/register',
        })
      } else {
        const certificationData = {
          userId,
          certification: true,
        }
        await this.certificationUser(certificationData)
      }
    },

    login() {
      this.$router.push('/register')
    },
  },
}
</script>

<style>
.login {
  width: fit-content;
}
</style>
