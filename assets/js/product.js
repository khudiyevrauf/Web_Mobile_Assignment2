async function fetchProduct(id) {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await response.json();
    return product;
  }
  
  const searchForm = document.querySelector(".search-form");
  
  const searchInput = document.querySelector(".search-form input");
  
  document.addEventListener("DOMContentLoaded", () => {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      searchProducts(searchInput.value);
      searchInput.value = "";
    });
  
    function searchProducts(q) {
      localStorage.setItem("query", q);
      window.location.replace("/index.html");
    }
  
    const id = localStorage.getItem("pId");
    localStorage.removeItem("pId");
    const showcaseContainer = document.querySelector(".img-showcase");
    const imagesContainer = document.querySelector(".img-select");
    fetchProduct(id).then((product) => {
      document.querySelector(".product-title").innerHTML = product.title;
      document.querySelector(".product-detail p").innerHTML = product.description;
      document.querySelector(
        ".last-price span"
      ).innerHTML = `$${product.price.toFixed(2)}`;
      document.querySelector(".new-price span").innerHTML = `$${(
        product.price -
        product.price * (product.discountPercentage / 100)
      ).toFixed(2)} (${product.discountPercentage}%)`;
      document.querySelector(".category span").innerHTML =
        product.category[0].toUpperCase() + product.category.slice(1);
      document.querySelector(".instock span").innerHTML = product.stock;
      product.images.forEach((image, i) => {
        showcaseContainer.innerHTML += `<img src="${image}" alt="${product.title}" />`;
        imagesContainer.innerHTML += `
        <div class="img-item">
        <a href="#" data-id="${i + 1}">
          <img
            src="${image}"
            alt="${product.title}"
          />
        </a>
      </div>
          `;
      });
  
      const imgs = document.querySelectorAll(".img-select a");
      const imgBtns = [...imgs];
      let imgId = 1;
  
      imgBtns.forEach((imgItem) => {
        imgItem.addEventListener("click", (event) => {
          event.preventDefault();
          imgId = imgItem.dataset.id;
          slideImage();
        });
      });
  
      function slideImage() {
        const displayWidth = document.querySelector(
          ".img-showcase img:first-child"
        ).clientWidth;
  
        document.querySelector(".img-showcase").style.transform = `translateX(${
          -(imgId - 1) * displayWidth
        }px)`;
      }
  
      window.addEventListener("resize", slideImage);
    });
  });
  