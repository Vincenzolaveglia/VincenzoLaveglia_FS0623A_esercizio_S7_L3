const booksWrapper = document.querySelector("#books-wrapper");
const shoppingCart = document.querySelector("#shopping-cart");

let outerBooks = [];
let cartList = JSON.parse(localStorage.getItem("shoppingCart"));

// Se cartList è null o non è un array, inizializzalo come un array vuoto
if (!Array.isArray(cartList)) {
  cartList = [];
}

window.onload = () => {
  addBooks();
  addCart()
};

const addBooks = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then(resp => resp.json())
    .then(books => {
      displayBooks(books);
      outerBooks = books;
    })
    .catch(err =>
      console.error(err.message)
    )

}

function displayBooks(books) {
  booksWrapper.innerHTML = "";

  books.forEach((book) => {

    const bookInCart = cartList.findIndex(cartBook => cartBook.title === book.title) !== -1

    booksWrapper.innerHTML += `
    <div class="col">
      <div class="card shadow-sm h-100 ${bookInCart ? 'selected' : ''}">
        <img src="${book.img}" class="img-fluid card-img-top" alt="${book.title
      }">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text badge rounded-pill bg-dark mb-2">${book.category}</p>
          <p class="fs-4">${book.price}€</p>
          <div>
              <button class="btn btn-info" onclick="addToCart(event, '${book.asin}')">Compra ora</button>
              <button class="btn btn-danger" onclick="rejectBook(event)">
                Scarta
              </button>
          </div>
        </div>
      </div>
    </div>
  `;
  });
}

const rejectBook = (event) => {
  event.target.closest('.col').remove()
}

const addToCart = (event, asin) => {
  console.log(asin);
  const book = outerBooks.find((book) => book.asin === asin);
  cartList.push(book);
  console.log(cartList);
  localStorage.setItem("shoppingCart", JSON.stringify(cartList))

  addCart();

  event.target.closest(".card").classList.add("selected");
}

const addCart = () => {

  shoppingCart.innerHTML = ""
  cartList.forEach((book) => {
    shoppingCart.innerHTML += `
    <div class="shopping-item">
      <div class="d-flex align-items-start gap-2">
            <img src=${book.img}  class="img-fluid" width="60" />
          <div class="flex-grow-1">
              <p class="mb-2">
                ${book.title}
              </p>
              <div class="d-flex justify-content-between">
                  <p class="fw-bold">
                    ${book.price}€
                  </p>
                  <div>
                      <div>
                        <button class="btn btn-danger" onclick="deleteBook('${book.asin}')">Elimina </button>
                      </div>
                  </div>
              </div >
          </div >
      </div >
    </div>
  `;
  });
}

function deleteBook(asin) {
  const index = cartList.findIndex((book) => book.asin === asin);

  if (index !== -1) {
    cartList.splice(index, 1);
    localStorage.setItem("shoppingCart", JSON.stringify(cartList))
  }

  addCart();
}