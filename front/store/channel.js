import { io } from 'socket.io-client'

const socket = io('http://localhost:3000/chat')

export const state = () => ({
  comment: '',
  comments: [],
  channelComments: [],
  genreData: [],
  channelData: [],
  participationChannelData: [],
  nonParticipationData: [],
  joinChannelData: [],
  participationUserData: [],
  threadComment: [],
  userLikes: [],
  userProfile: [],
  topName: '',
  bookmarkComments: [],
  registerGenreData: []
})

export const getters = {
  getComment: state => {
    return state.comment
  },
  getChannelComments: state => {
    return state.channelComments
  },
  getGenreData: state => {
    return state.genreData
  },
  getChannelData: state => {
    return state.channelData
  },
  getJoinedChannelData: state => {
    return state.participationChannelData
  },
  getNonParticipationData: state => {
    return state.nonParticipationData
  },
  getParticipationUserData: state => {
    return state.participationUserData
  },
  getThreadComment: state => {
    return state.threadComment
  },
  getUserLikes: state => {
    return state.userLikes
  },
  getUserProfile: state => {
    return state.userProfile
  },
  getTopName: state => {
    return state.topName
  },
  getBookmarkComments: state => {
    return state.bookmarkComments
  },
  getRegisterGenreData: state => {
    return state.registerGenreData
  }
}

export const mutations = {
  setComment(state, comment) {
    state.comment = comment
  },
  setChannelComments(state, comments) {
    state.channelComments = comments
  },
  setGenreData(state, genreData) {
    state.genreData = genreData
  },
  setChannelData(state, channelData) {
    state.channelData = channelData
  },
  setParticipationChannelData(state, participationChannelData) {
    state.participationChannelData = participationChannelData
  },
  setNonParticipationData(state, nonParticipationData) {
    state.nonParticipationData = nonParticipationData
  },
  setParticipationUserData(state, participationUserData) {
    state.participationUserData = participationUserData
  },
  setThreadComment(state, threadCommentData) {
    state.threadComment = threadCommentData
  },
  setUserLikes(state, userLikesData) {
    state.userLikes = userLikesData
  },
  setUserProfile(state, userProfile) {
    state.userProfile = userProfile
  },
  setTopName(state, topName) {
    state.topName = topName
  },
  setBookmarkComments(state, bookmarkComments) {
    state.bookmarkComments = bookmarkComments
  },
  setRegisterGenreData(state, registerGenreData) {
    state.registerGenreData = registerGenreData
  },
}

