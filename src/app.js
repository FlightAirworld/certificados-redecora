(function () {
  var C = window.CFG;
  if (!C) return;
  var H = { apikey: C.sbKey, Authorization: 'Bearer ' + C.sbKey, 'Content-Type': 'application/json' };
  var API = C.sbUrl + '/rest/v1/certificados';
  var $ = function (id) { return document.getElementById(id); };

  // Crear certificado
  var f = $('f');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = $('nombre').value.trim().replace(/\s+/g, ' ');
      var msg = $('msg'), btn = f.querySelector('button');
      msg.textContent = '';
      if (nombre.length < 2 || nombre.length > 40) { msg.textContent = 'Escribe un nombre de 2 a 40 caracteres.'; return; }
      btn.disabled = true; btn.textContent = 'Creando…';
      fetch(API, {
        method: 'POST',
        headers: Object.assign({ Prefer: 'return=representation' }, H),
        body: JSON.stringify({ nombre: nombre, mundo: f.getAttribute('data-mundo') })
      }).then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      }).then(function (rows) {
        var row = Array.isArray(rows) ? rows[0] : rows;
        if (!row || !row.id) throw new Error('sin id');
        location.href = '/c/?id=' + encodeURIComponent(row.id);
      }).catch(function () {
        msg.textContent = 'No se pudo crear el certificado. Inténtalo de nuevo en unos segundos.';
        btn.disabled = false; btn.textContent = 'Obtener mi certificado';
      });
    });
  }

  // Mostrar certificado
  if ($('cert')) {
    var id = (new URLSearchParams(location.search).get('id') || '').replace(/[^a-z0-9]/gi, '');
    var st = $('status');
    if (!id) { st.textContent = 'Certificado no encontrado.'; return; }
    fetch(API + '?id=eq.' + encodeURIComponent(id) + '&select=id,nombre,mundo,created_at', { headers: H })
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        var row = rows && rows[0];
        if (!row) { st.textContent = 'Certificado no encontrado.'; return; }
        var w = C.worlds.filter(function (x) { return x.slug === row.mundo; })[0] || C.worlds[0];
        document.querySelector('.wrap').style.setProperty('--c1', w.c1);
        document.querySelector('.wrap').style.setProperty('--c2', w.c2);
        $('c-emoji').textContent = w.emoji;
        $('c-mundo').textContent = 'Terreno en ' + w.name;
        $('c-nombre').textContent = row.nombre;
        $('c-id').textContent = 'Nº ' + row.id.toUpperCase();
        $('c-fecha').textContent = new Date(row.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        document.title = row.nombre + ' tiene un terreno en ' + w.name;
        st.hidden = true; $('cert').hidden = false; $('actions').hidden = false;

        var url = location.origin + '/c/?id=' + row.id;
        var text = row.nombre + ' tiene un terreno en ' + w.name + '. Consigue el tuyo gratis:';
        $('b-wa').href = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url);
        $('b-print').onclick = function () { window.print(); };
        $('b-copy').onclick = function () {
          var done = function () { $('b-copy').textContent = '¡Copiado!'; };
          if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('Copia el enlace:', url); });
          else prompt('Copia el enlace:', url);
        };
        $('b-share').onclick = function () {
          if (navigator.share) navigator.share({ title: document.title, text: text, url: url }).catch(function () {});
          else $('b-copy').click();
        };
      })
      .catch(function () { st.textContent = 'No se pudo cargar el certificado.'; });
  }
})();
