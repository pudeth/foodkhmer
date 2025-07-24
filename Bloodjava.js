const meals = {
  breakfast: {
    drink: "Water",
    items: [
      { name: "បាយ ស្រូប", price: 2, img: "baysrob.jpg" },
      { name: "បបរ គ្រឿង", price: 2, img: "bb_krerng.jpg" },
      { name: "នំ បញ្ចុកស្រុះ", price: 3, img: "nom_banhjok.jpg" },
      { name: "មី ស៊ុប", price: 2.5, img: "mi_sob.jpg" },
      { name: "បាយ សាច់ជ្រូក", price: 2, img: "bay_sach_jruk.jpg" }
    ]
  },
  lunch: {
    drink: "Water",
    items: [
      { name: "បាយ ឆា", price: 3, img: "baycha.jpg" },
      { name: "គុយ ទាវ", price: 3, img: "Koyteav.jpg" },
      { name: "បាយ + ម្ហូប", price: 2, img: "12.jpg" },
      { name: "សម្ល ម្ជូរ", price: 3.5, img: "somlor_machou.jpg" },
      { name: "បាយ សាច់មាន់", price: 3, img: "bay_sach_moan.jpg" }
    ]
  },
  dinner: {
    drink: "Beer",
    items: [
      { name: "ស៊ុប គោ", price: 5, img: "Sobkor.jpg" },
      { name: "គោ ដុត", price: 5, img: "kordot.jpg" },
      { name: "មាន់ អាំងអំបិលម្ទេស", price: 5, img: "chiken.jpg" },
      { name: "មឹក អាំង", price: 6, img: "muk_ang.jpg" },
      { name: "ស៊ុប សាច់ជ្រូក", price: 5, img: "soup_sach_jruk.jpg" }
    ]
  }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = parseFloat(localStorage.getItem('total')) || 0;
let currency = localStorage.getItem('currency') || 'USD';
const exchangeRate = 4000; // USD to KHR

const DOM = {
  cartArea: document.getElementById("cartArea"),
  showAbout: document.getElementById("showAbout"),
  welcome: document.querySelector(".addwelcome"),
  content: document.getElementById("content"),
  cartList: document.getElementById("cart-list"),
  totalBox: document.getElementById("total"),
  searchInput: document.getElementById("searchInput"),
  currencyToggle: document.getElementById("currencyToggle"),
  toastContainer: document.getElementById("toastContainer"),
  qrCode: document.getElementById("qrCode"),
  qrCaption: document.getElementById("qrCaption"),
  qrTotal: document.getElementById("qrTotal")
};

window.onload = () => {
  DOM.cartArea.classList.add("hideCart");
  DOM.showAbout.style.display = "none";
  DOM.welcome.style.display = "block";
  showAllMeals();
  updateCart();
  updateCurrencyDisplay();
  DOM.searchInput.addEventListener("input", debounce(filterMeals, 300));
  DOM.currencyToggle.addEventListener("click", toggleCurrency);
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


function showAllMeals(activeTab = 'all') {
  DOM.welcome.style.display = "none";
  DOM.showAbout.style.display = "none";
  DOM.cartArea.classList.remove("hideCart");
  DOM.content.style.display = "block";

  let html = `
    <ul class="nav nav-tabs mb-4" id="mealTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link ${activeTab === 'all' ? 'active' : ''}" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" role="tab" aria-controls="all" aria-selected="${activeTab === 'all'}">ទាំងអស់</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link ${activeTab === 'breakfast' ? 'active' : ''}" id="breakfast-tab" data-bs-toggle="tab" data-bs-target="#breakfast" role="tab" aria-controls="breakfast" aria-selected="${activeTab === 'breakfast'}">អាហារពេលព្រឹក</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link ${activeTab === 'lunch' ? 'active' : ''}" id="lunch-tab" data-bs-toggle="tab" data-bs-target="#lunch" role="tab" aria-controls="lunch" aria-selected="${activeTab === 'lunch'}">អាហារថ្ងៃត្រង់</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link ${activeTab === 'dinner' ? 'active' : ''}" id="dinner-tab" data-bs-toggle="tab" data-bs-target="#dinner" role="tab" aria-controls="dinner" aria-selected="${activeTab === 'dinner'}">អាហារល្ងាច</button>
      </li>
    </ul>
    <div class="tab-content">
  `;


  html += `<div class="tab-pane fade ${activeTab === 'all' ? 'show active' : ''}" id="all" role="tabpanel" aria-labelledby="all-tab">`;
  Object.keys(meals).forEach(mealType => {
    html += `<h2 class="text-center mb-4">${mealType === 'breakfast' ? 'អាហារពេលព្រឹក' : mealType === 'lunch' ? 'អាហារថ្ងៃត្រង់' : 'អាហារល្ងាច'}</h2>`;
    html += '<div class="row g-3">';
    meals[mealType].items.forEach((item, index) => {
      html += renderMealItem(mealType, item, index);
    });
    html += '</div>';
  });
  html += '</div>';

  Object.keys(meals).forEach(mealType => {
    html += `<div class="tab-pane fade ${activeTab === mealType ? 'show active' : ''}" id="${mealType}" role="tabpanel" aria-labelledby="${mealType}-tab">`;
    html += `<h2 class="text-center mb-4">${mealType === 'breakfast' ? 'អាហារពេលព្រឹក' : mealType === 'lunch' ? 'អាហារថ្ងៃត្រង់' : 'អាហារល្ងាច'}</h2>`;
    html += '<div class="row g-3">';
    meals[mealType].items.forEach((item, index) => {
      html += renderMealItem(mealType, item, index);
    });
    html += '</div></div>';
  });

  html += '</div>';
  DOM.content.innerHTML = html;
  initializeTabs();
}

function initializeTabs() {
  const tabList = document.querySelectorAll('#mealTabs .nav-link');
  tabList.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      showAllMeals(tab.dataset.bsTarget.slice(1));
    });
  });
}

