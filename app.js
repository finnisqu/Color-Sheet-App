// ===== CONFIG =====
const PROXY_BASE = "https://incandescent-begonia-01e3e1.netlify.app/.netlify/functions/squarespace-proxy";

// Define your categories and their Squarespace gallery page URLs
const CATEGORIES = {
  Granite: "https://www.worldstoneonline.com/granite-gallery",
  Quartz: "https://www.worldstoneonline.com/quartz-gallery",
  Marble: "https://www.worldstoneonline.com/marble-gallery"
};

// ===== STATE =====
let allProducts = {};
let selectedCategory = null;

// ===== UI HOOKS =====
const categoryDropdown = document.getElementById("categoryDropdown");
const groupsContainer = document.getElementById("groupsContainer");

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // Populate Category dropdown
  Object.keys(CATEGORIES).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryDropdown.appendChild(opt);
  });

  // Category change → load products
  categoryDropdown.addEventListener("change", async (e) => {
    selectedCategory = e.target.value;
    await loadCategoryProducts(selectedCategory);
    renderGroups();
  });

  // Add Group button
  document.getElementById("addGroupBtn").addEventListener("click", () => {
    if (!selectedCategory) return alert("Select a category first!");
    addGroup();
  });

  // Export buttons
  document.getElementById("exportPDFBtn").addEventListener("click", () => {
    exportPDF();
  });

  document.getElementById("exportCSVBtn").addEventListener("click", () => {
    exportCSV();
  });
});

// ===== LOAD PRODUCTS =====
async function loadCategoryProducts(category) {
  if (allProducts[category]) return; // already loaded

  try {
    const res = await fetch(
      `${PROXY_BASE}?url=${encodeURIComponent(CATEGORIES[category])}&category=${category}`
    );
    const data = await res.json();
    allProducts[category] = data.products || [];
    console.log("Loaded products for", category, allProducts[category]);
  } catch (err) {
    console.error("Failed to load products", err);
  }
}

// ===== GROUPS & ITEMS =====
let groups = [];

function addGroup() {
  const groupId = groups.length + 1;
  groups.push({ id: groupId, items: [] });
  renderGroups();
}

function addItem(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  group.items.push({ product: null });
  renderGroups();
}

function renderGroups() {
  groupsContainer.innerHTML = "";

  groups.forEach(group => {
    const groupBox = document.createElement("div");
    groupBox.className = "group-box";

    const title = document.createElement("h3");
    title.textContent = `Group ${group.id}`;
    groupBox.appendChild(title);

    const addItemBtn = document.createElement("button");
    addItemBtn.textContent = "Add Item";
    addItemBtn.onclick = () => addItem(group.id);
    groupBox.appendChild(addItemBtn);

    // Render items
    group.items.forEach((item, idx) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item-row";

      const select = document.createElement("select");
      select.className = "product-select";
      select.innerHTML = `<option value="">Select product</option>`;

      if (selectedCategory && allProducts[selectedCategory]) {
        allProducts[selectedCategory].forEach(prod => {
          const opt = document.createElement("option");
          opt.value = prod.name;
          opt.textContent = prod.name;
          if (item.product === prod.name) opt.selected = true;
          select.appendChild(opt);
        });
      }

      select.addEventListener("change", (e) => {
        item.product = e.target.value;
      });

      itemDiv.appendChild(select);
      groupBox.appendChild(itemDiv);
    });

    groupsContainer.appendChild(groupBox);
  });
}

// ===== EXPORT PDF (placeholder) =====
function exportPDF() {
  alert("PDF export coming soon!");
}

// ===== EXPORT CSV =====
function exportCSV() {
  if (!selectedCategory) return alert("Select a category first!");
  let rows = [["Category", "Group", "Product"]];

  groups.forEach(group => {
    group.items.forEach(item => {
      rows.push([selectedCategory, `Group ${group.id}`, item.product || ""]);
    });
  });

  const csvContent = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${selectedCategory}_ColorSheet.csv`;
  a.click();
}
