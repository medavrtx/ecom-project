// Form elements
const formImageArea = document.getElementById('form-image-area');
const formPreviewContainer = document.getElementById('form-preview-container');
const formDeleteButton = document.getElementById('form-delete-button');
const formEditButton = document.getElementById('form-edit-button');

// Modal elements
const modal = document.getElementById('modal');
const modalImageUpload = document.getElementById('modal-image-upload');
const modalFileInput = document.getElementById('modal-file-input');
const modalPreviewContainer = document.getElementById(
  'modal-preview-container'
);
const modalCancelButton = document.getElementById('modal-cancel-button');
const modalSaveButton = document.getElementById('modal-save-button');
const modalCloseButton = document.getElementById('modal-close-button');

// Cropper Configuration
const cropperConfig = {
  aspectRatio: 1,
  viewMode: 2, // Show the entire image within the cropping area
  autoCropArea: 1, // Automatically crop the largest square within the image

  // Enable crop guidelines/gridlines
  guides: true,
  dragMode: 'move', // Enable moving the crop box

  // Enable zooming and panning
  zoomable: true,
  movable: true,

  // Center the image within the cropping area initially
  center: true,

  // Enable image rotation
  rotatable: true,

  // Show a preview of the cropped image
  preview: '.cropped-preview-image',

  // Set constraints on the cropping area size
  minCropBoxWidth: 200,
  minCropBoxHeight: 200,
  maxCropBoxWidth: 800,
  maxCropBoxHeight: 800,

  // Disable zooming out beyond the original image size
  checkCrossOrigin: false,
  checkOrientation: false,

  background: false,
};

// Function to open the modal
formImageArea.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Function to close the modal
const closeModal = () => {
  modal.style.display = 'none';
};

// Close the modal when clicking on the close button
modalCloseButton.addEventListener('click', closeModal);

// Close the modal when clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Function to handle cancel button click
modalCancelButton.addEventListener('click', () => {
  closeModal();
});

// Allow drag and drop to image area

modalImageUpload.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.stopPropagation();
  modalImageUpload.classList.add('drag-over');
});

modalImageUpload.addEventListener('dragleave', () => {
  modalImageUpload.classList.remove('drag-over');
});

modalImageUpload.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();
  modalImageUpload.classList.remove('drag-over');
  handleFileUpload(event.dataTransfer.files[0]);
});

modalFileInput.addEventListener('change', (event) => {
  console.log(event.target.files[0]);
  handleFileUpload(event.target.files[0]);
});

let cropper;
let croppedImageDataURL;

// Handle file upload
function handleFileUpload(file) {
  if (cropper) {
    cropper.destroy(); // Destroy the previous Cropper instance if it exists
  }

  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const modalPreviewImage = document.createElement('img');
      modalPreviewImage.classList.add('preview-image');
      modalPreviewImage.id = 'modal-preview-image';
      modalPreviewImage.src = reader.result;
      modalPreviewContainer.appendChild(modalPreviewImage);
      modalPreviewContainer.style.display = 'block';

      // Initialize Cropper.js with the previewImage element
      cropper = new Cropper(modalPreviewImage, cropperConfig);
    });

    reader.readAsDataURL(file);
  }
}

// CROP TO FORM
function cropImage() {
  if (cropper) {
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 800,
      height: 800,
    });
    const formPreviewImage = document.getElementById('form-preview-image');
    croppedImageDataURL = croppedCanvas.toDataURL('image/jpeg');

    if (formPreviewImage) {
      formPreviewImage.src = croppedImageDataURL;
    } else {
      const formPreviewImage = document.createElement('img');
      formPreviewImage.classList.add('preview-image');
      formPreviewImage.id = 'form-preview-image';
      formPreviewImage.src = croppedImageDataURL;

      formPreviewContainer.appendChild(formPreviewImage);
      formPreviewContainer.style.display = 'block';
    }
  }
}

// Function to handle save button click
modalSaveButton.addEventListener('click', () => {
  cropImage();
  const blob = dataURLToBlob(croppedImageDataURL);
  const file = new File([blob], 'product.jpg', { type: 'image/jpeg' });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  modalFileInput.files = dataTransfer.files;
  closeModal();
});

// Delete form form preview image
formDeleteButton.addEventListener('click', () => {
  if (cropper) {
    cropper.destroy(); // Destroy the previous Cropper instance if it exists
  }
  const formPreviewImage = document.getElementById('form-preview-image');
  formPreviewContainer.removeChild(formPreviewImage);
  formPreviewContainer.classList.remove('d-block');
  formPreviewContainer.style.display = 'none';

  const modalPreviewImage = document.getElementById('modal-preview-image');
  modalPreviewContainer.removeChild(modalPreviewImage);
  modalPreviewContainer.style.display = 'none';
});

// Edit the preview image
formEditButton.addEventListener('click', () => {
  modal.style.display = 'block';
  const modalPreviewImage = document.getElementById('modal-preview-image');

  if (!modalPreviewImage) {
    const modalPreviewImage = document.createElement('img');
    modalPreviewImage.classList.add('preview-image');
    modalPreviewImage.id = 'modal-preview-image';
    modalPreviewImage.src = modalFileInput.dataset.access;
    modalPreviewContainer.appendChild(modalPreviewImage);
    modalPreviewContainer.style.display = 'block';

    // Initialize Cropper.js with the previewImage element
    cropper = new Cropper(modalPreviewImage, cropperConfig);
  }
});

// Function to convert data URL to Blob
function dataURLToBlob(dataURL) {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
