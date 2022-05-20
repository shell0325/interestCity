<template>
  <v-app>
    <v-card class="mx-auto my-auto" width="600" tile>
      <h1>チャンネルを作成</h1>
      <v-text-field
        v-model="channelName"
        :counter="45"
        :rules="channelNameRule"
        label="チャンネル名を入力"
        required
      ></v-text-field>
      <v-textarea
        v-model="explanation"
        outlined
        name="input-7-4"
        :counter="255"
        :rules="explanationRule"
        label="チャンネル説明を入力してください"
      ></v-textarea>
      <v-btn
        :disabled="!channelName"
        color="deep-orange lighten-3"
        class="mr-4"
        @click="createChannel()"
      >
        チャンネルを作成する
      </v-btn>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ChannelCreatePage',
  auth: false,
  data() {
    return {
      channelName: '',
      tagName: '',
      explanation: '',
      channelNameRule: [
        (v) => !!v || 'チャンネルネームを入力してください',
        (v) =>
          (v && v.length <= 45) ||
          'チャンネルネームは45文字以下で入力してください',
      ],

      explanationRule: [
        (v) => v.length <= 255 || 'Name must be less than 500 characters',
      ],
    }
  },
  methods: {
    async createChannel() {
      const createChannelData = {
        name: this.channelName,
        genreId: this.$route.query.genreId,
        userId: this.$auth.user.id,
        explanation: this.explanation,
      }
      if (this.channelName) {
        const channel = await axios.post(
          'http://localhost:3000/channel',
          createChannelData
        )
        if (channel.data.data.channel) {
          this.$router.push({
            path: '/channel/tagCreate',
            query: {
              channelId: channel.data.data.channel.id,
              genreId: this.$route.query.genreId,
            },
          })
        } else if (!channel.data.data.channel) {
          alert('チャンネルを作成できませんでした')
        }
      }
    },
  },
}
</script>

<style scoped>
.mx-auto {
  border: white 1px solid;
  padding: 10px;
  text-align: center;
}
</style>
