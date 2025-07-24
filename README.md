<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>អាហារ នៃ ក្តី ស្រលាញ់</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Khmer:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header py-3">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img id="headerLogo" src="Logo.png" alt="ប័ណ្ណសម្គាល់ភោជនីយដ្ឋាន">
          <span>អាហារ នៃ ក្តី ស្រលាញ់</span>
        </a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a href="#" class="nav-link menu-btn" onclick="showAllMeals()">ទំព័រដើម</a></li>
            <li class="nav-item"><a href="#" class="nav-link menu-btn about" onclick="showinfor()">ពត័មានបន្ថែម</a></li>
            <li class="nav-item"><a href="#" class="nav-link menu-btn" id="currencyToggle">ប្តូរទៅ KHR</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <section class="main-content">
    <div class="container">
      <div class="addwelcome text-center text-white py-5">
      </div>
      <div class="row">
        <div class="col-lg-8">
          <input type="text" id="searchInput" class="form-control mb-3" placeholder="ស្វែងរកម្ហូប...">
          <div id="content" class="content p-4"></div>
        </div>
        <aside class="col-lg-4 aside-1 p-4">
          <div id="cartArea">
            <h3>គិតលុយរបស់លោកអ្នក🛒</h3>
            <div id="cart-list"></div>
            <p>សរុប: <span id="total">0.00</span></p>
            <img id="qrCode" src="QR Code.jpg" class="img-fluid mt-3" style="display: none; max-width: 150px;" alt="QR Code សម្រាប់ការទូទាត់"><br>
            <p id="qrCaption" style="display: none;">ស្កេនដើម្បីទូទាត់ តាមរយះABA</p>
            <p><span id="qrTotal" style="display: none;">0.00</span></p>
            <div class="mb-3">
              <input type="checkbox" id="addDrink" class="form-check-input">
              <label for="addDrink">បន្ថែមភេសជ្ជៈ ($1 សម្រាប់ទឹក, $2 សម្រាប់ស្រាបៀរ)</label>
            </div>
            <button class="btn btn-success mb-2" onclick="payNow()">ទិញ 💳</button>
            <button class="btn btn-success mb-2" onclick="payWithQR()">ទូទាត់ជាមួយ QR Code</button>
            <button class="btn btn-danger" onclick="clearCart()">លុប</button>
          </div>
          <div id="showAbout" style="display: none;">
            <h3>ពត័មានបន្ថែម</h3>
            <div class="about-content d-flex flex-column flex-md-row gap-4">
              <ul class="list-group flex-fill">
                <li class="list-group-item">ឈ្មោះ: ពាក្យ ដេត</li>
                <li class="list-group-item">ភេទ: ប្រុស</li>
                <li class="list-group-item">អាយុ: ២៣ឆ្នាំ</li>
                <li class="list-group-item">បន្ទប់: ៤១៦</li>
                <li class="list-group-item">វេន: រសៀល</li>
                <li class="list-group-item">លេខទំនាក់ទំនង: 068 656 263</li>
                <li class="list-group-item">អុីម៉ែល: peakmao007@gmail.com</li>
                <li class="list-group-item">សាកលវិទ្យាល័យ: ប៊ែលធី អន្តរជាតិ សាខាទី២</li>
                <li class="list-group-item">ឈ្មោះគ្រូ: Dr. BUT CHOMROEUN</li>
              </ul>
              <div class="id-card-container">
                <img id="aboutIdCard" src="ID ProfieBIG+wirte.jpg" class="img-fluid" alt="ប័ណ្ណសម្គាល់ខ្លួន">
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <div class="modal fade" id="checkoutModal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="checkoutModalLabel">សង្ខេបការបញ្ជាទិញ</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">បិទ</button>
          <button type="button" class="btn btn-success" onclick="confirmOrder()">បញ្ជាក់ការបញ្ជាទិញ</button>
        </div>
      </div>
    </div>
  </div>

  <footer class="footer py-3 text-center">
    <div class="social-links">
      <a href="https://www.facebook.com/pu.deth.175755/" target="_blank" class="social-link" aria-label="Facebook Profile">
        <i class="bi bi-facebook"></i> Pu Deth
      </a>
      <a href="https://t.me/Peak_Deth" target="_blank" class="social-link" aria-label="Telegram Profile">
        <i class="bi bi-telegram"></i> @Peak_Deth
      </a>
    </div>
    <img id="footerIdCard" src="Telegram Profile.jpg" class="img-fluid mt-3" alt="ប័ណ្ណសម្គាល់ខ្លួន">
    <p>© 2025 ឈ្មោះក្រុមហ៊ុនរបស់ អាហារ នៃ ក្តី ស្រលាញ់ រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
    <p>រចនាដោយ <a href="https://t.me/Peak_Deth">ពាក្យ ដេត</a></p>
  </footer>

  <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="Bloodjava.js"></script>
</body>
</html>
