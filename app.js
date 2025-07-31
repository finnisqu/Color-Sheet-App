// app.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Color Sheet App loading...");

  const categoryDropdown = document.getElementById("categoryDropdown");
  const groupsContainer = document.getElementById("groupsContainer");
  const addGroupBtn = document.getElementById("addGroupBtn");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const exportCsvBtn = document.getElementById("exportCsvBtn");

  if (!categoryDropdown || !groupsContainer) {
    console.error("❌ Required HTML elements not found. Did you add the HTML block?");
    return;
  }

  let products = [];
  let groups = [];

  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://incandescent-begonia-01e3e1.netlify.app/.netlify/functions/squarespace-proxy"
      );
      const data = await response.json();
      console.log("✅ Fetched products:", data);

      products = data;
      const categories = [...new Set(products.map((p) => p.category))];

      categoryDropdown.innerHTML = `<option value="">Select a category</option>`;
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  }

  categoryDropdown.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    if (!selectedCategory) return;

    groups = [];
    groupsContainer.innerHTML = "";
    addGroup();
  });

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

  function addItem(container) {
    const selectedCategory = categoryDropdown.value;
    const filteredProducts = products.filter((p) => p.category === selectedCategory);

    const itemBox = document.createElement("div");
    itemBox.className = "item-box";

    const productSelect = document.createElement("select");
    productSelect.className = "product-dropdown";
    productSelect.innerHTML = `<option value="">Select a product</option>`;

    filteredProducts.forEach((prod) => {
      const opt = document.createElement("option");
      opt.value = prod.id;
      opt.textContent = prod.title;
      productSelect.appendChild(opt);
    });

    itemBox.appendChild(productSelect);
    container.appendChild(itemBox);
  }

  addGroupBtn?.addEventListener("click", addGroup);
  exportPdfBtn?.addEventListener("click", () => alert("PDF export coming soon!"));
  exportCsvBtn?.addEventListener("click", () => alert("CSV export coming soon!"));

  fetchProducts();
});
