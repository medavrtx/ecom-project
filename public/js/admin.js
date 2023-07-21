const deleteProduct = async (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement = btn.closest('tr');

  const isConfirmed = confirm('Are you sure you want to delete this product?');
  if (!isConfirmed) {
    return;
  }

  try {
    const response = await fetch(`/admin/products/${prodId}/delete`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    });
    const data = await response.json();
    console.log(data);
    productElement.remove();
  } catch (err) {
    console.log(err);
    alert('Product deletion failed. Please try again later.');
  }
};

const deleteCategory = async (btn) => {
  const categoryId = btn.parentNode.querySelector('[name=categoryId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const categoryElement = btn.closest('article');

  const isConfirmed = confirm('Are you sure you want to delete this category?');
  if (!isConfirmed) {
    return;
  }

  try {
    const response = await fetch(`/admin/categories/${categoryId}/delete`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    });
    const data = await response.json();
    console.log(data);
    categoryElement.remove();
  } catch (err) {
    console.log(err);
    alert('Category deletion failed. Please try again later.');
  }
};

const removeFromCategory = async (btn) => {
  const categoryId = btn.parentNode.querySelector('[name=categoryId]').value;
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement = btn.closest('article');

  const isConfirmed = confirm(
    'Are you sure you want to delete this product from category?'
  );
  if (!isConfirmed) {
    return;
  }

  try {
    const response = await fetch(
      `/admin/categories/${categoryId}/${productId}/delete`,
      {
        method: 'DELETE',
        headers: {
          'csrf-token': csrf
        }
      }
    );
    const data = await response.json();
    console.log(data);
    productElement.remove();
  } catch (err) {
    console.log(err);
  }
};
