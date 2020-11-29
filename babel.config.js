
const plugins = [
  ['import', {
    libraryName: 'vant',
    libraryDirectory: 'es',
    style: true
  }, 'vant']
]

if (process.env.ENV === 'prd') {
  plugins.push('transform-remove-console') // 生产去除console
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: plugins
}
