<template>
  <v-app id="inspire">
    <!-- タイトル入力画面 -->
    <v-app-bar app clipped-right flat height="72">
      <v-spacer v-if="!selectChannelIndex">チャンネルタイトル</v-spacer>
      <v-spacer v-else-if="channelData.length !== 0">{{
        channelData[selectChannelNum].name
      }}</v-spacer>
      <v-menu bottom offset-x offset-y :nudge-width="300">
        <template #activator="{ on, attrs }">
          <v-btn
            style="text-transform: none"
            icon
            tile
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar
              v-if="!userProfile.profileImagePath"
              class="d-block mr-3"
              color="blue"
              size="40"
              rounded
            >
              <span class="white--text headline">{{ topName }}</span>
            </v-avatar>
            <v-avatar
              v-else-if="userProfile.profileImagePath"
              size="40"
              rounded
            >
              <img :src="`${userProfile.profileImagePath}`" />
            </v-avatar>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-avatar
                v-if="!userProfile.profileImagePath"
                class="d-block mr-3"
                color="blue"
                size="40"
                rounded
              >
                <span class="white--text headline">{{ topName }}</span>
              </v-avatar>
              <v-avatar
                v-else-if="userProfile.profileImagePath"
                size="40"
                rounded
              >
                <img :src="`${userProfile.profileImagePath}`" />
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>{{
                  userProfile.username
                }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn @click="overlay = !overlay"
                  >プロフィールを編集する
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item-title class="px-4">自己紹介</v-list-item-title>
            <v-list-item>
              <v-list-item-title class="self_introduction" px-0>{{
                self_introduction
              }}</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item class="px-0">
              <v-list-item-action class="logout">
                <v-btn block @click="logout()">logout</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <!-- チャンネル一覧を表示させるサイドバーについて -->
    <v-navigation-drawer app width="300">
      <v-navigation-drawer absolute color="grey lighten-3" width="70">
        <!-- ジャンルアイコンのスペース -->
        <v-divider class="mx-3 my-5"></v-divider>
        <!-- ジャンルのアイコンや文字を入力する部分 -->
        <v-btn
          v-for="(genre, index) in genreData"
          :key="index"
          icon
          tile
          large
          class="d-block text-center mx-auto mb-9"
        >
          <v-avatar
            tile
            :class="{
              isSelect: genre.genre.id === selectGenreIndex,
              selectGenre,
            }"
            @click="selectGenre(genre.genre.id, index), findChannels()"
          >
            <img :src="require(`@/assets/${genre.genre.name}.jpg`)" />
          </v-avatar>
        </v-btn>
        <v-btn
          icon
          tile
          large
          class="d-block text-center mx-auto mb-9"
          :disabled="userId === 1"
          @click="registerGenre()"
        >
          <v-icon color="black">mdi-plus</v-icon>
        </v-btn>
      </v-navigation-drawer>
      <!-- チャンネル上のスペース -->
      <v-card color="red" height="72" width="245" class="ml-auto">
        <v-card-title
          v-if="!selectGenreIndex"
          width="50px"
          class="text-h6 text--primary justify-center"
        >
          ジャンル名
        </v-card-title>
        <v-card-title
          v-else-if="genreData.length !== 0"
          width="50px"
          class="text-h6 text--primary justify-center"
        >
          {{ genreData[selectGenreNum].genre.name }}
        </v-card-title>
      </v-card>
      <v-list nav dense class="pl-16 px-0">
        <v-list-item-group v-model="selectedChannel" color="primary">
          <v-list-item>
            <v-list-item-title
              height="100%"
              class="channelName list-dense-subheader-font-size-10"
              color="red"
              @click="getBookmarkComments()"
              >ブックマーク</v-list-item-title
            >
          </v-list-item>
          <v-list-item
            v-for="(channel, index) in channelData"
            v-show="
              (channel.user.some((channel) => channel.userId === userId) &&
                channel.tag.length >= 3) ||
              (userId === 1 && selectGenreIndex !== '')
            "
            :key="index"
          >
            <v-list-item-title
              height="100%"
              class="channelName list-dense-subheader-font-size-10"
              @click="
                getChannelComment(channel.id)
                selectChannel(channel.id, index)
              "
              >{{ channel.name }}</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-list class="pl-14 px-0" rounded>
        <v-menu bottom :offset-y="offset">
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              :disabled="!selectGenreIndex"
              class="text-caption addChannel mr-0 px-0"
              v-on="on"
            >
              チャンネルを追加する
            </v-btn>
          </template>
          <v-list>
            <v-list-item :disabled="userId === 1" @click="createChannel()">
              <v-list-item-title>新しいチャンネルを作成する</v-list-item-title>
            </v-list-item>
            <v-list-item @click="findJoinChannel()">
              <v-list-item-title>チャンネル一覧を確認する</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list>
    </v-navigation-drawer>
    <!-- スレッドを表示させるサイドバー -->
    <v-navigation-drawer
      v-model="drawer"
      app
      width="400"
      clipped
      right
      stateless
    >
      <v-list class="threadComment">
        <v-toolbar>
          <v-toolbar-title> スレッド </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon small class="closeThread" @click="closeThread()">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-list-item-title v-if="channelCommentsData.length !== 0">{{
            channelCommentsData[selectCommentNum].comment
          }}</v-list-item-title>
        </v-card>
        <v-card v-for="(thread, index) in threadCommentData" :key="index">
          <v-list-item>
            <v-list-item-content>
              <v-list-item>
                <v-list-item-title class="commentUsername">{{
                  thread.user.username
                }}</v-list-item-title>
                <v-list-item-title>{{ thread.createdAt }}</v-list-item-title>
              </v-list-item>
              <v-list-item-title>{{ thread.comment }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-list>
      <!-- スレッドを入力&表示する部分 -->
      <v-footer>
        <v-textarea
          v-model="threadComment"
          background-color="grey lighten-1"
          dense
          flat
          solo
          filled
          auto-grow
          rows="3"
          class="textarea"
        ></v-textarea>
        <div class="sendComments">
          <v-btn
            class="sendCommentsBtn mt-1"
            fab
            dark
            small
            color="black"
            :disabled="userId === 1"
            @click="sendThreadComments()"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </div>
      </v-footer>
    </v-navigation-drawer>
    <v-main class="main">
      <v-overlay
        opacity="0.9"
        :value="overlay"
        class="overlay justify-center"
        :absolute="absolute"
      >
        <v-card width="700" class="editUser">
          <v-btn icon small class="closeBtn" @click="overlay = false">
            <v-icon> mdi-window-close </v-icon>
          </v-btn>
          <v-file-input
            v-if="profilePicture"
            :rules="fileRules"
            accept="image/png, image/jpg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            :disabled="userId === 1"
            label="Avatar"
            @change="selectProfileImage"
          ></v-file-input>
          <v-col cols="12" sm="13">
            <v-text-field
              v-model="editUsername"
              :rules="usernameRules"
              counter
              maxlength="20"
              label="ユーザーネーム"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <v-textarea
              v-model="editSelfIntroduction"
              outlined
              counter
              auto-grow
              rows="4"
              maxlength="255"
              label="プロフィールを入力してください"
            ></v-textarea>
          </v-col>
          <v-card-actions class="editBtn">
            <v-checkbox
              v-model="selected"
              label="プロフィール写真を変更しない"
              @click="selected = true"
            ></v-checkbox>
            <v-btn class="ma-1" plain @click="overlay = false"> Cancel </v-btn>
            <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              :disabled="userId === 1"
              @click="
                editProfileImage()
                overlay = false
              "
            >
              Upload
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-card
        v-for="(bookmarkComments, index) in bookmarkData"
        v-show="showBookmark && !selectChannelIndex"
        :key="`first-${index}`"
      >
        <v-list class="commentList">
          <v-card class="commentBtn">
            <v-btn
              icon
              small
              color="yellow"
              :disabled="userId === 1"
              @click="
                selectCommentMouseover(
                  bookmarkComments.master_comment.id,
                  index
                ),
                  toggleBookmarks()
              "
              ><v-icon>mdi-star</v-icon></v-btn
            >
            <v-btn
              icon
              small
              @click.stop="drawer = true"
              @click="openThread(), findThreadComments()"
              ><v-icon>mdi-message-reply-text-outline</v-icon></v-btn
            >
            <v-menu bottom offset-x offset-y :nudge-width="150">
              <template #activator="{ on, attrs }">
                <v-btn
                  v-show="bookmarkComments.user.id === userId"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-dots-horizontal</v-icon></v-btn
                >
              </template>
              <v-card>
                <v-list class="py-0">
                  <v-list-item class="px-0 editComment">
                    <v-list-item-action class="logout">
                      <v-btn
                        block
                        class="px-0"
                        @click="
                          selectCommentMouseover(
                            bookmarkComments.master_comment.id,
                            index
                          ),
                            openEditComment()
                        "
                        >コメントを編集する</v-btn
                      >
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item class="px-0 editComment">
                    <v-list-item-action class="logout">
                      <v-btn
                        block
                        class="px-0"
                        @click="
                          selectCommentMouseover(
                            bookmarkComments.master_comment.id,
                            index
                          ),
                            deleteComments()
                          getChannelComment(selectChannelIndex)
                        "
                        >コメントを削除する</v-btn
                      >
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-card>
          <v-list-item class="comment">
            <v-list-item-content>
              <v-textarea
                v-show="
                  editComments &&
                  selectCommentIndex === bookmarkComments.master_comment.id
                "
                v-model="comment"
                background-color="grey lighten-1"
                dense
                flat
                solo
                filled
                auto-grow
                rows="3"
                class="textarea"
              >
              </v-textarea>

              <v-list-item class="pl-0">
                <v-avatar
                  v-if="!bookmarkComments.user.profileImagePath"
                  class="d-block mr-3"
                  color="blue"
                  size="30"
                  rounded
                >
                  <span class="white--text headline">{{ topName }}</span>
                </v-avatar>
                <v-avatar
                  v-else-if="bookmarkComments.user.profileImagePath"
                  class="d-block mr-3"
                  size="30"
                  rounded
                >
                  <img :src="`${bookmarkComments.user.profileImagePath}`" />
                </v-avatar>

                <v-list-item-title class="commentUsername">{{
                  bookmarkComments.user.username
                }}</v-list-item-title>
                <v-list-item-title>{{
                  bookmarkComments.master_comment.createdAt
                }}</v-list-item-title>
              </v-list-item>
              <v-card-text>{{
                bookmarkComments.master_comment.comment
              }}</v-card-text>
              <v-img
                v-show="bookmarkComments.master_comment.picture"
                class="ml-11"
                :lazy-src="`${bookmarkComments.master_comment.picture}`"
                max-height="150"
                max-width="250"
                :src="`${bookmarkComments.master_comment.picture}`"
              ></v-img>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card
        v-for="(comments, index) in channelCommentsData"
        v-show="!showBookmark && selectChannelIndex"
        :key="`second-${index}`"
      >
        <v-list class="commentList">
          <v-card class="commentBtn">
            <v-btn
              v-show="
                comments.bookmark.some((u) => u.userId === userId) &&
                (!editComments || selectCommentIndex !== comments.id)
              "
              icon
              small
              color="yellow"
              :disabled="userId === 1"
              @click="
                selectCommentMouseover(comments.id, index), toggleBookmarks()
              "
              ><v-icon>mdi-star</v-icon></v-btn
            >
            <v-btn
              v-show="
                !comments.bookmark.some((u) => u.userId === userId) &&
                (!editComments || selectCommentIndex !== comments.id)
              "
              icon
              small
              :disabled="userId === 1"
              @click="
                selectCommentMouseover(comments.id, index), toggleBookmarks()
              "
              ><v-icon>mdi-star</v-icon></v-btn
            >
            <v-btn
              v-show="!editComments || selectCommentIndex !== comments.id"
              icon
              small
              @click.stop="drawer = true"
              @click="
                selectCommentMouseover(comments.id, index)
                openThread()
                findThreadComments()
              "
              ><v-icon>mdi-message-reply-text-outline</v-icon></v-btn
            >
            <v-menu bottom offset-x offset-y :nudge-width="150">
              <template #activator="{ on, attrs }">
                <v-btn
                  v-show="
                    comments.userId === userId &&
                    (!editComments || selectCommentIndex !== comments.id)
                  "
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-dots-horizontal</v-icon></v-btn
                >
              </template>
              <v-card>
                <v-list class="py-0">
                  <v-list-item class="px-0 editComment">
                    <v-list-item-action class="logout">
                      <v-btn
                        block
                        class="px-0"
                        @click="
                          selectCommentMouseover(comments.id, index),
                            openEditComment()
                        "
                        >コメントを編集する</v-btn
                      >
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item class="px-0 editComment">
                    <v-list-item-action class="logout">
                      <v-btn
                        block
                        class="px-0"
                        @click="
                          selectCommentMouseover(comments.id, index),
                            deleteComments()
                          getChannelComment(selectChannelIndex)
                        "
                        >コメントを削除する</v-btn
                      >
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-card>
          <v-list-item class="comment">
            <v-list-item-content
              v-show="editComments && selectCommentIndex === comments.id"
            >
              <v-textarea
                v-show="editComments && selectCommentIndex === comments.id"
                v-model="editCommentText"
                background-color="grey lighten-1"
                dense
                flat
                solo
                filled
                auto-grow
                rows="3"
                class="textarea"
              >
              </v-textarea>
              <v-list-item-action class="sendComments">
                <v-btn
                  class="sendCommentsBtn mt-1 mx-1 white--text"
                  color="blue-grey"
                  @click="saveEditComment()"
                >
                  保存する
                </v-btn>
                <v-btn
                  class="sendCommentsBtn mt-1"
                  plain
                  @click=";(editComments = false), (comment = '')"
                >
                  キャンセル
                </v-btn>
              </v-list-item-action>
            </v-list-item-content>
            <v-list-item-content
              v-show="!editComments || selectCommentIndex !== comments.id"
            >
              <v-list-item class="pl-0 commentItemList">
                <v-avatar
                  v-if="!comments.user.profileImagePath"
                  class="d-block mr-3"
                  color="blue"
                  size="30"
                  rounded
                >
                  <span class="white--text headline">{{ topName }}</span>
                </v-avatar>
                <v-avatar
                  v-else-if="comments.user.profileImagePath"
                  class="d-block mr-3"
                  size="30"
                  rounded
                >
                  <img :src="`${comments.user.profileImagePath}`" />
                </v-avatar>
                <v-list-item-title class="commentUsername">{{
                  comments.user.username
                }}</v-list-item-title>
                <v-list-item-title>{{ comments.createdAt }}</v-list-item-title>
              </v-list-item>
              <v-card-text class="commentText">{{
                comments.comment
              }}</v-card-text>
              <v-img
                v-show="comments.picture"
                class="ml-11"
                :lazy-src="`${comments.picture}`"
                max-height="150"
                max-width="250"
                :src="`${comments.picture}`"
              ></v-img>
            </v-list-item-content>
          </v-list-item>
          <v-btn
            v-show="
              !comments.likes.some((u) => u.userId === userId) &&
              (!editComments || selectCommentIndex !== comments.id)
            "
            icon
            small
            class="ml-11"
            :disabled="userId === 1"
            @click="
              selectCommentMouseover(comments.id, index),
                toggleLike(),
                getChannelComment(selectChannelIndex)
            "
          >
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn
            v-show="
              comments.likes.some((u) => u.userId === userId) &&
              (!editComments || selectCommentIndex !== comments.id)
            "
            icon
            small
            class="ml-11"
            color="red"
            :disabled="userId === 1"
            @click="
              selectCommentMouseover(comments.id, index)
              toggleLike()
              getChannelComment(selectChannelIndex)
            "
          >
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </v-list>
      </v-card>
      <!--チャンネルのコメントを表示する部分-->
    </v-main>
    <!-- 文字を入力する部分 -->
    <v-footer app dark inset margin-bottom="0" class="footer">
      <v-file-input
        v-if="commentPicture"
        class="inputFile"
        :rules="sendPictureRules"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="写真を選択してください"
        prepend-icon="mdi-camera"
        label="picture"
        @change="selectSendImage"
      ></v-file-input>
      <v-textarea
        v-model="comment"
        background-color="grey lighten-1"
        dense
        flat
        solo
        filled
        auto-grow
        rows="3"
        class="textarea"
      >
      </v-textarea>
      <div class="sendComments">
        <v-btn
          class="sendCommentsBtn mt-1"
          fab
          dark
          small
          :disabled="
            !selectGenreIndex || !selectChannelIndex || userId === 1 || !comment
          "
          color="black"
          @click="sendComments()"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ChannelPage',
  middleware: 'channel',
  data() {
    return {
      username: '',
      userId: '',
      self_introduction: '',
      drawer: false,
      comment: '',
      editCommentText: '',
      selectGenreIndex: '',
      selectChannelIndex: '',
      selectCommentIndex: '',
      selectMasterCommentNum: 0,
      selectGenreNum: 0,
      selectChannelNum: 0,
      selectCommentNum: 0,
      offset: true,
      menu_list: [
        { item_list: '新しいチャンネルを作成する' },
        { item_list: 'チャンネル一覧を確認する' },
      ],
      threadComment: '',
      selectedChannel: '',
      overlay: false,
      usernameRules: [(v) => v.length <= 20 || 'Max 20 characters'],
      editUsername: '',
      editSelfIntroduction: '',
      editProfileImagePath: '',
      fileRules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
      ],
      absolute: true,
      editComments: false,
      showBookmark: false,
      profileImagePath: '',
      sendPictureData: '',
      sendPictureRules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
      ],
      selected: false,
      commentPicture: true,
      profilePicture: true,
    }
  },
  computed: {
    ...mapGetters({
      genreData: 'channel/getGenreData',
      channelData: 'channel/getChannelData',
      channelCommentsData: 'channel/getChannelComments',
      threadCommentData: 'channel/getThreadComment',
      userProfile: 'channel/getUserProfile',
      topName: 'channel/getTopName',
      bookmarkData: 'channel/getBookmarkComments',
    }),
  },
  mounted() {
    this.findUser(this.$auth.user.id)
    this.username = this.$auth.user.username
    this.self_introduction = this.$auth.user.self_introduction
    this.userId = this.$auth.user.id
    this.editUsername = this.userProfile.username
    this.editSelfIntroduction = this.$auth.user.self_introduction
    this.getGenre(this.$auth.user.id)
    this.getChannelComments(this.selectChannelIndex)
  },
  methods: {
    ...mapActions({
      sendComment: 'channel/sendComment',
      findGenre: 'channel/findGenre',
      findChannel: 'channel/findChannel',
      getChannelComments: 'channel/getChannelComments',
      toggleBookmark: 'channel/toggleBookmark',
      getBookmarkComment: 'channel/getBookmarkComment',
      findThreadComment: 'channel/findThreadComment',
      sendThreadComment: 'channel/sendThreadComment',
      toggleLikes: 'channel/toggleLikes',
      findUserProfile: 'channel/findUserProfile',
      deleteComment: 'channel/deleteComment',
      editComment: 'channel/editComment',
      editUserProfile: 'channel/editUserProfile',
    }),

    async sendComments() {
      this.commentPicture = false
      const commentData = {
        comment: this.comment,
        userId: this.$auth.user.id,
        channelId: this.channelData[this.selectChannelNum].id,
        sendImage: this.sendPictureData,
        pictureName: this.sendPictureData.name,
      }
      await this.sendComment(commentData)
      this.$nextTick(() => {
        this.commentPicture = true
      })
      this.comment = ''
      this.sendPictureData = ''
      return { commentData }
    },

    createChannel() {
      this.$router.push({
        path: '/channel/channelCreate',
        query: { genreId: this.selectGenreIndex },
      })
    },

    async getGenre() {
      const genre = await this.findGenre(this.$auth.user.id)
      if (this.genreData.length === 0 && this.$auth.user.id !== 1) {
        this.$router.push({
          path: '/genre',
        })
      }
      return genre
    },

    selectGenre(genreId, index) {
      this.selectChannelIndex = ''
      this.selectGenreIndex = genreId
      this.selectGenreNum = index
    },

    selectChannel(channelId, index) {
      this.selectChannelIndex = channelId
      this.selectChannelNum = index
    },

    async findChannels() {
      const channels = await this.findChannel(this.selectGenreIndex)
      return channels
    },

    selectCommentMouseover(commentId, index) {
      this.selectCommentIndex = commentId
      this.selectCommentNum = index
    },

    selectCommentMouseleave() {
      this.selectCommentIndex = ''
      this.selectCommentNum = ''
    },

    async getChannelComment(channelId) {
      this.showBookmark = false
      const comments = await this.getChannelComments(channelId)
      return comments
    },
    logout() {
      this.$auth.logout()
    },
    findJoinChannel() {
      this.$router.push({
        path: '/channel/channelList',
        query: { genreId: this.selectGenreIndex },
      })
    },

    toggleBookmarks() {
      const bookmarkCommentData = {
        master_commentId: this.selectCommentIndex,
        userId: this.userId,
        genreId: this.selectGenreIndex,
        channelId: this.selectChannelIndex,
      }
      this.toggleBookmark(bookmarkCommentData)
    },

    async getBookmarkComments() {
      this.selectChannelIndex = ''
      this.showBookmark = true
      const findBookmarkData = {
        genreId: this.selectGenreIndex,
        userId: this.userId,
      }
      const toggleBookmark = await this.getBookmarkComment(findBookmarkData)
      return toggleBookmark
    },

    openThread() {
      this.selectMasterCommentNum = this.selectCommentIndex
    },

    closeThread() {
      this.drawer = false
    },

    async findThreadComments() {
      const threadComment = await this.findThreadComment(
        this.selectMasterCommentNum
      )
      return threadComment
    },

    async sendThreadComments() {
      const sendThreadCommentData = {
        comment: this.threadComment,
        userId: this.userId,
        master_commentId: this.selectMasterCommentNum,
      }
      if (sendThreadCommentData.comment !== '') {
        const sendThreadComment = await this.sendThreadComment(
          sendThreadCommentData
        )
        return sendThreadComment
      }
    },

    toggleLike() {
      const likesCommentData = {
        master_commentId: this.selectCommentIndex,
        userId: this.userId,
        channelId: this.selectChannelIndex,
      }
      this.toggleLikes(likesCommentData)
    },

    selectProfileImage(file) {
      this.editProfileImagePath = file
    },

    selectSendImage(file) {
      this.sendPictureData = file
    },

    editProfileImage() {
      this.profilePicture = false
      const editData = {
        userId: this.$auth.user.id,
        username: this.editUsername,
        self_introduction: this.editSelfIntroduction,
        email: this.$auth.user.email,
        filePath: this.editProfileImagePath,
        channelId: this.selectChannelIndex,
        select: this.selected,
      }
      this.editUserProfile(editData)
      this.$nextTick(() => {
        this.profilePicture = true
      })
      this.editProfileImagePath = ''
    },

    async findUser(userId) {
      const user = await this.findUserProfile(userId)
      return user
    },

    deleteComments() {
      const deleteCommentData = {
        master_commentId: this.selectCommentIndex,
        channelId: this.selectChannelIndex,
      }
      this.deleteComment(deleteCommentData)
    },

    openEditComment() {
      this.editComments = true
      this.editCommentText =
        this.channelCommentsData[this.selectCommentNum].comment
    },

    saveEditComment() {
      const editCommentData = {
        master_commentId: this.selectCommentIndex,
        comment: this.editCommentText,
        channelId: this.selectChannelIndex,
      }
      this.editComment(editCommentData)
      this.editComments = false
    },

    registerGenre() {
      this.$router.push({
        path: '/genre',
      })
    },
  },
}
</script>

