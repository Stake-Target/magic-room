export const state = () => ({
  theme: 'auto',
  themes: ['auto', 'dark', 'light'],
  agoric: {
    theme: {
      light: {
        qrcode: {
          image: require('~/frontend/assets/images/agoric-qr.jpeg'),
          type: 'classy-rounded'
        },
        colors: {
          background: 'linear-gradient(to right, #ab2328 0, #871c20 100%) no-repeat',
          backgroundOther: 'rgba(165, 165, 165, 0.2)',
          content: '#fff',
          contentText: '#26272a',
          text: '#fff',
          primary: '#ab2328',
          logo: '#ffacaf',
          link: '#ab2328'
        }
      },
      dark: {
        qrcode: {
          image: require('~/frontend/assets/images/agoric-qr.jpeg'),
          type: 'classy-rounded'
        },
        colors: {
          background: 'linear-gradient(to right, #ab2328 0, #871c20 100%) no-repeat',
          backgroundOther: 'rgba(165, 165, 165, 0.2)',
          content: '#26272a',
          contentText: '#fff',
          text: '#fff',
          primary: '#ab2328',
          logo: '#26272a',
          link: '#ab2328'
        }
      }
    }
  }
})

export const getters = {
  getTheme: state => (namespace, theme) => {
    // const themeName = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light'
    const themeName = 'light'
    return state[namespace].theme[theme]
  }
}

export const actions = {
  setTheme ({ commit, state }, theme) {
    if (state.themes.includes(theme)) {
      commit('SET_THEME', theme)
    }
  }
}

export const mutations = {
  SET_THEME (state, value) {
    state.theme = value
  }
}
