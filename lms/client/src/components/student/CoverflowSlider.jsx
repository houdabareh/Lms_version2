import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // optional but safe

// import required modules
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

const CoverflowSlider = ({ images }) => {
  const defaultImages = [
    '/assets/image1.jpg',
    '/assets/image2.jpg',
    '/assets/image3.jpg',
    '/assets/image4.jpg',
    '/assets/image5.jpg',
    '/assets/image6.jpg',
  ];

  const sliderImages = images && images.length > 0 ? images : defaultImages;

  return (
    <div className="w-full flex justify-center items-center">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper w-full h-80 md:h-96 max-w-md lg:max-w-lg"
      >
        {sliderImages.map((image, index) => (
          <SwiperSlide
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg flex justify-center items-center text-center text-xl font-semibold"
          >
            <img src={image} alt={`Slide ${index + 1}`} className="block w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CoverflowSlider;
