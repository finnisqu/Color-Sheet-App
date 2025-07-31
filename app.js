console.log("✅ Color Sheet App loading...");

const categoryDropdown = document.getElementById("categoryDropdown");
const productList = document.getElementById("productList");

async function fetchProducts() {
  try {
    console.log("📡 Fetching products...");

    const response = await fetch(
      "https://incandescent-begonia-01e3e1.netlify.app/.netlify/functions/squarespace-proxy"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    console.log("✅ Fetched products:", products);

    if (!Array.isArray(products)) {
      throw new Error("Products is not an array.");
    }

    populateCategories(products);
    renderProducts(products);

    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
  }
}

function populateCategories(products) {
  console.log("📂 Populating categories...");
  const categories = new Set();

  products.forEach((product) => {
    if (Array.isArray(product.categories)) {
      product.categories.forEach((cat) => categories.add(cat));
    }
  });

  // Clear old options
  categoryDropdown.innerHTML = "";

  // Default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Categories";
  categoryDropdown.appendChild(defaultOption);

  // Add categories
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryDropdown.appendChild(option);
  });
}

function renderProducts(products, filterCategory = "") {
  console.log(`🎨 Rendering products (filter: ${filterCategory || "all"})`);

  productList.innerHTML = "";

  products
    .filter((product) => {
      if (!filterCategory) return true;
      return Array.isArray(product.categories) && product.categories.includes(filterCategory);
    })
    .forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <a href="${product.url}" target="_blank">View Product</a>
      `;

      productList.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();

  if (products) {
    categoryDropdown.addEventListener("change", (e) => {
      renderProducts(products, e.target.value);
    });
  }
});
