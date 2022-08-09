import { io } from 'socket.io-client'

const socket = io(`http://${process.env.HOST}:${process.env.API_PORT}/chat`)

export const state = () => ({
  comment: '',
  comments: [],
  channelComments: [],
  genreData: [],
  channelData: [],
  participationChannelData: [],
  nonParticipationData: [],
  joinChannelData: [],
  threadComment: [],
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
  getThreadComment: state => {
    return state.threadComment
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
  setThreadComment(state, threadCommentData) {
    state.threadComment = threadCommentData
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
    socket.on('sendCommentData', commentData => {
      socket.emit('getChannelComments', comment.channelId)
    })
  },

  async getChannelComments({ commit }, channelId) {
    socket.emit('getChannelComments', channelId)
    await socket.on('channelCommentsData', (comments) => {
      commit('setChannelComments', comments)
    })
  },

  async findGenre({ commit }, userId) {
    await socket.emit('findGenre', userId)
    await socket.on('genreData', genreData => {
      commit('setGenreData', genreData)
      return genreData
    })
  },

  findChannel({ commit }, genreId) {
    socket.emit('findChannel', genreId)
    socket.on('channelData', channelData => {
      commit('setChannelData', channelData)
    })
  },

  joinChannel({ dispatch, commit }, joinChannelData) {
    socket.emit('joinChannel', joinChannelData)
    socket.on('joinChannelData', joinChannel => {
      dispatch('findChannel', joinChannelData.genreId)
    })
  },

  exitChannel({ dispatch, commit }, exitChannelData) {
    socket.emit('exitChannel', exitChannelData.channelId)
    socket.on('exitChannelData', exitChannel => {
      dispatch('findChannel', exitChannelData.genreId)

    })
  },

  toggleBookmark({ commit }, bookmarkData) {
    const bookmarkCommentData = {
      master_commentId: bookmarkData.master_commentId,
      userId: bookmarkData.userId,
      genreId: bookmarkData.genreId
    }
    const findBookmarkData = {
      genreId: bookmarkData.genreId,
      userId: bookmarkData.userId
    }
    socket.emit('toggleBookmark', bookmarkCommentData)
    socket.on('toggleBookmarkData', bookmarkComment => {
      socket.emit('getChannelComments', bookmarkData.channelId)
      socket.emit('findBookmarkComment', findBookmarkData)
    })
  },

  getBookmarkComment({ commit }, findBookmarkData) {
    socket.emit('findBookmarkComment', findBookmarkData)
    socket.on('bookmarkCommentData', bookmarkComment => {
      commit('setBookmarkComments', bookmarkComment)
    })
  },

  findThreadComment({ commit }, masterCommentId) {
    socket.emit('findThreadComment', masterCommentId)
    socket.on('threadCommentData', data => {
      commit('setThreadComment', data.subComment)
    })
  },

  sendThreadComment({ commit }, threadCommentData) {
    socket.emit('sendThreadComment', threadCommentData)
    socket.on('sendThreadCommentData', threadComment => {
      socket.emit('findThreadComment', threadCommentData.master_commentId)
    })
  },

  toggleLikes({ commit }, likesData) {
    const likesCommentData = {
      master_commentId: likesData.master_commentId,
      userId: likesData.userId,
      channelId: likesData.channelId,
    }
    socket.emit('toggleLike', likesCommentData)
    socket.on('toggleLikeData', toggleLike => {
      socket.emit('getChannelComments', likesData.channelId)
    })
  },

  editUserProfile({ commit }, editUserData) {
    const profileImageData = {
      userId: editUserData.userId,
      email: editUserData.email,
      username: editUserData.username,
      channelId: editUserData.channelId,
      self_introduction: editUserData.self_introduction,
      profileImagePath: editUserData.filePath,
      fileName: editUserData.filePath.name
    }
    socket.emit('editUserProfile', profileImageData)
    socket.on('registerPictureData', userData => {
      commit('setUserProfile', userData.user)
      const topName = userData.user.username.slice(0, 1)
      commit('setTopName', topName)
    })
  },

  findUserProfile({ commit }, userId) {
    socket.emit('findUserProfile', userId)
    socket.on('userProfile', user => {
      commit('setUserProfile', user)
      const topName = user.username.slice(0, 1)
      commit('setTopName', topName)
      return user
    })
  },

  deleteComment({ commit }, deleteCommentData) {
    socket.emit('deleteComment', deleteCommentData.master_commentId)
    socket.on('deleteCommentData', deleteComment => {
      socket.emit('getChannelComments', deleteCommentData.channelId)
    })
  },

  editComment({ commit }, editCommentData) {
    const editComment = {
      master_commentId: editCommentData.master_commentId,
      comment: editCommentData.comment
    }
    socket.emit('editComment', editComment)
    socket.on('editCommentData', editComment => {
      socket.emit('getChannelComments', editCommentData.channelId)
    })
  },

  registerGenre({ commit }, genreData) {
    socket.emit('registerGenre', genreData)
    socket.on('registerData', usersGenres => {
      commit('setRegisterGenreData', usersGenres)
    })
  }

}
