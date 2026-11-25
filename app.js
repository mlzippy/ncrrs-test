
(() => {
  const $ = id => document.getElementById(id);
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if ($('club-results')) {
    function render() {
      const q = $('search').value.trim().toLowerCase();
      const rows = (window.NCRRS_CLUBS || []).filter(c =>
        `${c.name} ${c.city} ${c.call}`.toLowerCase().includes(q) &&
        ($('affiliation').value === 'all' || c.affiliated === ($('affiliation').value === 'yes')) &&
        ($('origin').value === 'all' || c.origin === 'State report'));
      $('result-count').textContent = `${rows.length} of ${window.NCRRS_CLUBS.length} research entries`;
      $('club-results').innerHTML = rows.map(c => `<article class="club"><h2>${escape(c.name)}</h2><p>${escape(c.city)}${c.call && !/not|unknown/i.test(c.call) ? ' · '+escape(c.call) : ''}</p><span class="badge ${c.affiliated ? '' : 'unknown'}">${c.affiliated ? 'ARRL listed' : 'ARRL affiliation not confirmed'}</span><p>${escape(c.origin)} · Activity unconfirmed</p><a class="source-link" href="${escape(c.source)}">${c.source.includes('arrl.org') ? 'View ARRL source listing' : 'View NC nonprofit report source'}</a></article>`).join('') || '<p class="empty">No entries match those filters. Try another name or location, or clear the filters.</p>';
    }
    ['search','affiliation','origin'].forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', render));
    $('reset').addEventListener('click', () => { $('search').value=''; $('affiliation').value='all'; $('origin').value='all'; render(); $('search').focus(); });
    render();
  }
  if ($('request-form')) {
    const interest = new URLSearchParams(location.search).get('interest');
    if (['help','volunteer','club','correction'].includes(interest)) $('interest').value=interest;
    $('request-form').addEventListener('submit', event => {
      event.preventDefault();
      if (!$('request-form').reportValidity()) return;
      $('message').value = `North Carolina amateur radio connection

Purpose: ${$('interest').selectedOptions[0].text}
General area: ${$('area').value.trim()}
Topic: ${$('topic').value.trim()}

${$('details').value.trim()}

Prepared locally using the proposed NCRRS website. This message has not been sent.`;
      $('prepared').hidden=false; $('copy-status').textContent='Message prepared. Nothing has been sent.'; $('message').focus();
    });
    $('copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText($('message').value); $('copy-status').textContent='Copied. Choose a current club contact to send it yourself.'; }
      catch { $('message').focus(); $('message').select(); $('copy-status').textContent='Select and copy the message, or use Save as text.'; }
    });
    $('download').addEventListener('click', () => {
      const url=URL.createObjectURL(new Blob([$('message').value],{type:'text/plain;charset=utf-8'}));
      const link=document.createElement('a'); link.href=url; link.download='amateur-radio-message.txt'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  }
})();