<style>
.addChannel {
  white-space: normal;
  display: block;
  width: -webkit-fill-available;
}
.comment {
  color: white;
  position: relative;
  z-index: 1;
}
.selectGenre.isSelect {
  border: black 2px solid;
  box-sizing: content-box;
}
.selectChannel.isSelect {
  background-color: red;
}
.commentBtn {
  width: max-content;
  margin-right: 10px;
  float: right;
  padding: 0;
  position: absolute;
  right: 0;
  z-index: 2;
}
.commentUsername {
  max-width: fit-content;
  margin-right: 20px;
}
.closeThread {
  float: right;
}
.v-text-field__details {
  display: none;
}
.threadComment {
  padding: 0;
}
.v-text-field.v-text-field--enclosed {
  margin: auto;
}
.v-textarea {
  width: 95%;
  margin: auto;
}
.footer {
  padding: 0;
  display: block;
}
.v-card__text {
  padding: 0;
}
.commentList {
  padding: 0;
}
.v-list-item__content {
  padding: 0;
  display: block;
}
.channelName {
  text-align: center;
  font-size: 1.3rem !important;
}
.v-list-item--dense .v-list-item__title,
.v-list-item--dense .v-list-item__subtitle,
.v-list--dense .v-list-item .v-list-item__title,
.v-list--dense .v-list-item .v-list-item__subtitle {
  line-height: inherit;
}
.closeBtn {
  float: right;
}
.overlay {
  position: absolute;
  align-items: flex-start;
}
.v-overlay__content {
  border: 2px white solid;
}
.editBtn {
  float: right;
}
.logout {
  display: contents;
}
.self_introduction {
  text-overflow: inherit;
  white-space: unset;
  width: min-content;
}
.editComment {
  min-height: auto;
}
.sendComments {
  width: 95%;
  margin: auto;
}
.sendCommentsBtn {
  float: right;
}
.v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child) {
  display: block;
  margin: auto;
}
.inputFile {
  width: 95%;
  margin: auto;
}
.commentText {
  font-size: large;
  width: 97%;
  margin-left: auto;
}
</style>
