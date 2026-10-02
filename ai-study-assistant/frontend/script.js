const API_BASE = 'http://127.0.0.1:5000';
const modal = document.getElementById('uploadModal');
const fileInput = document.getElementById('pdfFile');
const output = document.getElementById('output');

document.getElementById('uploadButton').addEventListener('click', () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
});

document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }

document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => document.querySelector('.sidebar').classList.remove('open')));

document.getElementById('scanButton').addEventListener('click', uploadPDF);
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) output.textContent = `${file.name} selected. Ready to scan.`;
});

async function uploadPDF() {
  const file = fileInput.files[0];
  if (!file) { output.textContent = 'Choose a prescription file first.'; return; }
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) { output.textContent = 'Please upload a PDF, JPG, or PNG file.'; return; }
  const formData = new FormData();
  formData.append('file', file);
  output.textContent = 'Scanning prescription…';
  try {
    const response = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    const data = await response.json();
    output.textContent = data.error ? data.error : `Scan complete. ${data.characters || 'Prescription details'} characters extracted for review.`;
  } catch (error) {
    output.textContent = 'Scan preview ready. Connect the MedScan service to process this file.';
  }
}

document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
