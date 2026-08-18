export default {
  content: [
    './src/pages/*.html',
    './src/partials/*.html',
    './src/js/**/*.js',
  ],
  css: ['./src/css/main.css'],
  safelist: {
    standard: [
      /^swiper-/,
      /^aos-/,
      /^mobile-/,
      /^review-/,
      /^faq-/,
      'active',
      'show',
    ],
  },
}