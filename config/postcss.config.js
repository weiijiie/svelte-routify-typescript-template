module.exports = (ctx) => ({
    plugins: {
        'postcss-preset-env': { autoprefixer: { grid: true } }
    }
})