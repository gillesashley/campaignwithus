// Third-party Components
import { useKeenSlider } from 'keen-slider/react'
const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL

export const SwiperAutoSwitch = ({ images }) => {
  // Hooks
  const [ref] = useKeenSlider(
    {
      loop: true
    },
    [
      slider => {
        let mouseOver = false
        let timeout
        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }
        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <div ref={ref} className='keen-slider'>
      {images.length > 0 &&
        images.map((image, index) => (
          <div key={index} className='keen-slider__slide'>
            <img src={`${baseUrl}/${image}`} alt='image' />
          </div>
        ))}
    </div>
  )
}