export const actions = {
  sendComment({ commit }, comment) {
    socket.emit('sendComment', comment)
    socket.on('post_message', data => {
      socket.emit('request_channel_comments', comment.channelId)
    })
  },

  async getChannelComments({ commit }, channelId) {
    socket.emit('request_channel_comments', channelId)
    await socket.on('channel_comments', (data) => {
      commit('setChannelComments', data.comments)
    })
  },

  async findGenre({ commit }, userId) {
    await socket.emit('findGenre', userId)
    await socket.on('genreData', data => {
      commit('setGenreData', data)
      return data
    })
  },

  findChannel({ commit }, genreId) {
    socket.emit('findChannel', genreId)
    socket.on('channelData', data => {
      commit('setChannelData', data.channels)
    })
  },

  joinChannel({ dispatch, commit }, joinChannelData) {
    socket.emit('joinChannel', joinChannelData)
    socket.on('joinChannelData', data => {
      dispatch('findChannel', joinChannelData.genreId)
    })
  },

  exitChannel({ dispatch, commit }, exitChannelData) {
    socket.emit('exitChannel', exitChannelData.channelId)
    socket.on('exitChannelData', data => {
      dispatch('findChannel', exitChannelData.genreId)

    })
  },

  findParticipationUser({ commit }, channelId) {
    socket.emit('findParticipationUser', channelId)
    socket.on('participationUserData', data => {
      commit('setParticipationUserData', data)
    })
  },

  bookmarkComments({ commit }, bookmarkData) {
    const bookmarkCommentData = {
      master_commentId: bookmarkData.master_commentId,
      userId: bookmarkData.userId,
      genreId: bookmarkData.genreId
    }
    socket.emit('bookmarkComment', bookmarkCommentData)
    socket.on('commentData', data => {
      socket.emit('request_channel_comments', bookmarkData.channelId)
    })
  },

  cancelBookmark({ commit }, bookmarkData) {
    const findBookmarkData = {
      genreId: bookmarkData.genreId,
      userId: bookmarkData.userId
    }
    socket.emit('bookmarkComment', bookmarkData)
    socket.on('commentData', data => {
      socket.emit('findBookmarkComment', findBookmarkData)
    })
  },

  getBookmarkComment({ commit }, findBookmarkData) {
    socket.emit('findBookmarkComment', findBookmarkData)
    socket.on('bookmarkCommentData', data => {
      commit('setBookmarkComments', data.bookmarks)
    })
  },

  findThreadComment({ commit }, masterCommentId) {
    socket.emit('findThreadComment', masterCommentId)
    socket.on('threadCommentData', data => {
      commit('setThreadComment', data.subComment)
    })
  },

  postThreadComment({ commit }, threadCommentData) {
    socket.emit('postThreadComment', threadCommentData)
    socket.on('postThreadCommentData', data => {
      socket.emit('findThreadComment', threadCommentData.master_commentId)
    })
  },

  likesComments({ commit }, likesData) {
    const likesCommentData = {
      master_commentId: likesData.master_commentId,
      userId: likesData.userId,
      channelId: likesData.channelId,
    }
    socket.emit('likesComment', likesCommentData)
    socket.on('likesCountData', data => {
      socket.emit('request_channel_comments', likesData.channelId)
    })
  },

  findUserLikes({ commit }, userLikesData) {
    socket.emit('findUserLikes', userLikesData)
    socket.on('userLikesData', data => {
      commit('setUserLikes', data)
    })
  },

  editUserProfile({ commit }, editUserData) {
    socket.emit('editUserProfile', editUserData)
    socket.on('editUserData', data => {
      socket.emit('findUserProfile', editUserData.userId)
      socket.emit('request_channel_comments', editUserData.channelId)
    })
  },

  async editProfileImage({ commit }, editUserData) {
    if (editUserData.filePath !== '') {
      const formData = new FormData()
      formData.append('file', editUserData.filePath)
      await this.$axios
        .post('http://localhost:3000/user/file', formData)
        .then(async (res) => {
          await this.$axios.post('http://localhost:3000/user/saveFile', {
            email: editUserData.email,
            filePath: res.data.data.path,
          })
        })
    }
  },

  findUserProfile({ commit }, userId) {
    socket.emit('findUserProfile', userId)
    socket.on('userProfile', data => {
      commit('setUserProfile', data)
      const topName = data.username.slice(0, 1)
      commit('setTopName', topName)
      return data
    })
  },

  deleteComment({ commit }, deleteCommentData) {
    socket.emit('deleteComment', deleteCommentData.master_commentId)
    socket.on('deleteCommentData', data => {
      socket.emit('request_channel_comments', deleteCommentData.channelId)
    })
  },

  editComment({ commit }, editCommentData) {
    const editComment = {
      master_commentId: editCommentData.master_commentId,
      comment: editCommentData.comment
    }
    socket.emit('editComment', editComment)
    socket.on('commentData', data => {
      socket.emit('request_channel_comments', editCommentData.channelId)
    })
  },

  async findGenreData({ commit }, id) {
    const genre = await this.$axios.$get('http://localhost:3000/genre/find', 1)
    commit('setGenreData', genre)
  },

  registerGenre({ commit }, genreData) {
    socket.emit('registerGenre', genreData)
    socket.on('registerData', data => {
      commit('setRegisterGenreData', data.usersGenres)
    })
  }

}
