function formatPriceInput(input) {
  // Remove non-numeric and non-decimal characters
  input.value = input.value.replace(/[^0-9.]/g, '');

  // Restrict input to a maximum of six digits
  if (input.value.length > 9) {
    input.value = input.value.slice(0, 9);
  }

  // Format input with two decimal places
  const parts = input.value.split('.');
  if (parts.length > 1) {
    const decimal = parts[1].slice(0, 2);
    input.value = `${parts[0]}.${decimal}`;
  }
}
