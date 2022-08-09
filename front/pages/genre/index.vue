<template>
  <v-app>
    <div class="container">
      <div class="header">
        <h2 class="title">好きなジャンルを選択</h2>
        <input
          type="button"
          value="ジャンルを追加"
          class="add_genre"
          @click="registerGenre()"
        />
      </div>
      <div class="genreList">
        <v-sheet
          v-for="(genre, index) in genreData"
          :key="index"
          v-model="checkbox"
          class="genre"
        >
          <v-switch
            v-model="selected"
            top
            class="my-0"
            :value="genre"
            @change="genreSelect = !genreSelect"
          ></v-switch>
          {{ genre.name }}
        </v-sheet>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'GenrePage',
  data() {
    return {
      genreData: [],
      checkbox: false,
      genreSelect: false,
      selected: [],
    }
  },
  computed: {
    ...mapGetters({
      registerGenreData: 'channel/getRegisterGenreData',
    }),
  },
  mounted() {
    axios
      .get(`http://${process.env.HOST}:${process.env.API_PORT}/genre`)
      .then((res) => {
        this.genreData = res.data.data.genres
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    ...mapActions({
      registerGenres: 'channel/registerGenre',
    }),
    async registerGenre() {
      const registerData = {
        userId: this.$auth.user.id,
        genre: this.selected,
      }
      await this.registerGenres(registerData)
      if (this.registerGenreData.length !== 0) {
        this.$router.push({
          path: '/channel',
        })
      }
    },
  },
}
</script>

<style scoped>
.container {
  flex-wrap: wrap;
  width: 1000px;
  text-align: center;
}

.header {
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}

.title {
  margin-right: 20px;
}

.add_genre {
  border: 2px white solid;
}

.genre {
  width: 250px;
  height: 150px;
  border: 1px white solid;
  text-align: center;
  line-height: 50px;
  margin: 10px;
}

.genreList {
  display: inline-flex;
  flex-wrap: inherit;
}
</style>
