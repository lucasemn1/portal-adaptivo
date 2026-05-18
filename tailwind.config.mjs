console.log("Iniciou o arquivo tailwind");

const config = {
  content: ["./index.html", "./src/**/*.{tsx}"],
  theme: {
    extend: {
      colors: {
        highlight: "#ffde59",
      },
    },
  },
};

export default config;
