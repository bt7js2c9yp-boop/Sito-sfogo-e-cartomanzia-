// Cookie banner: basic GDPR consent
(function(){
  function setConsent(val){
    try{ localStorage.setItem('cookie_consent', JSON.stringify(val)); }catch(e){}
    document.cookie = 'cookie_consent='+encodeURIComponent(JSON.stringify(val))+'; Path=/; Max-Age=' + (60*60*24*365) + ';';
  }
  function getConsent(){
    try{ const v = localStorage.getItem('cookie_consent'); if (v) return JSON.parse(v); const c = (document.cookie.split('; ').find(c=>c.startsWith('cookie_consent='))||'').split('=')[1]; return c ? JSON.parse(decodeURIComponent(c)) : null; }catch(e){return null}
  }
  function showBanner(){
    if (getConsent()) return;
    var div = document.createElement('div');
    div.className = 'cookie-banner';
    div.innerHTML = '<div class="text">Questo sito usa cookie per garantire la migliore esperienza e per scopi di pagamento e autenticazione. <a href="/privacy.html">Privacy</a> | <a href="/terms.html">Termini</a></div>'+
      '<div class="actions">'+
      '<button id="cb-accept">Accetta</button>'+
      '<button id="cb-decline">Rifiuta</button></div>';
    document.body.appendChild(div);
    document.getElementById('cb-accept').addEventListener('click', function(){ 
      const consent = { analytics: true, marketing: true };
      setConsent(consent);
      // send to server if logged in
      try{
        fetch('/api/gdpr/consent', { method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'same-origin', body: JSON.stringify({ consent }) }).catch(()=>{});
      }catch(e){}
      div.remove(); 
    });
    document.getElementById('cb-decline').addEventListener('click', function(){ 
      const consent = { analytics: false, marketing: false };
      setConsent(consent);
      try{
        fetch('/api/gdpr/consent', { method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'same-origin', body: JSON.stringify({ consent }) }).catch(()=>{});
      }catch(e){}
      div.remove(); 
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner); else showBanner();
})();
