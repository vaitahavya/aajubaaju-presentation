// Simple Presentation Navigation

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const currentSlideElem = document.getElementById('current-slide');
  const totalSlidesElem = document.getElementById('total-slides');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const progressFill = document.querySelector('.progress-fill');

  let currentSlide = 0;

  console.log('Total slides found:', totalSlides);
  console.log('Slides:', Array.from(slides).map(slide => slide.id));

  totalSlidesElem.textContent = totalSlides;

  function showSlide(index) {
    console.log('Showing slide:', index + 1, 'of', totalSlides);
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlideElem.textContent = index + 1;
    if (progressFill) {
      progressFill.style.width = `${((index + 1) / totalSlides) * 100}%`;
    }
  }

  function nextSlide() {
    console.log('Next slide requested. Current:', currentSlide, 'Total:', totalSlides);
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      showSlide(currentSlide);
    } else {
      console.log('Already at last slide');
    }
  }

  function prevSlide() {
    console.log('Prev slide requested. Current:', currentSlide);
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    } else {
      console.log('Already at first slide');
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  showSlide(currentSlide);
});
