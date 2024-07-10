import React from 'react'
import Slider from 'react-slick'
import { Box, Container, Grid } from '@mui/material'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL

export const Carousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000 // Adjust this value to set the autoscroll speed (in milliseconds)
  }

  return (
    <Slider {...settings}>
      {images.length > 0 &&
        images.map((image, index) => (
          <Grid key={index} className='flex slick-slide  items-center justify-center h-96 w-full'>
            <Grid className='slick-image-container w-full h-full  flex justify-center'>
              <img
                // height={384}
                // width={340}
                loading='eager'
                src={`${baseUrl}/${image}`}
                alt={`Slide ${index}`}
                className='flex justify-center w-full h-full  object-cover object-center '
              />
            </Grid>
          </Grid>
        ))}
    </Slider>
  )
}
