<template>
  <v-app id="inspire">
    <v-app-bar app clipped-right flat height="72">
      <v-spacer>チャンネル一覧</v-spacer>
      <v-btn @click="pageTransition()"><v-icon>mdi-home</v-icon></v-btn>
    </v-app-bar>
    <v-main>
      <v-col class="pb-0 px-6">
        <v-text-field
          v-model="channelName"
          label="チャンネル名"
          placeholder="チャンネル名"
          solo
          prepend-inner-icon="mdi-magnify"
          @keydown.enter="searchChannel"
        ></v-text-field>
      </v-col>
      <v-container v-show="!searchChannelName" class="pb-4 px-6" fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-subheader>参加中チャンネル一覧</v-subheader>
              <v-divider></v-divider>

              <v-list two-line>
                <template v-for="(channel, index) in channelData">
                  <v-list-item
                    v-show="
                      (channel.user.some(
                        (channel) => channel.userId === userId
                      ) &&
                        channel.tag.length >= 3) ||
                      userId === 1
                    "
                    :key="index"
                    @mouseover="
                      ParticipationChannelMouseover(channel.id, index)
                    "
                    @mouseleave="ParticipationChannelMouseleave()"
                  >
                    <v-list-item-content>
                      <div class="listItem">
                        <v-list-item class="channelName">
                          {{ channel.name }}</v-list-item
                        >
                        <v-list-item class="tag">tag:</v-list-item>
                        <v-list-item
                          v-for="tag in channel.tag"
                          :key="tag.id"
                          class="tagName"
                          >{{ tag.tagName }}</v-list-item
                        >
                      </div>
                      <v-list-item-subtitle>
                        チャンネル説明: {{ channel.explanation }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn
                      v-show="selectParticipationIndex === channel.id"
                      :disabled="userId === 1"
                      @click="channelExit()"
                      >退出する</v-btn
                    >
                  </v-list-item>

                  <v-divider
                    v-show="
                      channel.user.some(
                        (channel) => channel.userId === userId
                      ) && channel.tag.length >= 3
                    "
                    :key="`divider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-subheader>未参加チャンネル一覧</v-subheader>
              <v-divider></v-divider>

              <v-list two-line>
                <template v-for="(channel, index) in channelData">
                  <v-list-item
                    v-show="
                      !channel.user.some(
                        (channel) => channel.userId === userId
                      ) && userId !== 1
                    "
                    :key="index"
                    @mouseover="
                      NonParticipationChannelMouseover(channel.id, index)
                    "
                    @mouseleave="NonParticipationChannelMouseleave()"
                  >
                    <v-list-item-content>
                      <div class="listItem">
                        <v-list-item class="channelName">
                          {{ channel.name }}</v-list-item
                        >
                        <v-list-item class="tag">tag:</v-list-item>
                        <v-list-item
                          v-for="tag in channel.tag"
                          :key="tag.id"
                          class="tagName"
                          >{{ tag.tagName }}</v-list-item
                        >
                      </div>
                      <v-list-item-subtitle>
                        チャンネル説明: {{ channel.explanation }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn
                      v-show="selectNonParticipationIndex === channel.id"
                      :disabled="userId === 1"
                      @click="joinChannel()"
                      >参加する</v-btn
                    >
                  </v-list-item>

                  <v-divider
                    v-show="
                      !channel.user.some((channel) => channel.userId === userId)
                    "
                    :key="`divider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-show="searchChannelName" class="pt-0 pb-4 px-6" fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-subheader>検索参加中チャンネル一覧</v-subheader>
              <v-divider></v-divider>

              <v-list two-line>
                <template v-for="(channel, index) in channelList">
                  <v-list-item
                    v-show="
                      (channel.user.some(
                        (channel) => channel.userId === userId
                      ) &&
                        channel.tag.length >= 3) ||
                      userId === 1
                    "
                    :key="index"
                    @mouseover="
                      ParticipationChannelMouseover(channel.id, index)
                    "
                    @mouseleave="ParticipationChannelMouseleave()"
                  >
                    <v-list-item-content>
                      <div class="listItem">
                        <v-list-item class="channelName">
                          {{ channel.name }}</v-list-item
                        >
                        <v-list-item class="tag">tag:</v-list-item>
                        <v-list-item
                          v-for="tag in channel.tag"
                          :key="tag.id"
                          class="tagName"
                          >{{ tag.tagName }}</v-list-item
                        >
                      </div>
                      <v-list-item-subtitle>
                        チャンネル説明: {{ channel.explanation }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn
                      v-show="selectParticipationIndex === channel.id"
                      :disabled="userId === 1"
                      @click="channelExit()"
                      >退出する</v-btn
                    >
                  </v-list-item>

                  <v-divider
                    v-show="
                      channel.user.some(
                        (channel) => channel.userId === userId
                      ) &&
                      channel.tag.length >= 3 &&
                      userId !== 1
                    "
                    :key="`divider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-subheader>検索未参加チャンネル一覧</v-subheader>
              <v-divider></v-divider>

              <v-list two-line>
                <template v-for="(channel, index) in channelList">
                  <v-list-item
                    v-show="
                      !channel.user.some(
                        (channel) => channel.userId === userId
                      ) && userId !== 1
                    "
                    :key="index"
                    @mouseover="
                      NonParticipationChannelMouseover(channel.id, index)
                    "
                    @mouseleave="NonParticipationChannelMouseleave()"
                  >
                    <v-list-item-content>
                      <div class="listItem">
                        <v-list-item class="channelName">
                          {{ channel.name }}</v-list-item
                        >
                        <v-list-item class="tag">tag:</v-list-item>
                        <v-list-item
                          v-for="tag in channel.tag"
                          :key="tag.id"
                          class="tagName"
                          >{{ tag.tagName }}</v-list-item
                        >
                      </div>
                      <v-list-item-subtitle>
                        チャンネル説明: {{ channel.explanation }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn
                      v-show="selectNonParticipationIndex === channel.id"
                      :disabled="userId === 1"
                      @click="joinChannel()"
                      >参加する</v-btn
                    >
                  </v-list-item>

                  <v-divider
                    v-show="
                      !channel.user.some((channel) => channel.userId === userId)
                    "
                    :key="`divider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ChannelListPage',
  data: () => ({
    title: ['参加中チャンネル', '未参加チャンネル一覧'],
    userId: '',
    genreId: '',
    selectParticipationIndex: '',
    selectParticipationNum: '',
    selectNonParticipationIndex: '',
    selectNonParticipationNum: '',
    drawer: false,
    channelName: '',
    channelList: [],
    searchChannelName: false,
  }),
  computed: {
    ...mapGetters({
      channelData: 'channel/getChannelData',
    }),
  },
  mounted() {
    this.userId = this.$auth.user.id
    this.genreId = this.$route.query.genreId
    this.findChannels()
  },
  methods: {
    ...mapActions({
      findChannel: 'channel/findChannel',
      joinChannels: 'channel/joinChannel',
      exitChannel: 'channel/exitChannel',
    }),

    async findChannels() {
      const channelData = await this.findChannel(this.$route.query.genreId)
      return channelData
    },

    async joinChannel() {
      const joinChannelData = {
        userId: this.userId,
        genreId: Number(this.genreId),
        channelId: this.channelData[this.selectNonParticipationNum].id,
      }
      const joinChannel = await this.joinChannels(joinChannelData)
      return joinChannel
    },

    async channelExit() {
      const exitChannelData = {
        channelId: this.channelData[this.selectParticipationNum].id,
        userId: this.userId,
        genreId: Number(this.$route.query.genreId),
      }
      const exitChannel = await this.exitChannel(exitChannelData)
      return exitChannel
    },
    ParticipationChannelMouseover(participationChannelId, index) {
      this.selectParticipationIndex = participationChannelId
      this.selectParticipationNum = index
    },
    ParticipationChannelMouseleave() {
      this.selectParticipationIndex = ''
      this.selectParticipationNum = ''
    },
    NonParticipationChannelMouseover(nonParticipationChannelId, index) {
      this.selectNonParticipationIndex = nonParticipationChannelId
      this.selectNonParticipationNum = index
    },
    NonParticipationChannelMouseleave() {
      this.selectNonParticipationIndex = ''
      this.selectNonParticipationNum = ''
    },
    pageTransition() {
      this.$router.push({
        path: '/channel',
      })
    },
    searchChannel() {
      if (this.channelName !== '') {
        this.searchChannelName = true
        const channel = this.channelData.filter((channel) =>
          channel.name.includes(this.channelName)
        )
        this.channelList = channel
      } else if (this.channelName === '') {
        this.searchChannelName = false
      }
    },
  },
}
</script>

<style>
.listItem {
  display: flex;
  flex: initial;
}
.tagName {
  padding: 0;
  margin-left: 10px;
}
.tag {
  padding: 0;
  margin-left: 30px;
}
.channelName {
  padding: 0;
}
</style>
