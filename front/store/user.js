import { io } from 'socket.io-client'

const socket = io('http://localhost:3000/user')


export const state = () => ({
  users: [],
})

export const getters = {
  getUser: state => {
    return state.users
  },

}

export const mutations = {
  setUser(state, user) {
    state.users = user
  },

}


export const actions = {
  async postUser({ commit }, userData) {
    if (userData.password === userData.repassword) {
      await this.$axios.$post('http://localhost:3000/user', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })
    } else {
      alert('パスワードが異なります')
    }
  },

  async certificationUser({ commit }, userData) {
    await this.$axios.$post('http://localhost:3000/user/certification', {
      userId: userData.userId,
      certification: userData.certification
    })
  },


  findCertificationUser({ commit }, userId) {
    socket.emit('findCertificationUser', userId)
    socket.on('userData', data => {
      commit('setUser', data.users[0])
    })
  },

}

