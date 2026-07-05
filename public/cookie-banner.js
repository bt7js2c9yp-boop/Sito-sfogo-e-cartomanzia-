// Cookie banner: basic GDPR consent
(function(){
  function setConsent(val){
    try{ localStorage.setItem('cookie_consent', val); }catch(e){}
    document.cookie = 'cookie_consent='+val+'; Path=/; Max-Age=' + (60*60*24*365) + ';';
  }
  function getConsent(){
    try{ return localStorage.getItem('cookie_consent') || (document.cookie.split('; ').find(c=>c.startsWith('cookie_consent='))||'').split('=')[1]; }catch(e){return null}
  }
  function showBanner(){
    if (getConsent()) return;
    var div = document.createElement('div');
    div.className = 'cookie-banner';
    div.innerHTML = '<div class="text">Questo sito usa cookie per garantire la migliore esperienza e per scopi di pagamento e autenticazione. <a href="/privacy.html">Privacy</a> | <a href="/terms.html">Termini</a></div>'+
      '<div class="actions">'<
      + 'button id="cb-accept">Accetta</button>'+
      '<button id="cb-decline">Rifiuta</button></div>';
    document.body.appendChild(div);
    document.getElementById('cb-accept').addEventListener('click', function(){ setConsent('yes'); div.remove(); });
    document.getElementById('cb-decline').addEventListener('click', function(){ setConsent('no'); div.remove(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner); else showBanner();
})();
