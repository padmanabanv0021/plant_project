const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const imagePreview = document.getElementById('imagePreview');
const analyzeButton = document.getElementById('analyzeButton');
const removeImageButton = document.getElementById('removeImage');
const emptyResult = document.getElementById('emptyResult');
const analyzingState = document.getElementById('analyzingState');
const scanResult = document.getElementById('scanResult');
const resultBadge = document.getElementById('resultBadge');
let selectedFile = null;
let previewUrl = null;

document.getElementById('browseButton').addEventListener('click', (event) => {
  event.stopPropagation();
  imageInput.click();
});
uploadArea.addEventListener('click', (event) => {
  if (!event.target.closest('#removeImage')) imageInput.click();
});
uploadArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    imageInput.click();
  }
});
imageInput.addEventListener('change', (event) => setImage(event.target.files[0]));
removeImageButton.addEventListener('click', (event) => {
  event.stopPropagation();
  clearImage();
});

['dragenter', 'dragover'].forEach((type) => uploadArea.addEventListener(type, (event) => {
  event.preventDefault();
  uploadArea.classList.add('dragover');
}));
['dragleave', 'drop'].forEach((type) => uploadArea.addEventListener(type, (event) => {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
}));
uploadArea.addEventListener('drop', (event) => setImage(event.dataTransfer.files[0]));

function setImage(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) return showToast('Please choose an image file.');
  if (file.size > 10 * 1024 * 1024) return showToast('That image is over 10 MB. Please choose a smaller one.');
  selectedFile = file;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  imagePreview.src = previewUrl;
  imagePreview.classList.remove('hidden');
  uploadContent.classList.add('hidden');
  removeImageButton.classList.remove('hidden');
  analyzeButton.disabled = false;
  resultBadge.textContent = 'PHOTO READY';
  resultBadge.style.color = '#5d875d';
  resultBadge.style.background = '#f2f7ef';
  resultBadge.style.borderColor = '#e2ecdf';
}

function clearImage() {
  selectedFile = null;
  imageInput.value = '';
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  imagePreview.removeAttribute('src');
  imagePreview.classList.add('hidden');
  uploadContent.classList.remove('hidden');
  removeImageButton.classList.add('hidden');
  analyzeButton.disabled = true;
  resultBadge.textContent = 'READY WHEN YOU ARE';
  resultBadge.removeAttribute('style');
}

analyzeButton.addEventListener('click', () => {
  if (!selectedFile) return;
  emptyResult.classList.add('hidden');
  scanResult.classList.add('hidden');
  analyzingState.classList.remove('hidden');
  resultBadge.textContent = 'ANALYZING';
  analyzeButton.disabled = true;
  window.setTimeout(showDemoResult, 1500);
});

function showDemoResult() {
  const samples = [
    { title: 'Possible early blight', kind: 'Potential issue detected', score: 86, description: 'The image shows spotting that can be associated with early blight. A single photo cannot confirm a diagnosis.', advice: 'Remove heavily affected leaves, keep foliage dry, and monitor nearby plants. If symptoms spread, consult a local extension service.' },
    { title: 'Leaf looks healthy', kind: 'No common issue detected', score: 94, description: 'No obvious signs of common leaf disease were detected in this image. Keep an eye on new growth as your plant develops.', advice: 'Continue your usual care routine. Water at the base of the plant and check leaves regularly for any changes.' },
    { title: 'Possible leaf spot', kind: 'Potential issue detected', score: 79, description: 'Some markings may be consistent with a leaf spot condition. Similar symptoms can have several causes.', advice: 'Avoid overhead watering, remove fallen plant debris, and take another photo in a few days to track changes.' }
  ];
  const result = samples[Math.floor(Math.random() * samples.length)];
  analyzingState.classList.add('hidden');
  scanResult.innerHTML = `<div class="result-topline"><span class="health-icon">❧</span><div><div class="health-kicker">${result.kind.toUpperCase()}</div><div class="health-title">${result.title}</div></div><div class="confidence">${result.score}%<small>image match</small></div></div><div class="confidence-bar"><span style="width:${result.score}%"></span></div><p class="result-description">${result.description}</p><div class="recommendation"><b>Suggested next step</b><p>${result.advice}</p></div><p class="result-disclaimer">This is a frontend demo with sample results. It does not analyze the image or provide a verified diagnosis.</p>`;
  scanResult.classList.remove('hidden');
  resultBadge.textContent = 'SCAN COMPLETE';
  analyzeButton.disabled = false;
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.add('hidden'), 2800);
}
