import { boot } from 'quasar/wrappers';


const tools = {
  math: {
    truncate2dec: (num) => Math.trunc((num + Number.EPSILON) * 100) / 100,
    truncate3dec: (num) => Math.trunc((num + Number.EPSILON) * 1000) / 1000,
  }
}


export default boot(({ app }) => {
  app.config.globalProperties.$tools = tools;
})

export { tools }
