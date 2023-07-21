let timeoutId;

function startAutoSubmit(form) {
  // Clear previous timeout (if any)
  clearTimeout(timeoutId);

  // Set new timeout to submit the form after 1 second
  timeoutId = setTimeout(function () {
    form.submit();
  }, 500);
}

// Get all quantity input fields and buttons
const quantityInputs = document.querySelectorAll('.quantity-input');
const quantityButtons = document.querySelectorAll('.quantity-btn');

// Attach event listeners to each quantity input field
quantityInputs.forEach((input) => {
  input.addEventListener('input', function (event) {
    const form = event.target.parentElement;
    updateQuantity(form);
  });
});

// Attach event listeners to each quantity button
quantityButtons.forEach((button) => {
  button.addEventListener('click', function (event) {
    const action = event.target.dataset.action;
    const input = event.target.parentElement.querySelector('.quantity-input');
    const form = event.target.parentElement.querySelector('form');

    const quantity = parseInt(input.value);

    if (action === 'increase') {
      input.value = quantity + 1;
    } else if (action === 'decrease' && quantity > 0) {
      input.value = quantity - 1;
    }

    updateQuantity(form);
  });
});

// Function to handle quantity update
function updateQuantity(form) {
  startAutoSubmit(form);
}

// Sanitize input
const numberInput = document.getElementById('numberInput');

numberInput.addEventListener('input', function (event) {
  // Remove non-numeric characters from the input value
  const sanitizedValue = event.target.value.replace(/[^0-9]/g, '');

  // Update the input value with the sanitized value
  event.target.value = sanitizedValue;
});
