<template>
  <v-app>
    <p v-show="getterUser.certification === false">登録完了しました。</p>
    <p v-show="getterUser.certification === true">登録済みです。</p>
    <v-btn class="login" @click="login">ログインページへ</v-btn>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CertificationPage',
  auth: false,
  data() {
    return {
      userData: [],
    }
  },
  computed: {
    ...mapGetters({
      getterUser: 'user/getUser',
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
      } else {
        const certificationData = {
          userId,
          certification: true,
        }
        await this.certificationUser(certificationData)
      }
    },

    login() {
      this.$router.push({
        path: '/login',
      })
    },
  },
}
</script>

<style>
.login {
  width: fit-content;
}
</style>
