const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');

  fetch('/admin/edit-products/' + prodId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteCategory = (btn) => {
  const categoryId = btn.parentNode.querySelector('[name=categoryId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const categoryElement = btn.closest('article');

  fetch('/admin/edit-categories/' + categoryId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      categoryElement.parentNode.removeChild(categoryElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

const removeFromCategory = (btn) => {
  const categoryId = btn.parentNode.querySelector('[name=categoryId]').value;
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const categoryElement = btn.closest('article');

  fetch('/admin/edit-categories/' + categoryId + '/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      categoryElement.parentNode.removeChild(categoryElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
