// Simulación de almacenamiento de productos en localStorage
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const addProductForm = document.getElementById("add-product-form");
    const editProductForm = document.getElementById("edit-product-form");
  
    // Función para obtener productos del almacenamiento local
    function getProducts() {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      return products;
    }
  
    // Función para guardar productos en el almacenamiento local
    function saveProducts(products) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  
    // Función para mostrar los productos en la tabla
    function displayProducts() {
      const products = getProducts();
      productList.innerHTML = ""; // Limpiar lista antes de llenarla
  
      products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.price}</td>
          <td>${product.quantity}</td>
          <td>
            <button onclick="editProduct(${index})">Editar</button>
            <button onclick="deleteProduct(${index})">Eliminar</button>
          </td>
        `;
        productList.appendChild(row);
      });
    }
  
    // Función para agregar un producto
    if (addProductForm) {
      addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("product-name").value;
        const description = document.getElementById("product-description").value;
        const price = document.getElementById("product-price").value;
        const quantity = document.getElementById("product-quantity").value;
  
        const newProduct = { name, description, price, quantity };
        const products = getProducts();
        products.push(newProduct);
        saveProducts(products);
        window.location.href = "index.html"; // Redirigir a la página principal
      });
    }
  
    // Función para eliminar un producto
    window.deleteProduct = function (index) {
      const products = getProducts();
      products.splice(index, 1);
      saveProducts(products);
      displayProducts();
    };
  
    // Función para editar un producto
    window.editProduct = function (index) {
      const products = getProducts();
      const product = products[index];
  
      // Redirigir a la página de edición con los datos en la URL (por simplicidad)
      window.location.href = `edit-product.html?index=${index}&name=${product.name}&description=${product.description}&price=${product.price}&quantity=${product.quantity}`;
    };
  
    // Logica para cargar los datos en la página de edición
    if (editProductForm) {
      const params = new URLSearchParams(window.location.search);
      const index = params.get("index");
      if (index !== null) {
        document.getElementById("product-name").value = params.get("name");
        document.getElementById("product-description").value = params.get("description");
        document.getElementById("product-price").value = params.get("price");
        document.getElementById("product-quantity").value = params.get("quantity");
  
        editProductForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = document.getElementById("product-name").value;
          const description = document.getElementById("product-description").value;
          const price = document.getElementById("product-price").value;
          const quantity = document.getElementById("product-quantity").value;
  
          products[index] = { name, description, price, quantity };
          saveProducts(products);
          window.location.href = "index.html"; // Redirigir a la página principal
        });
      }
    }
  
    // Mostrar productos al cargar la página
    if (productList) {
      displayProducts();
    }
  });
  