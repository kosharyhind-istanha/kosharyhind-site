(function () {
  var nf = function (n) { return Number(n).toLocaleString('ar-EG'); };
  var app = document.getElementById('app');
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  fetch('/content/menu.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (m) {
    var cats = m.categories, total = cats.reduce(function (n, c) { return n + c.items.length; }, 0);
    var cat = 'all', q = '';
    var hero = el('header', 'hero');
    var logo = el('img', 'logo'); logo.src = '/images/logo.jpg'; logo.alt = 'شعار كشري هند';
    hero.append(logo, el('div', 'brand', m.name), el('div', 'sub', 'منيو المحل، ' + nf(total) + ' صنف'));
    var shots = el('div', 'shots');
    [['/images/koshary.jpg', 'كشري'], ['/images/tagen-meat.jpg', 'طاجن لحمة'], ['/images/tagen-chicken.jpg', 'طاجن فراخ']].forEach(function (s) {
      var f = el('figure'), i = el('img'); i.src = s[0]; i.alt = s[1]; i.loading = 'lazy'; f.append(i, el('figcaption', null, s[1])); shots.append(f);
    });
    var search = el('input', 'search'); search.type = 'search'; search.placeholder = 'دوّر على صنف…'; search.setAttribute('aria-label', 'بحث في المنيو');
    var chips = el('div', 'chips'); chips.setAttribute('role', 'tablist');
    var body = el('div');
    function chip(id, title) { var b = el('button', id === cat ? 'on' : '', title); b.type = 'button'; b.onclick = function () { cat = id; draw(); }; return b; }
    function draw() {
      chips.replaceChildren(chip('all', 'الكل')); cats.forEach(function (c) { chips.append(chip(c.id, c.title)); });
      body.replaceChildren(); var any = false, qq = q.trim();
      cats.forEach(function (c) {
        if (cat !== 'all' && c.id !== cat) return;
        var items = c.items.filter(function (i) { return !qq || (i.name + (i.desc || '')).indexOf(qq) >= 0; });
        if (!items.length) return; any = true;
        var s = el('section', 'sec ' + c.tone); s.append(el('h2', 'h', c.title));
        if (c.note) s.append(el('p', 'note', c.note));
        if (c.illus && c.illus.src) {
          var f = el('figure', 'illus'), im = el('img'); im.src = c.illus.src; im.alt = c.illus.alt || ''; im.loading = 'lazy'; f.append(im);
          if (!c.illus.own) f.append(el('span', 'badge', 'صورة توضيحية، مش من المحل')); s.append(f);
        }
        var ul = el('ul', 'list');
        items.forEach(function (it) {
          var li = el('li', 'item'); li.append(el('div', 'dot', nf(c.items.indexOf(it) + 1)));
          var info = el('div', 'info'); info.append(el('div', 'name', it.name)); if (it.desc) info.append(el('div', 'desc', it.desc));
          var pr = el('div', 'prices');
          it.prices.forEach(function (p) {
            var d = el('div', 'price'); if (p.from) d.append(el('span', 'from', 'يبدأ من')); if (p.label) d.append(el('span', 'size', p.label));
            d.append(el('b', null, nf(p.value)), el('span', 'cur', 'جنيه')); pr.append(d);
          });
          li.append(info, pr); ul.append(li);
        });
        s.append(ul); body.append(s);
      });
      if (!any) body.append(el('p', 'empty', 'مفيش صنف بالاسم ده.'));
    }
    search.oninput = function () { q = search.value; draw(); };
    var contact = el('section', 'contact'); contact.append(el('h2', null, 'للطلب والاستفسار'));
    var ph = el('div', 'phones'); m.phones.forEach(function (p) { var a = el('a', null, p); a.href = 'tel:' + p; ph.append(a); });
    contact.append(ph, el('p', 'addr', m.address));
    var credit = el('p', 'credit', 'الصورة التوضيحية: «سندوتشات كبدة» بعدسة Dalia fathallah، من ويكيميديا كومنز بترخيص CC BY-SA 4.0 (commons.wikimedia.org).');
    app.append(hero, shots, el('p', 'credit', 'الصور من فلاير المحل الدعائي.'), search, chips, body, contact, credit);
    draw();
  }).catch(function () { app.textContent = 'تعذّر تحميل المنيو.'; });
})();
