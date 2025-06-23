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

  // PDF Download Functionality
  function addPDFDownloadButton() {
    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '📄 Download PDF';
    downloadBtn.className = 'btn-primary';
    downloadBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 10px 20px;
      background: var(--primary-green);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    downloadBtn.addEventListener('click', async function() {
      downloadBtn.textContent = '📄 Generating PDF...';
      downloadBtn.disabled = true;
      
      try {
        // Create a new PDF document
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Set title
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Aajubaaju.in - Film Production Proposal', 20, 30);
        
        // Add company logos
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Presented by Sreedrisya Media', 20, 45);
        pdf.text('vaitahavya@sreedrisyamedia.com | +91-63096-97306', 20, 55);
        
        let yPosition = 80;
        
        // Add content from each slide
        slides.forEach((slide, index) => {
          const slideTitle = slide.querySelector('.slide-header');
          const slideContent = slide.querySelector('.slide-content');
          
          if (slideTitle && slideContent) {
            // Add slide title
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            const title = slideTitle.textContent.replace(/[^\w\s]/g, '').trim();
            pdf.text(`${index + 1}. ${title}`, 20, yPosition);
            yPosition += 10;
            
            // Add slide content (simplified)
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const content = slideContent.textContent.replace(/[^\w\s]/g, ' ').trim();
            const words = content.split(' ');
            let line = '';
            
            for (let word of words) {
              const testLine = line + word + ' ';
              if (pdf.getTextWidth(testLine) > 170) {
                pdf.text(line, 20, yPosition);
                yPosition += 5;
                line = word + ' ';
              } else {
                line = testLine;
              }
            }
            if (line) {
              pdf.text(line, 20, yPosition);
              yPosition += 5;
            }
            
            yPosition += 10;
            
            // Add new page if needed
            if (yPosition > 250) {
              pdf.addPage();
              yPosition = 20;
            }
          }
        });
        
        // Save the PDF
        pdf.save('Aajubaaju-Film-Proposal.pdf');
        downloadBtn.textContent = '✅ PDF Downloaded!';
        
        setTimeout(() => {
          downloadBtn.textContent = '📄 Download PDF';
          downloadBtn.disabled = false;
        }, 2000);
        
      } catch (error) {
        console.error('PDF generation failed:', error);
        downloadBtn.textContent = '❌ PDF Failed';
        downloadBtn.style.background = '#ff4444';
        
        setTimeout(() => {
          downloadBtn.textContent = '📄 Download PDF';
          downloadBtn.disabled = false;
          downloadBtn.style.background = 'var(--primary-green)';
        }, 2000);
      }
    });
    
    document.body.appendChild(downloadBtn);
  }
  
  // Add PDF download button after a short delay
  setTimeout(addPDFDownloadButton, 1000);
});
