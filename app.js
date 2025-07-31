document.addEventListener("DOMContentLoaded", function () {
  const appContainer = document.querySelector("#color-sheet-app");
  if (!appContainer) {
    return; // Exit if not on the Color Sheet page
  }

  // ===== STATE =====
  let products = [];
  let categories = [];
  let selectedCategory = null;
  let groups = [{ id: 1, items: [] }];

  // ===== HELPERS =====
  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.innerText = text;
    return el;
  }

  function fetchProducts() {
    // Example endpoint: adjust to your proxy
    return fetch("https://your-proxy-url.com/products")
      .then(res => res.json())
      .then(data => {
        products = data;
        categories = [...new Set(products.map(p => p.category))];
        populateCategoryDropdown();
      })
      .catch(err => console.error("Error fetching products:", err));
  }

  function populateCategoryDropdown() {
    categoryDropdown.innerHTML = "";
    const defaultOpt = createEl("option", "", "-- Select Category --");
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    categoryDropdown.appendChild(defaultOpt);

    categories.forEach(cat => {
      const opt = createEl("option", "", cat);
      opt.value = cat;
      categoryDropdown.appendChild(opt);
    });
  }

  function populateProductDropdown(dropdown, category) {
    dropdown.innerHTML = "";
    const catProducts = products.filter(p => p.category === category);

    const defaultOpt = createEl("option", "", "-- Select Product --");
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    dropdown.appendChild(defaultOpt);

    catProducts.forEach(p => {
      const opt = createEl("option", "", p.name);
      opt.value = p.id;
      dropdown.appendChild(opt);
    });
  }

  // ===== UI BUILD =====
  const header = createEl("div", "header");
  const title = createEl("h1", "title", "Color Sheet");

  const exportButtons = createEl("div", "export-buttons");
  const pdfBtn = createEl("button", "export-btn", "Export PDF");
  const csvBtn = createEl("button", "export-btn", "Export CSV");
  exportButtons.appendChild(pdfBtn);
  exportButtons.appendChild(csvBtn);

  header.appendChild(title);
  header.appendChild(exportButtons);

  const categoryContainer = createEl("div", "category-container");
  const categoryDropdown = createEl("select", "dropdown");
  categoryContainer.appendChild(categoryDropdown);

  const groupsContainer = createEl("div", "groups-container");
  const addGroupBtn = createEl("button", "add-group-btn", "Add Group");

  const previewContainer = createEl("div", "preview-container");
  previewContainer.innerHTML = "<h2>PDF Preview</h2>";

  appContainer.appendChild(header);
  appContainer.appendChild(categoryContainer);

  const layout = createEl("div", "layout");
  const leftBox = createEl("div", "left-box");
  const rightBox = createEl("div", "right-box");

  leftBox.appendChild(groupsContainer);
  leftBox.appendChild(addGroupBtn);
  rightBox.appendChild(previewContainer);

  layout.appendChild(leftBox);
  layout.appendChild(rightBox);
  appContainer.appendChild(layout);

  // ===== EVENT HANDLERS =====
  categoryDropdown.addEventListener("change", () => {
    selectedCategory = categoryDropdown.value;
    groups = [{ id: 1, items: [] }];
    renderGroups();
  });

  addGroupBtn.addEventListener("click", () => {
    const newId = groups.length + 1;
    groups.push({ id: newId, items: [] });
    renderGroups();
  });

  pdfBtn.addEventListener("click", () => {
    alert("PDF export coming soon...");
  });

  csvBtn.addEventListener("click", () => {
    exportCSV();
  });

  // ===== RENDER FUNCTIONS =====
  function renderGroups() {
    groupsContainer.innerHTML = "";
    groups.forEach(group => {
      const groupBox = createEl("div", "group-box");
      const groupTitle = createEl("h3", "", "Group " + group.id);

      const itemsContainer = createEl("div", "items-container");

      group.items.forEach((item, idx) => {
        const itemRow = createEl("div", "item-row");

        const dropdown = createEl("select", "dropdown");
        populateProductDropdown(dropdown, selectedCategory);
        dropdown.value = item.id;

        dropdown.addEventListener("change", () => {
          group.items[idx] = { id: dropdown.value };
          updatePreview();
        });

        itemRow.appendChild(dropdown);
        itemsContainer.appendChild(itemRow);
      });

      const addItemBtn = createEl("button", "add-item-btn", "Add Item");
      addItemBtn.addEventListener("click", () => {
        group.items.push({ id: null });
        renderGroups();
      });

      groupBox.appendChild(groupTitle);
      groupBox.appendChild(itemsContainer);
      groupBox.appendChild(addItemBtn);
      groupsContainer.appendChild(groupBox);
    });

    updatePreview();
  }

  function updatePreview() {
    previewContainer.innerHTML = "<h2>PDF Preview</h2>";
    const timestamp = new Date().toLocaleString();
    const timeEl = createEl("div", "timestamp", timestamp);
    previewContainer.appendChild(timeEl);

    groups.forEach(group => {
      const groupEl = createEl("div", "preview-group");
      const gTitle = createEl("h3", "", "Group " + group.id);
      groupEl.appendChild(gTitle);

      const row = createEl("div", "preview-row");
      group.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const card = createEl("div", "preview-card");
          const img = createEl("img");
          img.src = product.image;
          img.alt = product.name;
          const caption = createEl("div", "caption", product.name);
          card.appendChild(img);
          card.appendChild(caption);
          row.appendChild(card);
        }
      });
      groupEl.appendChild(row);
      previewContainer.appendChild(groupEl);
    });
  }

  function exportCSV() {
    let rows = [["Category", "Group", "Product"]];
    groups.forEach(group => {
      group.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          rows.push([selectedCategory, group.id, product.name]);
        }
      });
    });

    let csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "color-sheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ===== INIT =====
  fetchProducts();
});
