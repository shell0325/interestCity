<template>
  <v-app>
    <v-list class="list" color="#121212">
      <v-list-item>
        <v-list-item-title
          v-show="userData.certification === false"
          class="register"
          >登録完了しました。</v-list-item-title
        >
        <v-list-item-title
          v-show="userData.certification === true"
          class="register"
          >登録済みです。</v-list-item-title
        >
      </v-list-item>
      <nuxt-link to="/login" class="register">ログインページへ遷移</nuxt-link>
    </v-list>
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
.list {
  margin: auto;
  background-color: #121212;
}
.register {
  font-size: larger;
}
</style>
