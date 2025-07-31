document.addEventListener("DOMContentLoaded", () => {
  const categoryDropdown = document.getElementById("categoryDropdown");
  const groupsContainer = document.getElementById("groupsContainer");

  if (!categoryDropdown || !groupsContainer) {
    console.error("App containers not found. Make sure the HTML block is on the page.");
    return;
  }

// app.js

const proxyUrl = "https://incandescent-begonia-01e3e1.netlify.app/.netlify/functions/squarespace-proxy";

// Store products globally
let allProducts = [];
let categories = [];

// Elements
const categoryDropdown = document.getElementById("categoryDropdown");
const groupsContainer = document.getElementById("groupsContainer");

// Fetch products from Squarespace via proxy
async function fetchProducts() {
  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();

    // Assuming Squarespace API gives items under data.items
    allProducts = data.items || [];

    // Extract unique categories
    categories = [...new Set(allProducts.map(p => p.categories?.[0]?.title).filter(Boolean))];

    populateCategoryDropdown();
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// Fill category dropdown
function populateCategoryDropdown() {
  categoryDropdown.innerHTML = "<option value=''>Select a category</option>";

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryDropdown.appendChild(opt);
  });
}

// When category is chosen, refresh groups
categoryDropdown.addEventListener("change", () => {
  const selectedCategory = categoryDropdown.value;
  groupsContainer.innerHTML = ""; // Reset
  if (selectedCategory) {
    addGroup(); // Add first group by default
  }
});

// Add a new group box
function addGroup() {
  const groupDiv = document.createElement("div");
  groupDiv.className = "group-box";

  const title = document.createElement("h3");
  title.textContent = `Group ${groupsContainer.children.length + 1}`;

  const productSelect = createProductDropdown(categoryDropdown.value);

  const addItemBtn = document.createElement("button");
  addItemBtn.textContent = "+ Add Item";
  addItemBtn.onclick = () => {
    const newSelect = createProductDropdown(categoryDropdown.value);
    groupDiv.appendChild(newSelect);
  };

  groupDiv.appendChild(title);
  groupDiv.appendChild(productSelect);
  groupDiv.appendChild(addItemBtn);

  groupsContainer.appendChild(groupDiv);
}

// Create searchable product dropdown
function createProductDropdown(category) {
  const wrapper = document.createElement("div");
  wrapper.className = "dropdown-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search product...";
  input.className = "search-box";

  const select = document.createElement("select");
  select.className = "product-dropdown";

  populateProductOptions(select, category, "");

  // Filter options based on search
  input.addEventListener("input", () => {
    populateProductOptions(select, category, input.value);
  });

  wrapper.appendChild(input);
  wrapper.appendChild(select);

  return wrapper;
}

// Fill product dropdown with products from selected category
function populateProductOptions(select, category, searchQuery) {
  select.innerHTML = "<option value=''>Select product</option>";

  const products = allProducts.filter(p => p.categories?.[0]?.title === category);

  products
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.title;
      select.appendChild(opt);
    });
}  console.log("Color Sheet app initialized.");

  // Example fetch
  fetch("https://incandescent-begonia-01e3e1.netlify.app/.netlify/functions/squarespace-proxy")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched products:", data);

      // Fill dropdown categories
      const categories = [...new Set(data.map(p => p.category))];
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryDropdown.appendChild(option);
      });
    })
    .catch(err => console.error("Error fetching products:", err));
});




// Init
fetchProducts();
