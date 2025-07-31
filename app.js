// app.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Color Sheet App loading...");

  // Grab references to the UI elements
  const categoryDropdown = document.getElementById("categoryDropdown");
  const groupsContainer = document.getElementById("groupsContainer");
  const addGroupBtn = document.getElementById("addGroupBtn");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const exportCsvBtn = document.getElementById("exportCsvBtn");

  // If we can't find the app container, stop here
  if (!categoryDropdown || !groupsContainer) {
    console.error("❌ App containers not found. Check your HTML block.");
    return;
  }

  // State
  let products = [];
  let groups = [];

  // Fetch products from proxy
  async function fetchProducts() {
    try {
      const response = await fetch("https://incandescent-begonia-01e3e1.netlify.app/.netlify/functions/squarespace-proxy");
      const data = await response.json();
      console.log("✅ Fetched products:", data);

      products = data;

      // Build unique category list
      const categories = [...new Set(products.map(p => p.category))];
      console.log("✅ Categories:", categories);

      // Populate dropdown
      categoryDropdown.innerHTML = `<option value="">Select a category</option>`;
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  }

  // Handle category change
  categoryDropdown.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    console.log("📂 Selected category:", selectedCategory);

    if (!selectedCategory) return;

    // Reset groups
    groups = [];
    groupsContainer.innerHTML = "";

    // Add the first group automatically
    addGroup();
  });

  // Add a group
  function addGroup() {
    const groupIndex = groups.length + 1;
    const groupBox = document.createElement("div");
    groupBox.className = "group-box";
    groupBox.innerHTML = `
      <h3>Group ${groupIndex}</h3>
      <div class="items"></div>
      <button class="addItemBtn">+ Add Item</button>
    `;

    const addItemBtn = groupBox.querySelector(".addItemBtn");
    const itemsContainer = groupBox.querySelector(".items");

    addItemBtn.addEventListener("click", () => addItem(itemsContainer));

    groupsContainer.appendChild(groupBox);
    groups.push({ groupIndex, items: [] });
  }

  // Add an item to a group
  function addItem(container) {
    const selectedCategory = categoryDropdown.value;
    const filteredProducts = products.filter(p => p.category === selectedCategory);

    const itemBox = document.createElement("div");
    itemBox.className = "item-box";

    const productSelect = document.createElement("select");
    productSelect.className = "product-dropdown";

    // Add search option (basic browser search in dropdown)
    productSelect.innerHTML = `<option value="">Select a product</option>`;
    filteredProducts.forEach(prod => {
      const opt = document.createElement("option");
      opt.value = prod.id;
      opt.textContent = prod.title;
      productSelect.appendChild(opt);
    });

    itemBox.appendChild(productSelect);
    container.appendChild(itemBox);
  }

  // Export to PDF
  exportPdfBtn?.addEventListener("click", () => {
    console.log("📄 Export PDF clicked.");
    alert("PDF export coming soon!");
  });

  // Export to CSV
  exportCsvBtn?.addEventListener("click", () => {
    console.log("📊 Export CSV clicked.");
    alert("CSV export coming soon!");
  });

  // Add group button
  addGroupBtn?.addEventListener("click", addGroup);

  // Start app
  fetchProducts();
});
