document.addEventListener('DOMContentLoaded', function () {
  new Sortable(document.getElementById('sortable-list'), {
    animation: 150,
    onUpdate: function (evt) {
      // Get the updated order of the list items
      const sortedIds = [];
      const listItems = evt.from.children;
      for (let i = 0; i < listItems.length; i++) {
        sortedIds.push(listItems[i].dataset.id);
      }

      // Send the updated order to the server using AJAX
      fetch('/admin/best-sellers/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': '<%= csrfToken %>'
        },
        body: JSON.stringify({ sortedIds })
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update order.');
          }
        })
        .catch((error) => {
          console.error(error);
          // Handle the error if needed
        });
    }
  });
});
