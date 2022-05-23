module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#282c34",
        "black": "#282c34",
        "white": "#dcdfe4",
        "red": "#e06c75",
        "green": "#98c379",
        "lightBlue": "#56b6c2",
        "darkBlue": "#61afef",
        "orange": "#e5c07b",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}
