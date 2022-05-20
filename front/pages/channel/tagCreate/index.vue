<template>
  <v-app>
    <v-card class="mx-auto my-auto" width="600" tile>
      <h1>Tagを追加</h1>
      <h2 class="my-2">タグ名</h2>
      <div class="addTag">
        <v-text-field
          v-model="tagName"
          :counter="20"
          :rules="nameRules"
          label="TagName"
          required
        ></v-text-field>
        <v-btn
          :disabled="!tagName"
          color="success"
          class="mr-4"
          @click="addTag(tagName)"
        >
          タグを追加
        </v-btn>
      </div>
      <ul class="tagTable">
        <li v-for="(tag, index) in tagData" :key="index" class="tagList">
          {{ index + 1 }} {{ tag }}
          <button @click="deleteTag(index)">×</button>
        </li>
      </ul>
      <v-btn @click="registerTags()">タグを登録</v-btn>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AddTagPage',
  data() {
    return {
      tagName: '',
      tagData: [],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length <= 20 && v.length >= 1) ||
          'Name must be less than 10 characters',
      ],
    }
  },
  methods: {
    addTag(tagName) {
      this.tagData.push(tagName)
    },

    async registerTags() {
      const tagList = {
        name: this.tagData,
        channelId: this.$route.query.channelId,
        genreId: this.$route.query.genreId,
      }
      if (tagList.name.length < 2) {
        alert('タグを３つ以上追加してください')
      }
      const tag = await axios
        .post('http://localhost:3000/tag', tagList)
        .then(() => {
          this.$router.push({
            path: '/channel',
          })
        })
      return tag
    },

    deleteTag(index) {
      this.tagData.splice(index, 1)
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

.tagTable {
  margin-top: 15px;
  border: white 1px solid;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: 100px;
}

.tagList {
  list-style: none;
  margin-right: 5px;
  height: 50%;
}
</style>
