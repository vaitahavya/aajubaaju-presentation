document.addEventListener("DOMContentLoaded", function() {
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const currentSlideElem = document.getElementById('current-slide');
const totalSlidesElem = document.getElementById('total-slides');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const progressFill = document.querySelector('.progress-fill');

let currentSlide = 0;

// Debug logging
console.log('Total slides found:', totalSlides);
console.log('Slides:', Array.from(slides).map(slide => slide.id));

totalSlidesElem.textContent = totalSlides;

function showSlide(index) {
    console.log('Showing slide:', index + 1, 'of', totalSlides);
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    currentSlideElem.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / totalSlides) * 100}%`;
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

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

showSlide(currentSlide);

// Agreement Digital Signature & Form Logic
const clientSignatureCanvas = document.getElementById('clientSignature');
const ctx = clientSignatureCanvas ? clientSignatureCanvas.getContext('2d') : null;
let drawing = false;
let lastX = 0;
let lastY = 0;
let hasDrawnSignature = false; // Track if user has drawn on canvas

function startDraw(e) {
  drawing = true;
  [lastX, lastY] = getCanvasPos(e);
}
function draw(e) {
  if (!drawing) return;
  const [x, y] = getCanvasPos(e);
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#222';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
  hasDrawnSignature = true; // Mark that user has drawn
}
function stopDraw() {
  drawing = false;
}
function getCanvasPos(e) {
  const rect = clientSignatureCanvas.getBoundingClientRect();
  if (e.touches) {
    return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
  } else {
    return [e.offsetX, e.offsetY];
  }
}
function clearSignature() {
  ctx.clearRect(0, 0, clientSignatureCanvas.width, clientSignatureCanvas.height);
  hasDrawnSignature = false; // Reset drawn signature flag
  clientSignatureImageDataUrl = null; // Reset uploaded signature
  // Show canvas again if it was hidden
  clientSignatureCanvas.style.display = 'block';
  const previewImg = document.getElementById('clientSignaturePreview');
  if (previewImg) {
    previewImg.remove();
  }
}

// Check if signature exists (either drawn or uploaded)
function hasSignature() {
  return hasDrawnSignature || clientSignatureImageDataUrl !== null;
}

if (clientSignatureCanvas) {
  clientSignatureCanvas.addEventListener('mousedown', startDraw);
  clientSignatureCanvas.addEventListener('mousemove', draw);
  clientSignatureCanvas.addEventListener('mouseup', stopDraw);
  clientSignatureCanvas.addEventListener('mouseout', stopDraw);
  clientSignatureCanvas.addEventListener('touchstart', startDraw);
  clientSignatureCanvas.addEventListener('touchmove', draw);
  clientSignatureCanvas.addEventListener('touchend', stopDraw);
  // Add clear button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Signature';
  clearBtn.type = 'button';
  clearBtn.className = 'btn-secondary';
  clientSignatureCanvas.parentNode.appendChild(clearBtn);
  clearBtn.onclick = clearSignature;
}

// Agreement Form Submission
const submitAgreementBtn = document.getElementById('submitAgreementBtn');
const downloadAgreementBtn = document.getElementById('downloadAgreementBtn');
const agreementStatus = document.getElementById('agreementStatus');

// Supabase integration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://egrklpnmgvhvnyhaevvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncmtscG5tZ3Zodm55aGFldnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODYyMzksImV4cCI6MjA2NjI2MjIzOX0.vs6GalWVoyaArKbO_vu64SG6di4t5S0Tidl3f0M-xPY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase Edge Function integration for email sending
async function sendAgreementEmail({ clientName, clientAddress, clientEmail, clientPhone, clientRep, clientSignDate, paymentProofUrl, signatureDataUrl }) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-agreement-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        client_name: clientName,
        client_address: clientAddress,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_rep: clientRep,
        client_sign_date: clientSignDate,
        payment_proof_url: paymentProofUrl,
        signature_data_url: signatureDataUrl,
        to_email: 'vaitahavya@sreedrisyamedia.com',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    agreementStatus.textContent = 'Agreement submitted and email sent successfully!';
    agreementStatus.style.color = 'var(--primary-green)';
  } catch (err) {
    console.error('Failed to send email:', err);
    agreementStatus.textContent = 'Agreement saved, but failed to send email. Please contact support.';
    agreementStatus.style.color = 'orange';
  }
}

if (submitAgreementBtn) {
  submitAgreementBtn.onclick = async function() {
    // Collect form data
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientRep = document.getElementById('clientRep').value;
    const clientSignDate = document.getElementById('clientSignDate').value;
    const paymentProof = document.getElementById('paymentProof').files[0];
    // Signature image
    let signatureDataUrl;
    if (clientSignatureImageDataUrl) {
      signatureDataUrl = clientSignatureImageDataUrl;
    } else if (hasDrawnSignature) {
      signatureDataUrl = clientSignatureCanvas.toDataURL();
    } else {
      signatureDataUrl = null;
    }
    // Enhanced validation
    if (!clientName || !clientAddress || !clientEmail || !clientPhone || !clientRep || !clientSignDate) {
      agreementStatus.textContent = 'Please fill all required fields.';
      agreementStatus.style.color = 'red';
      return;
    }
    
    if (!hasSignature()) {
      agreementStatus.textContent = 'Please provide a signature (draw or upload).';
      agreementStatus.style.color = 'red';
      return;
    }
    
    agreementStatus.textContent = 'Submitting...';
    agreementStatus.style.color = 'var(--primary-green)';
    // Upload payment proof to Supabase Storage
    const paymentFileName = `payment_${Date.now()}_${paymentProof.name}`;
    let paymentProofUrl = '';
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage.from('agreements').upload(paymentFileName, paymentProof, { upsert: true });
      if (uploadError) throw uploadError;
      paymentProofUrl = `${supabaseUrl}/storage/v1/object/public/agreements/${paymentFileName}`;
    } catch (err) {
      agreementStatus.textContent = 'Failed to upload payment proof.';
      agreementStatus.style.color = 'red';
      return;
    }
    // Insert agreement record
    const { error: insertError } = await supabase.from('agreements').insert([
      {
        client_name: clientName,
        client_address: clientAddress,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_rep: clientRep,
        client_sign_date: clientSignDate,
        signature_data_url: signatureDataUrl,
        payment_proof_url: paymentProofUrl,
        submitted_at: new Date().toISOString()
      }
    ]);
    if (insertError) {
      agreementStatus.textContent = 'Failed to save agreement. Please try again.';
      agreementStatus.style.color = 'red';
      return;
    }
    await sendAgreementEmail({
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      clientRep,
      clientSignDate,
      paymentProofUrl,
      signatureDataUrl
    });
    downloadAgreementBtn.disabled = false;
  };
}
// Placeholder for PDF download
if (downloadAgreementBtn) {
  downloadAgreementBtn.onclick = async function() {
    const agreementNode = document.querySelector('.agreement-scrollbox');
    if (!agreementNode) return;
    agreementStatus.textContent = 'Generating PDF...';
    agreementStatus.style.color = 'var(--primary-green)';
    // Use html2canvas to render the agreement content
    const canvas = await html2canvas(agreementNode, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Fit image to page
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('Aajubaaju-Agreement.pdf');
    agreementStatus.textContent = 'PDF downloaded!';
  };
}

const clientSignatureUpload = document.getElementById('clientSignatureUpload');
let clientSignatureImageDataUrl = null;

if (clientSignatureUpload) {
  clientSignatureUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        clientSignatureImageDataUrl = evt.target.result;
        hasDrawnSignature = false; // Reset drawn signature since we're using uploaded one
        // Show preview in place of canvas
        let img = document.getElementById('clientSignaturePreview');
        if (!img) {
          img = document.createElement('img');
          img.id = 'clientSignaturePreview';
          img.className = 'signature-img';
          clientSignatureCanvas.style.display = 'none';
          clientSignatureCanvas.parentNode.insertBefore(img, clientSignatureCanvas);
        }
        img.src = clientSignatureImageDataUrl;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Update provider date to match client date
const clientSignDateInput = document.getElementById('clientSignDate');
const providerDateDisplay = document.getElementById('providerDateDisplay');
if (clientSignDateInput && providerDateDisplay) {
  clientSignDateInput.addEventListener('change', function() {
    providerDateDisplay.textContent = this.value ? this.value.split('-').reverse().join(' / ') : '___ / ___ / 2025';
  });
}

// Update client name in signature area
const clientNameInput = document.getElementById('clientName');
const clientSignName = document.getElementById('clientSignName');
if (clientNameInput && clientSignName) {
  clientNameInput.addEventListener('input', function() {
    clientSignName.textContent = this.value || '[Client Name]';
  });
} });
