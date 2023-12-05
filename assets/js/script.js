async function fetchProducts() {
  const response = await fetch(`https://dummyjson.com/products?limit=100`);
  const products = await response.json();
  return products;
}

async function fetchSearchedProducts(q) {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${q}&limit=100`
  );
  const products = await response.json();
  return products;
}

const categoriesContainer = document.querySelector(".checkbox-group");

const productsContainer = document.querySelector(".products");

const paginationContainer = document.querySelector(".pagination");

const searchForm = document.querySelector(".search-form");

const searchInput = document.querySelector(".search-form input");

let pByPage = 16;
let page = 1;
let productCount = 100;
let filterCategories = [];
let categoryProducts = [];
let choosenCategories = [];

document.addEventListener("DOMContentLoaded", () => {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchProducts(searchInput.value);
    searchInput.value = "";
  });

  const renderCategory = (products) => {
    filterCategories = [];

    products.forEach((product) => {
      if (!filterCategories.includes(product.category)) {
        filterCategories.push(product.category);
      }
    });

    categoriesContainer.innerHTML = "";

    filterCategories.forEach((c) => {
      categoriesContainer.innerHTML += `
                <label class="checkbox"
                      >${c[0].toUpperCase() + c.slice(1)}
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>`;
    });

    categoriesContainer.querySelectorAll("label").forEach((b) => {
      b.addEventListener("click", (e) => {
        if (e.target instanceof HTMLInputElement) {
          categoryProducts = [];
          page = 1;
          const activeCategory = e.target.parentElement.innerText;
          if (e.target.checked) {
            choosenCategories.push(activeCategory);
          } else {
            choosenCategories = choosenCategories.filter((c) => {
              return c != activeCategory;
            });
          }
          products.forEach((p) => {
            choosenCategories.forEach((c) => {
              if (p.category == c.toLowerCase()) {
                categoryProducts.push(p);
              }
            });
          });
          if (choosenCategories.length == 0) {
            render(products, 0);
          } else {
            render(categoryProducts, 0);
          }
          productCount = categoryProducts.length;
        }
      });
    });
  };

  let searchProducts = (q) => {
    fetchSearchedProducts(q).then((r) => {
      if (r.products.length == 0) {
        productsContainer.innerHTML = "<h2>We could not find any product.</h2>";
        renderPagination();
        return;
      }

      renderCategory(r.products);

      render(r.products, 0);
    });
  };

  if (localStorage.getItem("query")) {
    searchProducts(localStorage.getItem("query"));
    localStorage.removeItem("query");
  } else {
    fetchProducts().then((r) => {
      filterCategories = [];

      renderCategory(r.products);

      render(r.products, 0);
    });
  }

  const render = (products, skip) => {
    productsContainer.innerHTML = "";

    products.slice(skip, page * pByPage).forEach((product) => {
      productsContainer.innerHTML += `
      <a class="single-product" href="./product.html" id="${product.id}">
          <img
            src="${product.thumbnail}"
            alt="${product.title}"
          />
          <h3>${product.title}</h3>
          <section class="prices">
            <p class="price">${product.price.toFixed(2)}</p>
            <p class="with-discount">${(
              product.price -
              product.price * (product.discountPercentage / 100)
            ).toFixed(2)}</p>
            <p class="discount">${product.discountPercentage}%</p>
          </section>
          <p class="category">${
            product.category[0].toUpperCase() + product.category.slice(1)
          }</p>
          <p class="stock">In stock: ${product.stock}</p>
        </a>`;
    });

    productsContainer
      .querySelectorAll("a.single-product")
      .forEach((product) => {
        product.addEventListener("click", () => {
          localStorage.setItem("pId", product.id);
        });
      });

    renderPagination(products);
  };

  const renderPagination = (products) => {
    let pNums = "";
    paginationContainer.innerHTML = "";

    let pages = 0;

    if (products.length > pByPage) {
      pages = (
        products.length % pByPage == 0
          ? products.length / pByPage
          : products.length / pByPage + 1
      ).toFixed();
    }

    let pageNumbers = [];

    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
    }

    if (pages > 1) {
      for (let i = 0; i < pageNumbers.length; i++) {
        pNums += `
        <a href="" class="${pageNumbers[i] == page ? "active" : ""}">${
          pageNumbers[i]
        }</a>
        `;
      }
      paginationContainer.innerHTML = `
                  <a href="" class="prev ${
                    page > 1 ? "" : "disabled"
                  }">&laquo;</a>
                  <div class="numbers">
                  ${pNums}
                  </div>
                  <a href="" class="next ${
                    page < pages ? "" : "disabled"
                  }">&raquo;</a>
        `;

      const numberBtns = document.querySelectorAll(".pagination .numbers a");
      const previous = document.querySelector(".pagination .prev");
      const next = document.querySelector(".pagination .next");

      numberBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          page = btn.innerHTML;
          renderPagination(products);
          render(products, (page - 1) * pByPage);
        });
      });
      next.addEventListener("click", (e) => {
        e.preventDefault();
        if (page < pages) {
          page++;
          renderPagination(products);
          render(products, (page - 1) * pByPage);
        }
      });
      previous.addEventListener("click", (e) => {
        e.preventDefault();
        if (page > 1) {
          page--;
          renderPagination(products);
          render(products, (page - 1) * pByPage);
        }
      });
    }
  };
});
