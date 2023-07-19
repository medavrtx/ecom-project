const imageUpload = document.getElementById('image-upload');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');

const cropButton = document.getElementById('crop-button');
const chooseAnotherButton = document.getElementById('choose-another-button');

let cropper;

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

cropButton.addEventListener('click', cropImage);
chooseAnotherButton.addEventListener('click', chooseAnotherImage);

function handleFileUpload(file) {
  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const previewImage = document.createElement('img');
      previewImage.classList.add('preview-image');
      previewImage.src = reader.result;
      previewContainer.innerHTML = '';
      previewContainer.appendChild(previewImage);
      previewContainer.style.display = 'block';

      if (cropper) {
        // cropper.destroy(); // Destroy the previous Cropper instance if it exists
        cropper.replace(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }
}

function cropImage(event) {
  event.preventDefault();

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
      previewContainer.innerHTML = '';
      previewContainer.appendChild(previewImage);

      //   const croppedPreviewElement = document.querySelector('.cropped-preview');
      //   croppedPreviewElement.innerHTML = '';
      //   croppedPreviewElement.appendChild(previewImage.cloneNode(true));
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

      cropper = new Cropper(previewImage, {
        aspectRatio: 1,
        viewMode: 2, // Show the entire image within the cropping area
        autoCropArea: 1, // Automatically crop the largest square within the image

        // Enable crop guidelines/gridlines
        guides: true,

        // Enable zooming and panning
        zoomable: true,
        movable: true,

        // Center the image within the cropping area initially
        center: true,

        // Enable image rotation
        rotatable: true,

        // Show a preview of the cropped image
        preview: '.preview-image',

        // Set constraints on the cropping area size
        minCropBoxWidth: 200,
        minCropBoxHeight: 200,
        maxCropBoxWidth: 800,
        maxCropBoxHeight: 800,

        // Disable zooming out beyond the original image size
        checkCrossOrigin: false,
        checkOrientation: false,
      });
    }
  }
}

function chooseAnotherImage(event) {
  event.preventDefault();
  const previewImage = document.getElementsByClassName('preview-image')[0];

  fileInput.addEventListener('change', (event) => {
    handleFileUpload(event.target.files[0]);
    previewImage.remove();
  });

  fileInput.click();
}
