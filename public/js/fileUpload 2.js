const imageUpload = document.getElementById('image-container');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
import cropperConfig from '../../util/cropper';

let cropper;

// DRAGGING
imageUpload.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.stopPropagation();
  imageUpload.classList.add('drag-over');
});

imageUpload.addEventListener('dragleave', () => {
  imageUpload.classList.remove('drag-over');
});

imageUpload.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();
  imageUpload.classList.remove('drag-over');
  handleFileUpload(event.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (event) => {
  handleFileUpload(event.target.files[0]);
});

const chooseFileButton = document.getElementById('choose-file-button');
chooseFileButton.addEventListener('click', chooseAnotherImage);

function chooseAnotherImage(event) {
  event.preventDefault();
  const previewImage = document.getElementsByClassName('preview-image')[0];

  fileInput.addEventListener('change', (event) => {
    handleFileUpload(event.target.files[0]);
    previewImage.remove();
  });

  fileInput.click();
}

// FILEHANDLER
function handleFileUpload(file) {
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const previewImage = document.createElement('img');
    previewImage.classList.add('preview-image');
    previewImage.src = reader.result;
    previewContainer.innerHTML = '';
    previewContainer.appendChild(previewImage);
    previewContainer.style.display = 'block';

    // const previewImage = document.querySelector('.preview-image');
    if (previewImage) {
      // Create a new image element for the cropped preview
      const croppedPreviewImage = document.createElement('img');
      croppedPreviewImage.classList.add('cropped-preview-image');
      previewContainer.appendChild(croppedPreviewImage);

      cropper = new Cropper(previewImage, cropperConfig);
    }
    if (cropper) {
      cropper.destroy(); // Destroy the previous Cropper instance if it exists
      cropper.replace(reader.result);
    }
  });
  reader.readAsDataURL(file);
}

// CROPPER
const cropButton = document.getElementById('crop-button');

cropButton.addEventListener('click', cropImage);

function cropImage() {
  if (cropper) {
    console.log('CROPPER');
    if (cropper.getCroppedCanvas) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 800,
        height: 800,
      });

      const croppedImageDataURL = croppedCanvas.toDataURL('image/jpeg');
      const previewImage = document.createElement('img');
      previewImage.classList.add('preview-image');
      previewImage.src = croppedImageDataURL;

      const croppedPreviewElement = document.querySelector('.cropped-preview');
      croppedPreviewElement.innerHTML = '';
      croppedPreviewElement.appendChild(previewImage);
    }
    cropper.destroy();
    cropper = null;
  } else {
    const previewImage = document.querySelector('.preview-image');
    if (previewImage) {
      // Create a new image element for the cropped preview
      const croppedPreviewImage = document.createElement('img');
      croppedPreviewImage.classList.add('cropped-preview-image');
      previewContainer.appendChild(croppedPreviewImage);

      cropper = new Cropper(previewImage, cropperConfig);
    }
  }
}
