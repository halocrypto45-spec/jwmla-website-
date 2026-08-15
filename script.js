(function(){
  "use strict";

  /* ============ Broken image fallback ============ */
  const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#E5E7EB"/><g fill="none" stroke="#9CA3AF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><rect x="70" y="90" width="260" height="200" rx="16"/><circle cx="150" cy="150" r="20"/><path d="M70 250l70-70 50 50 60-80 80 100"/></g></svg>`;
  const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(PLACEHOLDER_SVG);
  window.handleImgError = function(el){
    el.onerror = null;
    el.src = PLACEHOLDER_IMG;
    el.style.objectFit = 'contain';
    el.style.padding = '14%';
    el.style.opacity = '1';
  };

  /* ============ imgbb / ibb.co link normalizer ============ */
  function normalizeImageUrl(url){
    if(!url) return url;
    const trimmed = url.trim();
    let u;
    try{ u = new URL(trimmed); }catch(e){ return trimmed; }
    const host = u.hostname.replace(/^www\./,'');
    if(host === 'i.ibb.co'){ return trimmed; }
    if(host === 'ibb.co'){ return 'https://i.ibb.co' + u.pathname + u.search; }
    if(host === 'imgbb.com' && u.pathname.startsWith('/image/')){
      return 'https://i.ibb.co' + u.pathname.replace('/image', '') + u.search;
    }
    return trimmed;
  }

  /* ============ Local (non-product) keys ============ */
  const K_LANG = 'koga_lang_v1';
  const K_CART = 'koga_cart_v1';
  const WHATSAPP_NUMBER = '9647508457841';

  /* ============ Fixed category list (id + icon + per-language label) ============ */
  const CATEGORIES = [
    {id:'women', icon:'👗', ku:'ئافرەتان', ar:'نسائي', en:'Women'},
    {id:'men', icon:'👔', ku:'پیاوان', ar:'رجالي', en:'Men'},
    {id:'accessories', icon:'👜', ku:'ئێکسسوار', ar:'إكسسوارات', en:'Accessories'},
    {id:'perfume', icon:'🧴', ku:'عەتر', ar:'عطور', en:'Perfume'},
    {id:'children', icon:'🧸', ku:'منداڵان', ar:'أطفال', en:'Children'},
    {id:'beauty', icon:'💄', ku:'جوانکاری', ar:'تجميل', en:'Beauty'},
    {id:'electronics', icon:'🔌', ku:'ئەلیکترۆنی', ar:'إلكترونيات', en:'Electronics'},
    {id:'watches', icon:'⌚', ku:'کاتژمێر', ar:'ساعات', en:'Watches'},
    {id:'cleaning', icon:'🧼', ku:'پاککەرەوە', ar:'منظفات', en:'Cleaning'},
    {id:'home', icon:'🏠', ku:'پێداویستی ماڵ', ar:'مستلزمات المنزل', en:'Home Supplies'},
    {id:'devices', icon:'📱', ku:'ئامێر', ar:'أجهزة', en:'Devices'}
  ];
  function catLabel(cat){ return cat[lang] || cat.ku; }
  function findCat(id){ return CATEGORIES.find(c => c.id === id); }

  /* ============ Translations ============ */
  const T = {
    ku: {
      dir:'rtl', brandName:'کۆگا',
      tabMainText:'بەشی سەرەکی', tabOffersText:'بەشی ئۆفەر', tabLocalText:'بەرهەمی ناوخۆ',
      searchPlaceholder:'گەڕان...', menuLangText:'گۆڕینی زمان', menuAddText:'زیادکردنی کاڵا',
      menuInfoText:'زانیاری', infoTitle:'زانیاری',
      infoBody:'١- کڕیاڕی بەڕێز لە کاتی داواکردنی کاڵا لە وێبسایتی کۆگا لە ماوەی ٣-٥ ڕۆژ کاڵاکان دەگاتە دەستان.\n٢- بۆ داواکردنی کاڵا یان زیاد کردنی کاڵا پەیوەندی بکەن بە ژمارە مۆبایلی 07508457841',
      formTitleAdd:'زیادکردنی کاڵا', formTitleEdit:'دەستکاریکردنی کاڵا',
      lblImage:'لینکی وێنه (URL)', imgPreviewText:'وێنه لێرە دەردەکەوێت',
      lblName:'ناوی کاڵا', lblCode:'کۆدی کاڵا', lblCompany:'ناوی کۆمپانیا',
      lblCategory:'جۆر / پۆل', lblCategoryHint:'(دەتوانیت چەند پۆلێک هەڵبژێریت)', lblSection:'شوێنی دەرکەوتن',
      optMainText:'بەشی سەرەکی', optOffersText:'بەشی ئۆفەر', optLocalText:'بەرهەمی ناوخۆ',
      lblPiece:'نرخی دانه', lblCarton:'نرخی کارتۆن', lblUnits:'ژمارەی دانه له کارتۆنێکدا',
      lblBarcode:'بارکۆد', lblDesc:'تێبینی / وردەکاری',
      cancelBtn:'پاشگەزبوونەوه', saveBtn:'پاشەکەوتکردن', savingBtn:'پاشەکەوتکردن...',
      newCatPlaceholder:'پۆلی نوێ...', pieceLabel:'نرخی دانه', cartonLabel:'کارتۆن',
      perCarton:'دانه/کارتۆن', confirmDelete:'دڵنیایت لە سڕینەوەی ئەم کاڵایه؟',
      emptyText:'هیچ کاڵایەک نییه', noResults:'هیچ ئەنجامێک نەدۆزرایەوه', loadingText:'بارکردن...',
      lblCodeD:'کۆدی کاڵا', lblCompanyD:'ناوی کۆمپانیا',
      lblPieceD:'نرخی دانه', lblCartonD:'نرخی کارتۆن', lblUnitsD:'دانه/کارتۆن',
      lblCatD:'جۆر', lblBarcodeD:'بارکۆد', noBarcode:'نییه', noCarton:'نییه', noValue:'نییه',
      uncategorized:'بێ پۆل', currency:'د.ع',
      menuLoginText:'چوونەژوورەوە', menuLogoutText:'دەرچوون', loginTitle:'چوونەژوورەوەی بەڕێوەبەر',
      lblEmail:'ئیمەیل', lblPassword:'وشەی نهێنی', loginSubmitBtn:'چوونەژوورەوە',
      loginError:'ئیمەیل یان وشەی نهێنی هەڵەیه', pleaseLogin:'تکایە سەرەتا بچووە ژوورەوە',
      notConnected:'پەیوەندی بە داتابەیسەوە نییه. تکایە پەیجەکە نوێ بکەرەوە.',
      dbError:'کێشەیەک لە پەیوەندیکردن بە داتابەیس ڕوویدا. تکایە دواتر هەوڵ بدەرەوە.',
      errorPrefix:'هەڵەیەک ڕوویدا: ',
      filterTitle:'پۆلەکان', filterSortTitle:'ڕیزکردن بەپێی نرخ',
      sortLowText:'کەمترین نرخ', sortHighText:'زۆرترین نرخ',
      filterResetBtn:'پاکردنەوە', filterApplyBtn:'جێبەجێکردن',
      cartTitle:'سەبەتەی کڕین', cartOrderText:'داواکردن لە وەتساپ', cartEmpty:'سەبەتەکەت بەتاڵه',
      addedToCart:'زیادکرا بۆ سەبەتە', allCat:'هەموو', detailAddCartText:'زیادکردن بۆ سەبەتە',
      waMsgHeader:'سڵاو، دەمەوێت ئەم کاڵایانە داوا بکەم:', waMsgCode:'کۆد', waMsgName:'ناو', waMsgQty:'دانە',
      nameRequiredMsg:'ناو و نرخی دانه پێویستن', addingPending:'تکایە چاوەڕێ بکە، کاڵاکە هێشتا پاشەکەوت دەکرێت...'
    },
    ar: {
      dir:'rtl', brandName:'كوگا',
      tabMainText:'الرئيسية', tabOffersText:'العروض', tabLocalText:'المنتجات المحلية',
      searchPlaceholder:'اطلب...', menuLangText:'تغيير اللغة', menuAddText:'إضافة منتج',
      menuInfoText:'معلومات', infoTitle:'معلومات',
      infoBody:'١- عزيزي الزبون، عند طلب منتج من موقع كوگا سيصلك خلال ٣-٥ أيام.\n٢- لطلب منتج أو إضافة منتج تواصل مع الرقم 07508457841',
      formTitleAdd:'إضافة منتج', formTitleEdit:'تعديل المنتج',
      lblImage:'رابط الصورة (URL)', imgPreviewText:'ستظهر الصورة هنا',
      lblName:'اسم المنتج', lblCode:'كود المنتج', lblCompany:'اسم الشركة',
      lblCategory:'الفئة', lblCategoryHint:'(يمكنك اختيار أكثر من فئة)', lblSection:'مكان الظهور',
      optMainText:'الرئيسية', optOffersText:'العروض', optLocalText:'المنتجات المحلية',
      lblPiece:'سعر القطعة', lblCarton:'سعر الكرتون', lblUnits:'عدد القطع في الكرتون',
      lblBarcode:'الباركود', lblDesc:'ملاحظات / تفاصيل',
      cancelBtn:'إلغاء', saveBtn:'حفظ', savingBtn:'جارٍ الحفظ...',
      newCatPlaceholder:'فئة جديدة...', pieceLabel:'سعر القطعة', cartonLabel:'كرتون',
      perCarton:'قطعة/كرتون', confirmDelete:'هل أنت متأكد من حذف هذا المنتج؟',
      emptyText:'لا توجد منتجات', noResults:'لا توجد نتائج', loadingText:'جارٍ التحميل...',
      lblCodeD:'كود المنتج', lblCompanyD:'اسم الشركة',
      lblPieceD:'سعر القطعة', lblCartonD:'سعر الكرتون', lblUnitsD:'قطعة/كرتون',
      lblCatD:'الفئة', lblBarcodeD:'الباركود', noBarcode:'غير متوفر', noCarton:'غير متوفر', noValue:'غير متوفر',
      uncategorized:'بدون فئة', currency:'د.ع',
      menuLoginText:'تسجيل الدخول', menuLogoutText:'تسجيل الخروج', loginTitle:'دخول المسؤول',
      lblEmail:'البريد الإلكتروني', lblPassword:'كلمة المرور', loginSubmitBtn:'تسجيل الدخول',
      loginError:'البريد الإلكتروني أو كلمة المرور غير صحيحة', pleaseLogin:'يرجى تسجيل الدخول أولاً',
      notConnected:'لا يوجد اتصال بقاعدة البيانات. يرجى تحديث الصفحة.',
      dbError:'حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.',
      errorPrefix:'حدث خطأ: ',
      filterTitle:'الفئات', filterSortTitle:'ترتيب حسب السعر',
      sortLowText:'الأقل سعراً', sortHighText:'الأعلى سعراً',
      filterResetBtn:'مسح', filterApplyBtn:'تطبيق',
      cartTitle:'سلة المشتريات', cartOrderText:'الطلب عبر واتساب', cartEmpty:'سلتك فارغة',
      addedToCart:'أُضيف إلى السلة', allCat:'الكل', detailAddCartText:'إضافة إلى السلة',
      waMsgHeader:'مرحباً، أريد طلب هذه المنتجات:', waMsgCode:'كود', waMsgName:'اسم', waMsgQty:'عدد',
      nameRequiredMsg:'الاسم وسعر القطعة مطلوبان', addingPending:'يرجى الانتظار، جارٍ حفظ المنتج...'
    },
    en: {
      dir:'rtl', brandName:'Koga',
      tabMainText:'Main', tabOffersText:'Offers', tabLocalText:'Local Products',
      searchPlaceholder:'Order...', menuLangText:'Change language', menuAddText:'Add product',
      menuInfoText:'Info', infoTitle:'Info',
      infoBody:'1- Dear customer, orders placed on the Koga website arrive within 3-5 days.\n2- To order a product or list a product, contact 07508457841',
      formTitleAdd:'Add product', formTitleEdit:'Edit product',
      lblImage:'Image link (URL)', imgPreviewText:'Image preview appears here',
      lblName:'Product name', lblCode:'Product code', lblCompany:'Company name',
      lblCategory:'Category', lblCategoryHint:'(you can pick more than one)', lblSection:'Show in',
      optMainText:'Main', optOffersText:'Offers', optLocalText:'Local Products',
      lblPiece:'Piece price', lblCarton:'Carton price', lblUnits:'Pieces per carton',
      lblBarcode:'Barcode', lblDesc:'Notes / details',
      cancelBtn:'Cancel', saveBtn:'Save', savingBtn:'Saving...',
      newCatPlaceholder:'New category...', pieceLabel:'piece price', cartonLabel:'Carton',
      perCarton:'pcs/carton', confirmDelete:'Delete this product?',
      emptyText:'No products', noResults:'No results found', loadingText:'Loading...',
      lblCodeD:'Product code', lblCompanyD:'Company name',
      lblPieceD:'Piece price', lblCartonD:'Carton price', lblUnitsD:'Pcs/carton',
      lblCatD:'Category', lblBarcodeD:'Barcode', noBarcode:'None', noCarton:'None', noValue:'None',
      uncategorized:'Uncategorized', currency:'IQD',
      menuLoginText:'Log in', menuLogoutText:'Log out', loginTitle:'Admin login',
      lblEmail:'Email', lblPassword:'Password', loginSubmitBtn:'Log in',
      loginError:'Incorrect email or password', pleaseLogin:'Please log in first',
      notConnected:'No connection to the database. Please refresh the page.',
      dbError:'A database connection error occurred. Please try again later.',
      errorPrefix:'An error occurred: ',
      filterTitle:'Categories', filterSortTitle:'Sort by price',
      sortLowText:'Lowest price', sortHighText:'Highest price',
      filterResetBtn:'Clear', filterApplyBtn:'Apply',
      cartTitle:'Cart', cartOrderText:'Order via WhatsApp', cartEmpty:'Your cart is empty',
      addedToCart:'Added to cart', allCat:'All', detailAddCartText:'Add to cart',
      waMsgHeader:'Hello, I would like to order these products:', waMsgCode:'Code', waMsgName:'Name', waMsgQty:'Qty',
      nameRequiredMsg:'Name and piece price are required', addingPending:'Please wait, the product is still being saved...'
    }
  };

  /* ============ State ============ */
  let lang = localStorage.getItem(K_LANG) || 'ku';
  if(!T[lang]) lang = 'ku';
  let currentSection = 'main';
  let searchTerm = '';
  let editingId = null;

  let productsCache = [];
  let productsLoaded = false;
  let categoriesCache = []; // custom admin-added category names (free text, legacy + extra)

  let filterState = { category: null, sort: null };
  let cart = loadCart();

  let isAdmin = false;
  let firebaseReady = false;
  let auth = null, db = null, productsRef = null, categoriesRef = null;

  function fmt(n){
    if(n === null || n === undefined || n === '') return null;
    return Number(n).toLocaleString('en-US');
  }
  /* Fisher-Yates shuffle, in place — used to randomize product display order. */
  function shuffleArray(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function escapeHtml(str){
    if(str === undefined || str === null) return '';
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* ============ Price helpers (supports raw strings like "$12.50") ============ */
  function priceDisplay(val){
    if(val === null || val === undefined || val === '') return null;
    if(typeof val === 'string'){
      if(/[$]/.test(val)) return val; // already carries its own currency symbol
      const num = parseFloat(val.replace(/,/g,''));
      if(!isNaN(num) && String(num) === val.trim().replace(/,/g,'')) return fmt(num) + ' ' + T[lang].currency;
      return val;
    }
    return fmt(val) + ' ' + T[lang].currency;
  }
  function priceNumeric(val){
    if(val === null || val === undefined || val === '') return 0;
    if(typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g,'');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  /* ============ Cart (device-local, not shared) ============ */
  function loadCart(){
    try{
      const raw = localStorage.getItem(K_CART);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function saveCart(){
    localStorage.setItem(K_CART, JSON.stringify(cart));
    updateCartBadge();
  }
  function addToCart(product){
    const code = product.code || product.id;
    const unitPrice = priceNumeric(product.piecePrice);
    const existing = cart.find(i => i.code === code);
    if(existing){ existing.qty += 1; }
    else { cart.push({ code: code, name: product.name, qty: 1, price: unitPrice }); }
    saveCart();
    renderCartList();
  }
  function removeFromCart(code){
    cart = cart.filter(i => i.code !== code);
    saveCart();
    renderCartList();
  }
  function cartTotalAmount(){
    return cart.reduce((s,i) => s + (Number(i.price) || 0) * i.qty, 0);
  }
  function updateCartBadge(){
    const count = cart.reduce((s,i) => s + i.qty, 0);
    const badge = document.getElementById('cartBadge');
    if(count > 0){ badge.hidden = false; badge.textContent = count > 99 ? '99+' : String(count); }
    else { badge.hidden = true; }

    const totalEl = document.getElementById('cartTotal');
    const total = cartTotalAmount();
    if(total > 0){
      totalEl.hidden = false;
      totalEl.textContent = fmt(total) + ' ' + T[lang].currency;
    } else {
      totalEl.hidden = true;
    }
  }

  /* ============ i18n apply ============ */
  function applyLang(){
    const dict = T[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';
    const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    setText('brandName', dict.brandName);
    setText('tabMainText', dict.tabMainText);
    setText('tabOffersText', dict.tabOffersText);
    setText('tabLocalText', dict.tabLocalText);
    document.getElementById('searchInput').placeholder = dict.searchPlaceholder;
    setText('menuLangText', dict.menuLangText);
    setText('menuInfoText', dict.menuInfoText);
    setText('infoTitle', dict.infoTitle);
    setText('menuLoginText', dict.menuLoginText);
    setText('menuLogoutText', dict.menuLogoutText);
    setText('loginTitle', dict.loginTitle);
    setText('lblEmail', dict.lblEmail);
    setText('lblPassword', dict.lblPassword);
    setText('loginSubmitBtn', dict.loginSubmitBtn);
    setText('menuAddText', dict.menuAddText);
    document.getElementById('lblImage').innerHTML = dict.lblImage;
    document.getElementById('imgPreview').textContent = dict.imgPreviewText;
    document.getElementById('lblName').innerHTML = dict.lblName + ' <span class="req">*</span>';
    setText('lblCode', dict.lblCode);
    setText('lblCompany', dict.lblCompany);
    document.getElementById('lblCategory').innerHTML = dict.lblCategory + ' <span class="hint" id="lblCategoryHint">' + dict.lblCategoryHint + '</span>';
    setText('lblSection', dict.lblSection);
    setText('optMainText', dict.optMainText);
    setText('optOffersText', dict.optOffersText);
    setText('optLocalText', dict.optLocalText);
    document.getElementById('lblPiece').innerHTML = dict.lblPiece + ' <span class="req">*</span>';
    setText('lblCarton', dict.lblCarton);
    setText('lblUnits', dict.lblUnits);
    setText('lblBarcode', dict.lblBarcode);
    setText('lblDesc', dict.lblDesc);
    setText('cancelBtn', dict.cancelBtn);
    setText('loginCancelBtn', dict.cancelBtn);
    setText('saveBtn', dict.saveBtn);
    setText('lblCodeD', dict.lblCodeD);
    setText('lblCompanyD', dict.lblCompanyD);
    setText('lblPieceD', dict.lblPieceD);
    setText('lblCartonD', dict.lblCartonD);
    setText('lblUnitsD', dict.lblUnitsD);
    setText('lblCatD', dict.lblCatD);
    setText('lblBarcodeD', dict.lblBarcodeD);
    setText('detailAddCartText', dict.detailAddCartText);
    document.getElementById('newCatInput').placeholder = dict.newCatPlaceholder;
    setText('filterTitle', dict.filterTitle);
    setText('filterSortTitle', dict.filterSortTitle);
    setText('sortLowText', dict.sortLowText);
    setText('sortHighText', dict.sortHighText);
    setText('filterResetBtn', dict.filterResetBtn);
    setText('filterApplyBtn', dict.filterApplyBtn);
    setText('cartTitle', dict.cartTitle);
    setText('cartOrderText', dict.cartOrderText);
    document.querySelectorAll('#langOptions button').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    localStorage.setItem(K_LANG, lang);
    renderCatScroll();
    renderFilterCats();
  }

  /* ============ Category rendering (nav scroller + filter modal + form chips) ============ */
  function renderCatScroll(){
    const dict = T[lang];
    const wrap = document.getElementById('catScroll');
    let html = `<button class="cat-chip ${!filterState.category ? 'active' : ''}" data-cat="">${dict.allCat}</button>`;
    html += CATEGORIES.map(c => `<button class="cat-chip ${filterState.category === c.id ? 'active' : ''}" data-cat="${c.id}"><span class="emo">${c.icon}</span>${catLabel(c)}</button>`).join('');
    wrap.innerHTML = html;
    wrap.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cat');
        filterState.category = id || null;
        renderCatScroll();
        renderFilterCats();
        updateFilterDot();
        renderGrid();
      });
    });
  }
  function renderFilterCats(){
    const wrap = document.getElementById('filterCats');
    wrap.innerHTML = CATEGORIES.map(c => `<button type="button" class="chip ${filterState.category === c.id ? 'selected' : ''}" data-cat="${c.id}"><span>${c.icon}</span>${catLabel(c)}</button>`).join('');
    wrap.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cat');
        filterState.category = (filterState.category === id) ? null : id;
        renderFilterCats();
        renderCatScroll();
      });
    });
    document.querySelectorAll('.sort-opt').forEach(btn => {
      btn.classList.toggle('selected', btn.getAttribute('data-sort') === filterState.sort);
    });
  }
  function updateFilterDot(){
    const dot = document.getElementById('filterDot');
    dot.hidden = !(filterState.category || filterState.sort);
  }

  function renderFormCategoryChips(selected){
    selected = selected || [];
    const wrap = document.getElementById('fCategories');
    const fixedHtml = CATEGORIES.map(c => `<button type="button" class="chip ${selected.includes(c.id) ? 'selected' : ''}" data-cat="${c.id}"><span>${c.icon}</span>${catLabel(c)}</button>`).join('');
    const customOnes = categoriesCache.filter(name => !CATEGORIES.some(c => c.id === name));
    const customHtml = customOnes.map(name => `<button type="button" class="chip ${selected.includes(name) ? 'selected' : ''}" data-cat="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('');
    wrap.innerHTML = fixedHtml + customHtml;
    wrap.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('selected'));
    });
  }
  function getSelectedFormCategories(){
    return Array.from(document.querySelectorAll('#fCategories .chip.selected')).map(b => b.getAttribute('data-cat'));
  }

  /* ============ Rendering products ============ */
  function categoryDisplayNames(p){
    const ids = p.categories && p.categories.length ? p.categories : (p.category ? [p.category] : []);
    if(!ids.length) return T[lang].uncategorized;
    return ids.map(id => { const c = findCat(id); return c ? catLabel(c) : id; }).join('، ');
  }

  function renderGrid(){
    const dict = T[lang];
    const grid = document.getElementById('grid');

    if(!firebaseReady && productsLoaded){
      grid.innerHTML = `<div class="empty-state"><p>${dict.dbError}</p></div>`;
      return;
    }
    if(!productsLoaded){
      grid.innerHTML = `<div class="empty-state"><p>${dict.loadingText}</p></div>`;
      return;
    }

    let list = productsCache.filter(p => p.section === currentSection);

    if(filterState.category){
      list = list.filter(p => {
        const ids = p.categories && p.categories.length ? p.categories : (p.category ? [p.category] : []);
        return ids.includes(filterState.category);
      });
    }
    if(searchTerm.trim()){
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.code || '').toLowerCase().includes(q) ||
        (p.company || '').toLowerCase().includes(q)
      );
    }
    if(filterState.sort === 'low'){
      list = [...list].sort((a,b) => priceNumeric(a.piecePrice) - priceNumeric(b.piecePrice));
    } else if(filterState.sort === 'high'){
      list = [...list].sort((a,b) => priceNumeric(b.piecePrice) - priceNumeric(a.piecePrice));
    }

    if(list.length === 0){
      grid.innerHTML = `<div class="empty-state">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 21V13h6v8"/></svg>
        <p>${(searchTerm.trim() || filterState.category) ? dict.noResults : dict.emptyText}</p>
      </div>`;
      return;
    }
    grid.innerHTML = list.map(p => cardHtml(p, dict)).join('');
    grid.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => openDetail(el.getAttribute('data-view')));
    });
    grid.querySelectorAll('[data-edit]').forEach(el => {
      el.addEventListener('click', (e) => { e.stopPropagation(); openForm(el.getAttribute('data-edit')); });
    });
    grid.querySelectorAll('[data-delete]').forEach(el => {
      el.addEventListener('click', (e) => { e.stopPropagation(); deleteProduct(el.getAttribute('data-delete')); });
    });
    grid.querySelectorAll('[data-addcart]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = productsCache.find(x => x.id === el.getAttribute('data-addcart'));
        if(p) addToCart(p);
      });
    });
  }

  function cardHtml(p, dict){
    const cartonTxt = priceDisplay(p.cartonPrice) || dict.noCarton;
    const badge = p.units ? `<div class="card-badge">${p.units}<br>${dict.perCarton}</div>` : '';
    const barcodeBlock = p.barcode ? `
      <div class="barcode-wrap">
        <div class="barcode-bars"></div>
        <div class="barcode-num">${escapeHtml(p.barcode)}</div>
      </div>` : '';
    const img = p.image ? escapeHtml(p.image) : '';
    const codeBlock = p.code ? `<div class="card-code">#${escapeHtml(p.code)}</div>` : '';
    const adminBlock = isAdmin ? `
        <div class="card-actions">
          <button class="mini-btn edit" data-edit="${p.id}" aria-label="edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="mini-btn delete" data-delete="${p.id}" aria-label="delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>` : '';
    const cartBtn = `<button class="mini-btn cart" data-addcart="${p.id}" aria-label="add to cart">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </button>`;
    return `
    <div class="card ${p.section === 'offers' ? 'is-offer' : ''}">
      <div class="card-media" data-view="${p.id}">
        <img src="${img}" alt="${escapeHtml(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="handleImgError(this)">
        ${adminBlock}
        ${cartBtn}
        ${badge}
      </div>
      <div class="card-body" data-view="${p.id}">
        ${codeBlock}
        <div class="card-title">${escapeHtml(p.name)}</div>
        <div class="price-main">${priceDisplay(p.piecePrice)} <span class="label">${dict.pieceLabel}</span></div>
        <div class="price-carton"><span>${dict.cartonLabel}:</span> ${cartonTxt}</div>
        ${barcodeBlock}
      </div>
    </div>`;
  }

  /* ============ Detail modal ============ */
  let detailProductId = null;
  function openDetail(id){
    const p = productsCache.find(x => x.id === id);
    if(!p) return;
    detailProductId = id;
    const dict = T[lang];
    const detailImgEl = document.getElementById('detailImg');
    detailImgEl.onerror = () => handleImgError(detailImgEl);
    detailImgEl.src = p.image || '';
    document.getElementById('detailName').textContent = p.name;
    document.getElementById('detailCode').textContent = p.code || dict.noValue;
    document.getElementById('detailCompany').textContent = p.company || dict.noValue;
    document.getElementById('detailPiece').textContent = priceDisplay(p.piecePrice) || dict.noValue;
    document.getElementById('detailCarton').textContent = priceDisplay(p.cartonPrice) || dict.noCarton;
    document.getElementById('detailUnits').textContent = p.units || dict.noCarton;
    document.getElementById('detailCat').textContent = categoryDisplayNames(p);
    document.getElementById('detailBarcode').textContent = p.barcode || dict.noBarcode;
    document.getElementById('detailDesc').textContent = p.desc || '';
    document.getElementById('detailOverlay').classList.add('open');
  }
  document.getElementById('detailClose').addEventListener('click', () => {
    document.getElementById('detailOverlay').classList.remove('open');
  });
  document.getElementById('detailOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'detailOverlay') document.getElementById('detailOverlay').classList.remove('open');
  });
  document.getElementById('detailAddCart').addEventListener('click', () => {
    const p = productsCache.find(x => x.id === detailProductId);
    if(p) addToCart(p);
  });

  /* ============ Filter modal ============ */
  document.getElementById('filterBtn').addEventListener('click', () => {
    renderFilterCats();
    document.getElementById('filterOverlay').classList.add('open');
  });
  document.getElementById('filterClose').addEventListener('click', () => {
    document.getElementById('filterOverlay').classList.remove('open');
  });
  document.getElementById('filterOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'filterOverlay') document.getElementById('filterOverlay').classList.remove('open');
  });
  document.querySelectorAll('.sort-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-sort');
      filterState.sort = (filterState.sort === val) ? null : val;
      renderFilterCats();
    });
  });
  document.getElementById('filterResetBtn').addEventListener('click', () => {
    filterState = { category: null, sort: null };
    renderFilterCats();
    renderCatScroll();
    updateFilterDot();
    renderGrid();
    document.getElementById('filterOverlay').classList.remove('open');
  });
  document.getElementById('filterApplyBtn').addEventListener('click', () => {
    updateFilterDot();
    renderGrid();
    document.getElementById('filterOverlay').classList.remove('open');
  });

  /* ============ Cart modal ============ */
  function renderCartList(){
    const dict = T[lang];
    const wrap = document.getElementById('cartList');
    if(cart.length === 0){
      wrap.innerHTML = `<div class="cart-empty">${dict.cartEmpty}</div>`;
      document.getElementById('cartOrderBtn').disabled = true;
      return;
    }
    document.getElementById('cartOrderBtn').disabled = false;
    wrap.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-code">#${escapeHtml(item.code)}</div>
        </div>
        <div class="cart-item-qty">x${item.qty}</div>
        <button class="cart-item-remove" data-remove="${escapeHtml(item.code)}" aria-label="remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
    wrap.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-remove')));
    });
  }
  document.getElementById('cartBtn').addEventListener('click', () => {
    renderCartList();
    document.getElementById('cartOverlay').classList.add('open');
  });
  document.getElementById('cartClose').addEventListener('click', () => {
    document.getElementById('cartOverlay').classList.remove('open');
  });
  document.getElementById('cartOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'cartOverlay') document.getElementById('cartOverlay').classList.remove('open');
  });
  document.getElementById('cartOrderBtn').addEventListener('click', () => {
    if(cart.length === 0) return;
    const dict = T[lang];
    const lines = cart.map(i => `${dict.waMsgCode}: ${i.code} - ${dict.waMsgName}: ${i.name} (${dict.waMsgQty}: ${i.qty})`);
    const message = dict.waMsgHeader + '\n' + lines.join('\n');
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener');
  });

  /* ============ Form modal (Add/Edit) — admin-only ============ */
  function openForm(id){
    if(!isAdmin){
      alert(T[lang].pleaseLogin);
      return;
    }
    if(id && String(id).indexOf('temp_') === 0){
      alert(T[lang].addingPending);
      return;
    }
    editingId = id || null;
    const dict = T[lang];
    document.getElementById('formTitle').textContent = editingId ? dict.formTitleEdit : dict.formTitleAdd;
    const form = document.getElementById('productForm');
    form.reset();
    renderFormCategoryChips([]);
    setSection('main');
    document.getElementById('imgPreview').innerHTML = dict.imgPreviewText;

    if(editingId){
      const p = productsCache.find(x => x.id === editingId);
      if(p){
        document.getElementById('fImage').value = p.image || '';
        document.getElementById('fName').value = p.name || '';
        document.getElementById('fCode').value = p.code || '';
        document.getElementById('fCompany').value = p.company || '';
        const selCats = p.categories && p.categories.length ? p.categories : (p.category ? [p.category] : []);
        renderFormCategoryChips(selCats);
        setSection(p.section || 'main');
        document.getElementById('fPiece').value = p.piecePrice ?? '';
        document.getElementById('fCarton').value = p.cartonPrice ?? '';
        document.getElementById('fUnits').value = p.units ?? '';
        document.getElementById('fBarcode').value = p.barcode || '';
        document.getElementById('fDesc').value = p.desc || '';
        updateImgPreview();
      }
    }
    document.getElementById('formOverlay').classList.add('open');
  }
  function closeForm(){
    document.getElementById('formOverlay').classList.remove('open');
    editingId = null;
  }
  document.getElementById('formClose').addEventListener('click', closeForm);
  document.getElementById('cancelBtn').addEventListener('click', closeForm);
  document.getElementById('formOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'formOverlay') closeForm();
  });

  function setSection(val){
    const opts = { main: document.getElementById('optMain'), offers: document.getElementById('optOffers'), local: document.getElementById('optLocal') };
    Object.keys(opts).forEach(key => {
      opts[key].classList.toggle('selected', key === val);
      opts[key].querySelector('input').checked = key === val;
    });
  }
  document.getElementById('optMain').addEventListener('click', () => setSection('main'));
  document.getElementById('optOffers').addEventListener('click', () => setSection('offers'));
  document.getElementById('optLocal').addEventListener('click', () => setSection('local'));

  function updateImgPreview(){
    const raw = document.getElementById('fImage').value.trim();
    const url = normalizeImageUrl(raw);
    const box = document.getElementById('imgPreview');
    const dict = T[lang];
    if(url){
      box.innerHTML = `<img src="${escapeHtml(url)}" referrerpolicy="no-referrer" onerror="handleImgError(this)">`;
    } else {
      box.textContent = dict.imgPreviewText;
    }
  }
  document.getElementById('fImage').addEventListener('input', updateImgPreview);

  document.getElementById('addCatBtn').addEventListener('click', async () => {
    const dict = T[lang];
    if(!firebaseReady){ alert(dict.notConnected); return; }
    const input = document.getElementById('newCatInput');
    const name = input.value.trim();
    if(!name) return;
    const addCatBtn = document.getElementById('addCatBtn');
    addCatBtn.disabled = true;
    try{
      const currentSelection = getSelectedFormCategories();
      await addCategoryToDb(name);
      if(!categoriesCache.includes(name)) categoriesCache = [...categoriesCache, name];
      renderFormCategoryChips([...currentSelection, name]);
      input.value = '';
    }catch(err){
      alert(dict.errorPrefix + err.message);
    }finally{
      addCatBtn.disabled = false;
    }
  });

  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = T[lang];
    if(!isAdmin){ alert(dict.pleaseLogin); return; }
    if(!firebaseReady){ alert(dict.notConnected); return; }

    const section = document.querySelector('input[name="section"]:checked').value;
    const piece = document.getElementById('fPiece').value.trim();
    const carton = document.getElementById('fCarton').value.trim();
    const data = {
      name: document.getElementById('fName').value.trim(),
      image: normalizeImageUrl(document.getElementById('fImage').value.trim()),
      code: document.getElementById('fCode').value.trim(),
      company: document.getElementById('fCompany').value.trim(),
      categories: getSelectedFormCategories(),
      section: section,
      piecePrice: piece,
      cartonPrice: carton || null,
      units: document.getElementById('fUnits').value ? Number(document.getElementById('fUnits').value) : null,
      barcode: document.getElementById('fBarcode').value.trim(),
      desc: document.getElementById('fDesc').value.trim()
    };

    if(!data.name || !data.piecePrice){
      alert(dict.errorPrefix + dict.nameRequiredMsg);
      return;
    }

    const isEditing = !!editingId;
    const targetId = editingId;
    let previousEntry = null;
    let tempId = null;

    if(isEditing){
      const idx = productsCache.findIndex(p => p.id === targetId);
      if(idx > -1){
        previousEntry = { ...productsCache[idx] };
        productsCache = productsCache.map(p => p.id === targetId ? { ...p, ...data } : p);
      }
    } else {
      tempId = 'temp_' + Date.now() + '_' + Math.random().toString(16).slice(2);
      productsCache = [{ id: tempId, ...data }, ...productsCache];
    }
    setActiveTab(section);
    closeForm();

    const request = isEditing ? updateProductInDb(targetId, data) : addProductToDb(data);
    request.catch((err) => {
      if(isEditing && previousEntry){
        productsCache = productsCache.map(p => p.id === targetId ? previousEntry : p);
      } else if(tempId){
        productsCache = productsCache.filter(p => p.id !== tempId);
      }
      renderGrid();
      alert(dict.errorPrefix + err.message);
    });
  });

  async function deleteProduct(id){
    const dict = T[lang];
    if(!isAdmin){ alert(dict.pleaseLogin); return; }
    if(!firebaseReady){ alert(dict.notConnected); return; }
    if(String(id).indexOf('temp_') === 0){ alert(dict.addingPending); return; }
    if(!confirm(dict.confirmDelete)) return;
    try{
      await deleteProductFromDb(id);
    }catch(err){
      alert(dict.errorPrefix + err.message);
    }
  }

  /* ============ Tabs ============ */
  function setActiveTab(section){
    currentSection = section;
    document.getElementById('tabMain').classList.toggle('active', section === 'main');
    document.getElementById('tabOffers').classList.toggle('active', section === 'offers');
    document.getElementById('tabLocal').classList.toggle('active', section === 'local');
    renderGrid();
  }
  document.getElementById('tabMain').addEventListener('click', () => {
    shuffleArray(productsCache); // fresh random order each time Main/Home is (re)visited
    setActiveTab('main');
  });
  document.getElementById('tabOffers').addEventListener('click', () => setActiveTab('offers'));
  document.getElementById('tabLocal').addEventListener('click', () => setActiveTab('local'));

  /* ============ Search ============ */
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderGrid();
  });

  /* ============ Dropdown menu ============ */
  const menuBtn = document.getElementById('menuBtn');
  const dropdown = document.getElementById('dropdown');
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if(!dropdown.contains(e.target) && e.target !== menuBtn){
      dropdown.classList.remove('open');
    }
  });
  document.getElementById('menuAdd').addEventListener('click', () => {
    dropdown.classList.remove('open');
    openForm(null);
  });
  document.getElementById('menuLang').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('langOptions').classList.toggle('open-inline');
  });
  document.querySelectorAll('#langOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
      lang = btn.getAttribute('data-lang');
      dropdown.classList.remove('open');
      applyLang();
      renderGrid();
      renderCartList();
      updateCartBadge();
    });
  });
  document.getElementById('menuInfo').addEventListener('click', () => {
    dropdown.classList.remove('open');
    document.getElementById('infoText').textContent = T[lang].infoBody;
    document.getElementById('infoOverlay').classList.add('open');
  });
  document.getElementById('infoClose').addEventListener('click', () => {
    document.getElementById('infoOverlay').classList.remove('open');
  });
  document.getElementById('infoOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'infoOverlay') document.getElementById('infoOverlay').classList.remove('open');
  });

  /* ============ Admin auth UI ============ */
  function updateAuthUI(){
    document.getElementById('menuAdd').style.display = isAdmin ? 'flex' : 'none';
    document.getElementById('menuLogin').style.display = isAdmin ? 'none' : 'flex';
    document.getElementById('menuLogout').style.display = isAdmin ? 'flex' : 'none';
  }

  /* ============ Admin login / logout ============ */
  function closeLoginModal(){
    document.getElementById('loginOverlay').classList.remove('open');
    document.getElementById('loginForm').reset();
  }
  document.getElementById('menuLogin').addEventListener('click', () => {
    dropdown.classList.remove('open');
    document.getElementById('loginOverlay').classList.add('open');
  });
  document.getElementById('menuLogout').addEventListener('click', () => {
    dropdown.classList.remove('open');
    if(!firebaseReady){ alert(T[lang].notConnected); return; }
    auth.signOut();
  });
  document.getElementById('loginClose').addEventListener('click', closeLoginModal);
  document.getElementById('loginCancelBtn').addEventListener('click', closeLoginModal);
  document.getElementById('loginOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'loginOverlay') closeLoginModal();
  });
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = T[lang];
    if(!firebaseReady){ alert(dict.notConnected); return; }
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginSubmitBtn');
    btn.disabled = true;
    auth.signInWithEmailAndPassword(email, password)
      .then(() => { closeLoginModal(); })
      .catch((err) => {
        console.error('Login error:', err);
        alert(dict.loginError);
      })
      .finally(() => { btn.disabled = false; });
  });

  /* ==========================================================
     FIREBASE SETUP — Realtime Database + Authentication
     Live project: jwmla-website (kept as-is; only the UI/brand changed).
  ========================================================== */
  const firebaseConfig = {
    apiKey: "AIzaSyAwi7IjiTy4iSkv03hgfT5CUR6L8OkHGek",
    authDomain: "jwmla-website.firebaseapp.com",
    databaseURL: "https://jwmla-website-default-rtdb.firebaseio.com",
    projectId: "jwmla-website",
    storageBucket: "jwmla-website.firebasestorage.app",
    messagingSenderId: "395127164111",
    appId: "1:395127164111:web:0c6431809f28ca8591bbba"
  };

  try{
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.database();
    productsRef = db.ref('products');
    categoriesRef = db.ref('categories');
    firebaseReady = true;

    auth.onAuthStateChanged((user) => {
      isAdmin = !!user;
      updateAuthUI();
      renderGrid();
    });

    productsRef.on('value', (snapshot) => {
      const val = snapshot.val() || {};
      const docs = Object.keys(val).map(key => ({ id: key, ...val[key] }));
      // Random order on every load/refresh (per product requirement) instead of
      // a fixed newest-first sort — shuffled fresh each time this listener fires.
      shuffleArray(docs);
      productsCache = docs;
      productsLoaded = true;
      renderGrid();
    }, (err) => {
      console.error('Realtime Database products error:', err);
      productsLoaded = true;
      renderGrid();
    });

    categoriesRef.on('value', (snapshot) => {
      const val = snapshot.val() || {};
      categoriesCache = Object.values(val);
    }, (err) => {
      console.error('Realtime Database categories error:', err);
    });
  }catch(err){
    console.error('Firebase failed to initialize:', err);
    firebaseReady = false;
    productsLoaded = true;
    renderGrid();
  }

  /* ============ Realtime Database: write helpers ============ */
  function addProductToDb(data){
    return productsRef.push({
      ...data,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  }
  function updateProductInDb(id, data){
    return productsRef.child(id).update(data);
  }
  function deleteProductFromDb(id){
    return productsRef.child(id).remove();
  }
  function addCategoryToDb(name){
    const safeKey = name.replace(/[.#$\[\]/]/g, '_');
    return categoriesRef.child(safeKey).set(name);
  }

  /* ============ Auto-sliding banner carousel ============ */
  function initCarousel(){
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    const slides = track ? track.querySelectorAll('.carousel-slide') : [];
    if(!track || slides.length === 0) return;

    let index = 0;
    let timer = null;

    dotsWrap.innerHTML = Array.from(slides).map((_, i) =>
      `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="slide ${i + 1}"></button>`
    ).join('');
    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    function goTo(i){
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }
    function next(){ goTo(index + 1); }
    function startAuto(){
      stopAuto();
      timer = setInterval(next, 4000);
    }
    function stopAuto(){
      if(timer){ clearInterval(timer); timer = null; }
    }
    dots.forEach(d => {
      d.addEventListener('click', () => {
        goTo(Number(d.getAttribute('data-slide')));
        startAuto(); // restart the timer so it doesn't jump right after a manual pick
      });
    });
    // RTL layout mirrors the X axis, so slides need to travel the opposite
    // direction to move visually forward in a right-to-left interface.
    track.style.direction = 'ltr';

    goTo(0);
    startAuto();
  }

  /* ============ Init ============ */
  applyLang();
  updateCartBadge();
  setActiveTab('main');
  renderGrid();
  initCarousel();
})();
