var swiper= new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 80,
    grabCursor: true,
    loop: true,
    breakpoints: {
        991:{
            slidesPerView:3
        }
    }
})