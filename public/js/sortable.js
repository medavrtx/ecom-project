function initializeSortableList() {
  const sortableList = document.getElementById('sortable-list');
  new Sortable(sortableList, {
    animation: 150,
    onUpdate: updateOrderOnSort
  });
}

function updateOrderOnSort(event) {
  const csrf = event.item.querySelector('[name=_csrf]').value;
  const items = event.from.children;
  for (let i = 0; i < items.length; i++) {
    const productId = items[i].getAttribute('data-id');
    const newOrder = i + 1;

    // Update the order of best sellers in the database using AJAX
    fetch(`/admin/best-sellers/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrf
      },
      body: JSON.stringify({ order: i + 1 })
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update best seller order');
        }
      })
      .then((data) => {
        const orderElement = items[i].querySelector('p');
        orderElement.textContent = newOrder;
      })
      .catch((error) => {
        console.error(error.message); // Optional: Show error message
      });
  }
}

// Call the initializeSortableList function when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeSortableList);