function renderMealItem(mealType, item, index) {
  const price = currency === 'USD' ? item.price.toFixed(2) : (item.price * exchangeRate).toFixed(0);
  const currencySymbol = currency === 'USD' ? '$' : '៛';
  const imgSrc = item.img ? item.img : 'https://via.placeholder.com/200x200?text=Image+Not+Found';
  return `
    <div class="col-md-4 meal-item" data-name="${item.name.toLowerCase()}">
      <div class="card h-100">
        <img src="${imgSrc}" class="card-img-top" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Not+Found';">
        <div class="card-body text-center">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">តម្លៃ: ${currencySymbol}${price}</p>
          <div class="input-group mb-2">
            <input type="number" class="form-control quantity-input" min="1" value="1" id="quantity-${mealType}-${index}" aria-label="បរិមាណសម្រាប់ ${item.name}">
            <button class="btn btn-success" onclick="orderItem('${mealType}', ${index})" aria-label="បន្ថែម ${item.name} ទៅកន្ត្រក">ទិញ</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterMeals() {
  DOM.searchInput.classList.add('search-loading');
  const searchTerm = DOM.searchInput.value.toLowerCase().trim();
  const mealItems = document.querySelectorAll(".meal-item");
  mealItems.forEach(item => {
    const name = item.dataset.name;
    item.style.display = name.includes(searchTerm) ? "block" : "none";
  });
  setTimeout(() => DOM.searchInput.classList.remove('search-loading'), 300);
}

function showinfor() {
  DOM.welcome.style.display = "none";
  DOM.cartArea.classList.add("hideCart");
  DOM.showAbout.style.display = "block";
  DOM.content.style.display = "none";
}

function orderItem(mealType, index) {
  const meal = meals[mealType];
  const item = meal?.items[index];
  if (!item) return;

  const quantityInput = document.getElementById(`quantity-${mealType}-${index}`);
  const quantity = parseInt(quantityInput.value) || 1;
  if (quantity < 1) {
    showToast('បរិមាណត្រូវតែយ៉ាងហោចណាស់ ១', 'danger');
    quantityInput.value = 1;
    return;
  }

  const drinkCheckbox = document.getElementById("addDrink");
  const drinkIncluded = drinkCheckbox?.checked;

  let drinkPrice = 0;
  if (drinkIncluded) {
    drinkPrice = meal.drink === "Beer" ? 2 : 1;
  }

  const orderPrice = (item.price + drinkPrice) * quantity;

  cart.push({ name: item.name, price: item.price * quantity, quantity, drink: drinkIncluded ? meal.drink : null, drinkPrice: drinkPrice * quantity });
  total += orderPrice;

  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('total', total.toFixed(2));

  updateCart();
  showToast(`${item.name} (x${quantity}) បានបន្ថែមទៅកន្ត្រក!`, 'success');
}

function removeItem(index) {
  const item = cart[index];
  total -= (item.price + item.drinkPrice);
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('total', total.toFixed(2));
  updateCart();
  showToast('ធាតុបានលុបចេញពីកន្ត្រក!', 'warning');
}

function updateCart() {
  const currencySymbol = currency === 'USD' ? '$' : '៛';
  const totalDisplay = currency === 'USD' ? total.toFixed(2) : (total * exchangeRate).toFixed(0);
  DOM.cartList.innerHTML = cart
    .map((item, index) => `
      <div class="d-flex justify-content-between align-items-center animate-slide-in">
        <p class="mb-0">${item.name} (x${item.quantity}) - ${currencySymbol}${currency === 'USD' ? item.price.toFixed(2) : (item.price * exchangeRate).toFixed(0)}</p>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})" aria-label="លុប ${item.name} ចេញពីកន្ត្រក">លុប</button>
      </div>
    `)
    .join("");
  DOM.totalBox.textContent = totalDisplay;
  if (cart.length > 0) {
    DOM.qrCode.style.display = 'block';
    DOM.qrCaption.style.display = 'block';
    DOM.qrTotal.style.display = 'inline';
    DOM.qrTotal.textContent = totalDisplay;
  } else {
    DOM.qrCode.style.display = 'none';
    DOM.qrCaption.style.display = 'none';
    DOM.qrTotal.style.display = 'none';
  }
}

function clearCart() {
  cart = [];
  total = 0;
  localStorage.removeItem('cart');
  localStorage.removeItem('total');
  updateCart();
  const drinkCheckbox = document.getElementById("addDrink");
  if (drinkCheckbox) drinkCheckbox.checked = false;
  showToast('កន្ត្រកបានលុប!', 'warning');
}

function payNow() {
  if (cart.length === 0) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById('checkoutModal')).show();
    document.getElementById('modalBody').innerHTML = '<p class="text-danger">កន្ត្រកទទេ!</p>';
    DOM.content.style.display = "none";
    return;
  }

  const currencySymbol = currency === 'USD' ? '$' : '៛';
  const summary = cart
    .map(item => {
      const itemPrice = currency === 'USD' ? item.price.toFixed(2) : (item.price * exchangeRate).toFixed(0);
      let line = `${item.name} (x${item.quantity}) - ${currencySymbol}${itemPrice}`;
      if (item.drink) {
        const drinkPrice = currency === 'USD' ? item.drinkPrice.toFixed(2) : (item.drinkPrice * exchangeRate).toFixed(0);
        line += `<br><small>+ ${item.drink} - ${currencySymbol}${drinkPrice}</small>`;
      }
      return line;
    })
    .join("<br>") + `<br><br><strong>សរុប: ${currencySymbol}${currency === 'USD' ? total.toFixed(2) : (total * exchangeRate).toFixed(0)}</strong>`;

  document.getElementById('modalBody').innerHTML = summary;
  DOM.content.style.display = "none";
  bootstrap.Modal.getOrCreateInstance(document.getElementById('checkoutModal')).show();
}

function confirmOrder() {
  bootstrap.Modal.getOrCreateInstance(document.getElementById('checkoutModal')).hide();
  clearCart();
  DOM.content.style.display = "none";
  showToast('ការបញ្ជាទិញបានបញ្ជាក់! សូមអរគុណសម្រាប់ការទិញរបស់អ្នក!', 'success');
  DOM.welcome.style.display = "block";
}

function toggleCurrency() {
  currency = currency === 'USD' ? 'KHR' : 'USD';
  localStorage.setItem('currency', currency);
  updateCurrencyDisplay();
  showAllMeals(document.querySelector('.nav-tabs .nav-link.active')?.dataset.bsTarget?.slice(1) || 'all');
  updateCart();
  showToast(`រូបិយប័ណ្ណបានប្តូរទៅ ${currency}`, 'info');
}

function updateCurrencyDisplay() {
  DOM.currencyToggle.textContent = currency === 'USD' ? 'ប្តូរទៅ KHR' : 'ប្តូរទៅ USD';
}

function payWithQR() {
  if (cart.length === 0) {
    showToast('កន្ត្រកទទេ! បន្ថែមធាតុដើម្បីទូទាត់។', 'danger');
    return;
  }
  const currencySymbol = currency === 'USD' ? '$' : '៛';
  const totalDisplay = currency === 'USD' ? total.toFixed(2) : (total * exchangeRate).toFixed(0);
  clearCart();
  DOM.content.style.display = "none";
  DOM.welcome.style.display = "block";
  DOM.cartArea.classList.add("hideCart");
  showToast(`ការទូទាត់ ${currencySymbol}${totalDisplay} បានបញ្ចប់តាម QR code!`, 'success');
}

