module.exports = {
    content: [
        "./index.html",
        "./mantenimientos.html",
        "./automatismos.html",
        "./cerrajeria.html"
    ],
    css: ["./style.css"],
    output: "./style.min.css",
    safelist: {
        standard: [/^swiper-/, /^aos-/]
    }
}; 