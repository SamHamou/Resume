/* CV Generator with full localStorage persistence and live preview */
(function(){
  var STORAGE_KEY = 'cvDataLocalStorage';

  function escapeHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  var data = {
    name: '', email: '', phone: '', location: '', summary: '',
    photo: '',
    skills: [], experiences: [], educations: [], template: 'classic'
  };

  function saveData(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e){ console.error('CV save error', e); }
  }

  function loadData(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw){
        data = JSON.parse(raw);
        document.getElementById('cv-name').value = data.name || '';
        document.getElementById('cv-email').value = data.email || '';
        document.getElementById('cv-phone').value = data.phone || '';
        document.getElementById('cv-location').value = data.location || '';
        document.getElementById('cv-summary').value = data.summary || '';
        if (data.photo) {
          var photoInfo = document.getElementById('cv-photo-name');
          if (photoInfo) photoInfo.textContent = '✓ Photo uploaded';
        }
        
        var radios = document.querySelectorAll('input[name="template"]');
        radios.forEach(function(radio){
          radio.checked = radio.value === (data.template || 'classic');
        });
        
        renderSkills();
        renderExperiencesFromData();
        renderEducationsFromData();
        renderPreview(data);
        return;
      }
    } catch(e){ console.error('CV load error', e); }
    
    data = { name:'', email:'', phone:'', location:'', summary:'', photo:'', skills:[], experiences:[], educations:[], template:'classic' };
    renderSkills(); 
    renderExperiencesFromData(); 
    renderEducationsFromData(); 
    renderPreview(data);
  }

  // Skills
  function addSkillChip(text){
    if (!text) return;
    if (data.skills.indexOf(text) === -1) data.skills.push(text);
    renderSkills(); 
    saveData();
  }
  
  function renderSkills(){
    var list = document.getElementById('skills-list');
    if (!list) return;
    list.innerHTML = '';
    data.skills.forEach(function(s, i){
      var li = document.createElement('li');
      li.textContent = s;
      var rm = document.createElement('button');
      rm.textContent = '×';
      rm.style.marginLeft = '6px';
      rm.style.background = 'transparent';
      rm.style.border = 'none';
      rm.style.color = 'inherit';
      rm.style.cursor = 'pointer';
      rm.onclick = function() {
        data.skills.splice(i,1);
        renderSkills();
        saveData();
      };
      li.appendChild(rm);
      list.appendChild(li);
    });
  }

  // Experiences
  function renderExperiencesFromData(){
    var container = document.getElementById('experiences');
    if (!container) return;
    container.innerHTML = '';
    data.experiences.forEach(function(exp, idx) {
      renderExperienceRow(idx, exp, container);
    });
  }
  
  function renderExperienceRow(index, exp, container){
    var template = document.getElementById('exp-template');
    if (!template || !container) return;
    
    var clone = template.content.cloneNode(true);
    var item = clone.querySelector('.exp-item');
    
    var role = item.querySelector('.exp-role');
    var company = item.querySelector('.exp-company');
    var start = item.querySelector('.exp-start');
    var endd = item.querySelector('.exp-end');
    var desc = item.querySelector('.exp-desc');
    var remove = item.querySelector('.remove-exp');
    
    if (role) { role.value = exp.role || ''; role.oninput = function(){ data.experiences[index].role = this.value; saveData(); scheduleRender(data); }; }
    if (company) { company.value = exp.company || ''; company.oninput = function(){ data.experiences[index].company = this.value; saveData(); scheduleRender(data); }; }
    if (start) { start.value = exp.start || ''; start.oninput = function(){ data.experiences[index].start = this.value; saveData(); scheduleRender(data); }; }
    if (endd) { endd.value = exp.end || ''; endd.oninput = function(){ data.experiences[index].end = this.value; saveData(); scheduleRender(data); }; }
    if (desc) { desc.value = exp.desc || ''; desc.oninput = function(){ data.experiences[index].desc = this.value; saveData(); scheduleRender(data); }; }
    if (remove) { remove.onclick = function(){ data.experiences.splice(index,1); renderExperiencesFromData(); saveData(); scheduleRender(data); }; }
    
    container.appendChild(item);
  }
  
  function addExperienceRow(){
    data.experiences.push({ role:'', company:'', start:'', end:'', desc:'' });
    renderExperiencesFromData();
    saveData();
    renderPreview(data);
  }

  // Education
  function renderEducationsFromData(){
    var container = document.getElementById('educations');
    if (!container) return;
    container.innerHTML = '';
    data.educations.forEach(function(edu, idx) {
      renderEducationRow(idx, edu, container);
    });
  }
  
  function renderEducationRow(index, edu, container){
    var template = document.getElementById('edu-template');
    if (!template || !container) return;
    
    var clone = template.content.cloneNode(true);
    var item = clone.querySelector('.edu-item');
    
    var degree = item.querySelector('.edu-degree');
    var school = item.querySelector('.edu-school');
    var start = item.querySelector('.edu-start');
    var endd = item.querySelector('.edu-end');
    var desc = item.querySelector('.edu-desc');
    var remove = item.querySelector('.remove-edu');
    
    if (degree) { degree.value = edu.degree || ''; degree.oninput = function(){ data.educations[index].degree = this.value; saveData(); scheduleRender(data); }; }
    if (school) { school.value = edu.school || ''; school.oninput = function(){ data.educations[index].school = this.value; saveData(); scheduleRender(data); }; }
    if (start) { start.value = edu.start || ''; start.oninput = function(){ data.educations[index].start = this.value; saveData(); scheduleRender(data); }; }
    if (endd) { endd.value = edu.end || ''; endd.oninput = function(){ data.educations[index].end = this.value; saveData(); scheduleRender(data); }; }
    if (desc) { desc.value = edu.desc || ''; desc.oninput = function(){ data.educations[index].desc = this.value; saveData(); scheduleRender(data); }; }
    if (remove) { remove.onclick = function(){ data.educations.splice(index,1); renderEducationsFromData(); saveData(); scheduleRender(data); }; }
    
    container.appendChild(item);
  }
  
  function addEducationRow(){
    data.educations.push({ degree:'', school:'', start:'', end:'', desc:'' });
    renderEducationsFromData();
    saveData();
    renderPreview(data);
  }

  // Template handling
  function setTemplate(value) {
    data.template = value;
    saveData();
    renderPreview(data);
  }

  function collectCVData(){
    data.name = document.getElementById('cv-name').value.trim() || '';
    data.email = document.getElementById('cv-email').value.trim() || '';
    data.phone = document.getElementById('cv-phone').value.trim() || '';
    data.location = document.getElementById('cv-location').value.trim() || '';
    data.summary = document.getElementById('cv-summary').value.trim() || '';
    // photo is set by file input handler, not here
    
    var selectedTemplate = document.querySelector('input[name="template"]:checked');
    if (selectedTemplate) data.template = selectedTemplate.value;
    
    data.experiences = [];
    var expItems = document.querySelectorAll('#experiences .exp-item');
    expItems.forEach(function(el){
      var exp = { 
        role: el.querySelector('.exp-role').value.trim(), 
        company: el.querySelector('.exp-company').value.trim(), 
        start: el.querySelector('.exp-start').value.trim(), 
        end: el.querySelector('.exp-end').value.trim(), 
        desc: el.querySelector('.exp-desc').value.trim()
      };
      if (exp.role || exp.company) data.experiences.push(exp);
    });
    
    data.educations = [];
    var eduItems = document.querySelectorAll('#educations .edu-item');
    eduItems.forEach(function(el){
      var edu = { 
        degree: el.querySelector('.edu-degree').value.trim(), 
        school: el.querySelector('.edu-school').value.trim(), 
        start: el.querySelector('.edu-start').value.trim(), 
        end: el.querySelector('.edu-end').value.trim(), 
        desc: el.querySelector('.edu-desc').value.trim()
      };
      if (edu.degree || edu.school) data.educations.push(edu);
    });
    
    saveData();
    return data;
  }

  var demoCV_es = {
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+34 555 123-4567',
    location: 'Madrid, España',
    photo: '',
    summary: 'Ingeniero de software con más de 5 años de experiencia en el desarrollo de aplicaciones web escalables.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Git'],
    experiences: [
      { role: 'Ingeniero de Software Senior', company: 'Tech Company Inc.', start: 'Ene 2021', end: 'Presente', desc: 'Lideré el desarrollo de una arquitectura de microservicios.' },
      { role: 'Ingeniero de Software', company: 'StartupXYZ', start: 'Mar 2018', end: 'Dic 2020', desc: 'Desarrollé aplicaciones web para clientes.' }
    ],
    educations: [
      { degree: 'Ing. en Ciencias de la Computación', school: 'Universidad Complutense', start: '2014', end: '2018', desc: 'Promedio: 8.5' }
    ],
    template: 'classic'
  };

  function getDemoCV() {
    return (typeof currentLang !== 'undefined' && currentLang === 'es') ? demoCV_es : demoCV;
  }

  function mergeWithDemo(userCV) {
    var demo = getDemoCV();
    var merged = {};
    merged.name = userCV.name || demo.name;
    merged.email = userCV.email || demo.email;
    merged.phone = userCV.phone || demo.phone;
    merged.location = userCV.location || demo.location;
    merged.summary = userCV.summary || demo.summary;
    merged.photo = userCV.photo || demo.photo || '';
    merged.skills = (userCV.skills && userCV.skills.length) ? userCV.skills : demo.skills;
    var hasRealExps = userCV.experiences && userCV.experiences.some(function(e){ return e.role || e.company; });
    merged.experiences = hasRealExps ? userCV.experiences : demo.experiences;
    var hasRealEdus = userCV.educations && userCV.educations.some(function(e){ return e.degree || e.school; });
    merged.educations = hasRealEdus ? userCV.educations : demo.educations;
    merged.template = userCV.template || demo.template;
    return merged;
  }

  var demoCV = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 555 123-4567',
    location: 'San Francisco, CA',
    photo: '',
    summary: 'Experienced software engineer with 5+ years of expertise in building scalable web applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Git'],
    experiences: [
      { role: 'Senior Software Engineer', company: 'Tech Company Inc.', start: 'Jan 2021', end: 'Present', desc: 'Led development of microservices architecture.' },
      { role: 'Software Engineer', company: 'StartupXYZ', start: 'Mar 2018', end: 'Dec 2020', desc: 'Built customer-facing web applications.' }
    ],
    educations: [
      { degree: 'B.S. Computer Science', school: 'University of California', start: '2014', end: '2018', desc: 'GPA: 3.8' }
    ],
    template: 'classic'
  };

  function getTemplateClass(template) {
    return 'template-' + (template || 'classic');
  }
  
  function getAtsBadge(template) {
    var friendly = typeof t !== 'undefined' ? t('atsFriendly') : 'ATS-Friendly';
    var notFriendly = typeof t !== 'undefined' ? t('notAtsFriendly') : 'Not ATS-Friendly';
    if (template === 'creative' || template === 'executive') {
      return '<span class="ats-preview-badge ats-no">✗ ' + notFriendly + '</span>';
    }
    return '<span class="ats-preview-badge">✓ ' + friendly + '</span>';
  }

  var photoPlaceholder = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#f3f4f6" width="100" height="100" rx="4"/><circle fill="#d1d5db" cx="50" cy="38" r="15"/><path fill="#d1d5db" d="M20 90c0-16.569 13.431-30 30-30s30 13.431 30 30z"/><text fill="#9ca3af" x="50" y="75" text-anchor="middle" font-size="8">Photo</text></svg>');

  var renderTimeout = null;
  function scheduleRender(cv) {
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(function() { renderPreview(cv); }, 150);
  }

  function renderPreview(cv){
    var container = document.getElementById('cv-preview');
    if (!container) return;
    
    var templateValue = cv.template || 'classic';
    var templateClass = getTemplateClass(templateValue);
    var displayCV = mergeWithDemo(cv);
    var isAts = templateValue !== 'creative';
    
    container.className = 'preview-content ' + templateClass;
    
    var nameText = escapeHTML(displayCV.name) || (typeof t !== 'undefined' ? t('yourName') : 'Your Name');
    var locationText = escapeHTML(displayCV.location);
    var emailText = escapeHTML(displayCV.email);
    var phoneText = escapeHTML(displayCV.phone);
    
    if (templateValue === 'creative') {
      var contactItems = [];
      if (emailText) contactItems.push('<div class="cv-contact-line"><span class="cv-icon">✉</span> ' + emailText + '</div>');
      if (phoneText) contactItems.push('<div class="cv-contact-line"><span class="cv-icon">✆</span> ' + phoneText + '</div>');
      if (locationText) contactItems.push('<div class="cv-contact-line"><span class="cv-icon">◉</span> ' + locationText + '</div>');
      
      var html = '<div class="cv-header">';
      html += '<div class="cv-photo"><img src="' + (displayCV.photo || photoPlaceholder) + '" alt="Photo"></div>';
      html += '<div class="cv-info"><div class="cv-name">' + nameText + '</div>';
      html += '</div></div>';
      
      html += '<div class="sidebar">';
      if (contactItems.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('previewContact') : 'Contact') + '</h4>' + contactItems.join('') + '</section>';
      }
      if (displayCV.skills && displayCV.skills.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('skills') : 'Skills') + '</h4><div class="cv-skills">' + displayCV.skills.map(function(s){ return '<span class="cv-skill">' + escapeHTML(s) + '</span>'; }).join('') + '</div></section>';
      }
      if (displayCV.educations && displayCV.educations.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('education') : 'Education') + '</h4>';
        displayCV.educations.forEach(function(ed){
          html += '<div class="cv-block"><div class="cv-block-header"><strong>' + escapeHTML(ed.degree) + '</strong><span>' + escapeHTML(ed.school) + '</span></div><div class="cv-dates">' + [escapeHTML(ed.start), escapeHTML(ed.end)].filter(Boolean).join(' - ') + '</div></div>';
        });
        html += '</section>';
      }
      html += '</div>';
      
      html += '<div class="main-content">';
      if (displayCV.summary) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('previewProfile') : 'Profile') + '</h4><p>' + escapeHTML(displayCV.summary) + '</p></section>';
      }
      if (displayCV.experiences && displayCV.experiences.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('experience') : 'Experience') + '</h4>';
        displayCV.experiences.forEach(function(e){
          html += '<div class="cv-block"><div class="cv-block-header"><strong>' + escapeHTML(e.role) + '</strong><span>' + (e.company ? '@ ' + escapeHTML(e.company) : '') + '</span></div><div class="cv-dates">' + [escapeHTML(e.start), escapeHTML(e.end)].filter(Boolean).join(' - ') + '</div><p>' + escapeHTML(e.desc) + '</p></div>';
        });
        html += '</section>';
      }
      html += '</div>';
      
      if (!cv.name && !cv.email && !cv.phone && !cv.location && !cv.summary &&
          !(cv.skills && cv.skills.length) && !(cv.experiences && cv.experiences.length) &&
          !(cv.educations && cv.educations.length)) {
        html += '<div class="preview-demo-badge">👆 ' + (typeof t !== 'undefined' ? t('previewDemo') : 'This is a preview. Start filling the form!') + '</div>';
      }
      
      container.innerHTML = html;
      return;
    }
    
    // Executive template
    if (templateValue === 'executive') {
      var contactItems = [];
      if (emailText) contactItems.push('<div class="cv-contact-line">' + emailText + '</div>');
      if (phoneText) contactItems.push('<div class="cv-contact-line">' + phoneText + '</div>');
      if (locationText) contactItems.push('<div class="cv-contact-line">' + locationText + '</div>');
      
      var html = '<div class="cv-header">';
      html += '<div class="cv-name">' + nameText + '</div>';
      html += '</div>';
      
      html += '<div class="main-content">';
      if (displayCV.summary) {
        html += '<p>' + escapeHTML(displayCV.summary) + '</p>';
      }
      if (displayCV.experiences && displayCV.experiences.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('experience') : 'Work Experience') + '</h4>';
        displayCV.experiences.forEach(function(e){
          html += '<div class="cv-block">';
          html += '<div class="cv-block-header"><strong>' + escapeHTML(e.role || 'Position') + '</strong>';
          if (e.start || e.end) html += '<span class="cv-block-sub" style="margin-left:auto;white-space:nowrap;">' + [escapeHTML(e.start), escapeHTML(e.end)].filter(Boolean).join(' – ') + '</span>';
          html += '</div>';
          if (e.company) html += '<div class="cv-block-sub">' + escapeHTML(e.company) + '</div>';
          if (e.desc) {
            var lines = e.desc.split('\n').filter(function(l){ return l.trim(); });
            if (lines.length > 0) {
              html += '<ul>' + lines.map(function(b){ return '<li>' + escapeHTML(b.replace(/^[-•*]\s*/, '')) + '</li>'; }).join('') + '</ul>';
            }
          }
          html += '</div>';
        });
        html += '</section>';
      }
      html += '</div>';
      
      html += '<div class="sidebar">';
      if (contactItems.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('previewContact') : 'Contact') + '</h4>' + contactItems.join('') + '</section>';
      }
      if (displayCV.skills && displayCV.skills.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('skills') : 'Skills') + '</h4>';
        html += '<ul class="cv-skills-list">' + displayCV.skills.map(function(s){ return '<li>' + escapeHTML(s) + '</li>'; }).join('') + '</ul>';
        html += '</section>';
      }
      if (displayCV.educations && displayCV.educations.length) {
        html += '<section><h4>' + (typeof t !== 'undefined' ? t('education') : 'Education') + '</h4>';
        displayCV.educations.forEach(function(ed){
          html += '<div class="cv-block">';
          html += '<strong>' + escapeHTML(ed.degree || 'Degree') + '</strong>';
          if (ed.school) html += '<span>' + escapeHTML(ed.school) + '</span>';
          if (ed.start || ed.end) html += '<div class="cv-dates">' + [escapeHTML(ed.start), escapeHTML(ed.end)].filter(Boolean).join(' – ') + '</div>';
          if (ed.desc) html += '<p>' + escapeHTML(ed.desc) + '</p>';
          html += '</div>';
        });
        html += '</section>';
      }
      html += '</div>';
      
      if (!displayCV.name && !displayCV.email && !displayCV.phone && !displayCV.location && !displayCV.summary &&
          !(displayCV.skills && displayCV.skills.length) && !(displayCV.experiences && displayCV.experiences.length) &&
          !(displayCV.educations && displayCV.educations.length)) {
        html += '<div class="preview-demo-badge">👆 ' + (typeof t !== 'undefined' ? t('previewDemo') : 'This is a preview. Start filling the form!') + '</div>';
      }
      
      container.innerHTML = html;
      return;
    }
    
    // Non-creative templates (classic/modern/minimal)
    var atsBadge = getAtsBadge(templateValue);
    
    var html = '<div class="cv-header"><div class="cv-info"><div class="cv-name">' + nameText + '</div>';
    
    var contactParts = [];
    if (emailText) contactParts.push('<span class="cv-icon">✉</span> ' + emailText);
    if (phoneText) contactParts.push('<span class="cv-icon">✆</span> ' + phoneText);
    if (locationText) contactParts.push('<span class="cv-icon">◉</span> ' + locationText);
    if (contactParts.length > 0) {
      html += '<div class="cv-contact">' + contactParts.join(' &nbsp;|&nbsp; ') + '</div>';
    }
    html += '</div></div>';
    html += atsBadge;
    
    if (displayCV.summary) {
      html += '<section class="cv-section"><h4>' + (typeof t !== 'undefined' ? t('summary') : 'Summary') + '</h4><p>' + escapeHTML(displayCV.summary) + '</p></section>';
    }
    
    if (displayCV.skills && displayCV.skills.length) {
      html += '<section class="cv-section"><h4>' + (typeof t !== 'undefined' ? t('skills') : 'Skills') + '</h4><div class="cv-skills">' + displayCV.skills.map(function(s){ return '<span class="cv-skill">' + escapeHTML(s) + '</span>'; }).join('') + '</div></section>';
    }
    
    if (displayCV.experiences && displayCV.experiences.length) {
      html += '<section class="cv-section"><h4>' + (typeof t !== 'undefined' ? t('experience') : 'Experience') + '</h4>';
      displayCV.experiences.forEach(function(e){
        html += '<div class="cv-block"><div class="cv-block-header"><strong>' + escapeHTML(e.role) + '</strong><span>' + (e.company ? '@ ' + escapeHTML(e.company) : '') + '</span></div><div class="cv-dates">' + [escapeHTML(e.start), escapeHTML(e.end)].filter(Boolean).join(' - ') + '</div><p>' + escapeHTML(e.desc) + '</p></div>';
      });
      html += '</section>';
    }
    
    if (displayCV.educations && displayCV.educations.length) {
      html += '<section class="cv-section"><h4>' + (typeof t !== 'undefined' ? t('education') : 'Education') + '</h4>';
      displayCV.educations.forEach(function(ed){
        html += '<div class="cv-block"><div class="cv-block-header"><strong>' + escapeHTML(ed.degree) + '</strong><span>' + (ed.school ? '@ ' + escapeHTML(ed.school) : '') + '</span></div><div class="cv-dates">' + [escapeHTML(ed.start), escapeHTML(ed.end)].filter(Boolean).join(' - ') + '</div><p>' + escapeHTML(ed.desc) + '</p></div>';
      });
      html += '</section>';
    }
    
    if (!cv.name && !cv.email && !cv.phone && !cv.location && !cv.summary &&
        !(cv.skills && cv.skills.length) && !(cv.experiences && cv.experiences.length) &&
        !(cv.educations && cv.educations.length)) {
      html += '<div class="preview-demo-badge">👆 ' + (typeof t !== 'undefined' ? t('previewDemo') : 'This is a preview. Start filling the form!') + '</div>';
    }
    
    container.innerHTML = html;
  }

  // PDF Generation
  function showToast(message, isError) {
    var existing = document.querySelector('.cv-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'cv-toast' + (isError ? ' cv-toast-error' : '');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 10);
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  function generatePDF(cv){
    try {
      if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() { generatePDF(cv); };
        document.head.appendChild(script);
        return;
      }
      
      var displayCV = mergeWithDemo(cv);
      
      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF({ unit: 'mm', format: 'a4' });
      var pageW = doc.internal.pageSize.getWidth();
      var pageH = doc.internal.pageSize.getHeight();
      
      if (displayCV.template === 'creative') {
        generateCreativePDF(doc, displayCV, pageW, pageH);
      } else if (displayCV.template === 'executive') {
        generateExecutivePDF(doc, displayCV, pageW, pageH);
      } else {
        generateStandardPDF(doc, displayCV, pageW, pageH);
      }
      
      var fileName = (displayCV.name || 'CV').trim().replace(/\s+/g, '_') + '.pdf';
      doc.save(fileName);
    } catch(e) {
      console.error('PDF error:', e);
      showToast('Error generating PDF: ' + e.message, true);
    }
  }

  function generateStandardPDF(doc, cv, pageW, pageH){
    var marginLeft = 15;
    var marginRight = 15;
    var contentWidth = pageW - marginLeft - marginRight;
    var y = 20;
    var primaryColor = [99, 102, 241];
    var textDark = [17, 24, 39];
    var textGray = [75, 85, 99];
    var textLight = [156, 163, 175];
    var lineColor = [229, 231, 235];
    
    // Header background bar
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 10, pageW, 36, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.line(0, 46, pageW, 46);
    
    // Photo
    var photoX = marginLeft;
    if (cv.photo) {
      try {
        doc.addImage(cv.photo, 'JPEG', photoX, 14, 25, 25);
      } catch(e) {
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(photoX, 14, 25, 25, 2, 2, 'F');
        doc.setDrawColor(209, 213, 219);
        doc.roundedRect(photoX, 14, 25, 25, 2, 2, 'S');
      }
    } else {
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(photoX, 14, 25, 25, 2, 2, 'F');
      doc.setDrawColor(209, 213, 219);
      doc.roundedRect(photoX, 14, 25, 25, 2, 2, 'S');
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text('Photo', photoX + 12.5, 26.5, { align: 'center' });
    }
    
    // Name
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(cv.name || (typeof t !== 'undefined' ? t('yourName') : 'Your Name'), marginLeft + 30, 22);
    
    // Contact
    var contactParts = [];
    if (cv.email) contactParts.push('✉ ' + cv.email);
    if (cv.phone) contactParts.push('✆ ' + cv.phone);
    if (cv.location) contactParts.push('◉ ' + cv.location);
    
    if (contactParts.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(textLight[0], textLight[1], textLight[2]);
      doc.text(contactParts.join('  |  '), marginLeft + 30, 34);
    }
    
    y = 54;
    
    // Summary
    if (cv.summary) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text((typeof t !== 'undefined' ? t('summary') : 'SUMMARY').toUpperCase(), marginLeft, y);
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(marginLeft, y + 1, marginLeft + 30, y + 1);
      y += 7;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      var summaryLines = doc.splitTextToSize(cv.summary, contentWidth);
      doc.text(summaryLines, marginLeft, y);
      y += summaryLines.length * 4.5 + 8;
    }
    
    // Skills
    if (cv.skills && cv.skills.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text((typeof t !== 'undefined' ? t('skills') : 'SKILLS').toUpperCase(), marginLeft, y);
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(marginLeft, y + 1, marginLeft + 30, y + 1);
      y += 7;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      var skillsText = cv.skills.join('  •  ');
      var skillsLines = doc.splitTextToSize(skillsText, contentWidth);
      doc.text(skillsLines, marginLeft, y);
      y += skillsLines.length * 4.5 + 8;
    }
    
    // Experience
    if (cv.experiences && cv.experiences.length > 0) {
      if (y > pageH - 40) { doc.addPage(); y = 20; }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text((typeof t !== 'undefined' ? t('experience') : 'EXPERIENCE').toUpperCase(), marginLeft, y);
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(marginLeft, y + 1, marginLeft + 30, y + 1);
      y += 7;
      
      cv.experiences.forEach(function(exp) {
        if (y > pageH - 30) { doc.addPage(); y = 20; }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        var roleText = exp.role || 'Position';
        doc.text(roleText, marginLeft, y);
        
        if (exp.company) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textGray[0], textGray[1], textGray[2]);
          var companyW = doc.getTextWidth(' at ' + exp.company);
          doc.text(' at ' + exp.company, marginLeft + doc.getTextWidth(roleText) + 1, y);
        }
        
        if (exp.start || exp.end) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textLight[0], textLight[1], textLight[2]);
          var dateText = [exp.start, exp.end].filter(Boolean).join(' - ');
          doc.text(dateText, pageW - marginRight, y, { align: 'right' });
        }
        y += 5;
        
        if (exp.desc) {
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textGray[0], textGray[1], textGray[2]);
          var descLines = doc.splitTextToSize(exp.desc, contentWidth);
          doc.text(descLines, marginLeft, y);
          y += descLines.length * 4;
        }
        
        y += 4;
      });
    }
    
    // Education
    if (cv.educations && cv.educations.length > 0) {
      if (y > pageH - 40) { doc.addPage(); y = 20; }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text((typeof t !== 'undefined' ? t('education') : 'EDUCATION').toUpperCase(), marginLeft, y);
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(marginLeft, y + 1, marginLeft + 30, y + 1);
      y += 7;
      
      cv.educations.forEach(function(edu) {
        if (y > pageH - 30) { doc.addPage(); y = 20; }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(edu.degree || 'Degree', marginLeft, y);
        
        if (edu.school) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textGray[0], textGray[1], textGray[2]);
          doc.text(' — ' + edu.school, marginLeft + doc.getTextWidth(edu.degree || 'Degree') + 1, y);
        }
        
        if (edu.start || edu.end) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textLight[0], textLight[1], textLight[2]);
          var dateText = [edu.start, edu.end].filter(Boolean).join(' - ');
          doc.text(dateText, pageW - marginRight, y, { align: 'right' });
        }
        y += 5;
        
        if (edu.desc) {
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(textGray[0], textGray[1], textGray[2]);
          var descLines = doc.splitTextToSize(edu.desc, contentWidth);
          doc.text(descLines, marginLeft, y);
          y += descLines.length * 4;
        }
        
        y += 4;
      });
    }
  }

  function generateCreativePDF(doc, cv, pageW, pageH){
    var sidebarW = 55;
    var marginLeft = 10;
    var marginRight = 10;
    var sidebarEndX = marginLeft + sidebarW + 4;
    var mainX = sidebarEndX + 4;
    var mainW = pageW - mainX - marginRight;
    var ySide = 25;
    var yMain = 25;
    var greyText = [71, 85, 105];
    var darkText = [15, 23, 42];
    var lightBorder = [226, 232, 240];
    
    // Name (no colored header bar)
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(cv.name || (typeof t !== 'undefined' ? t('yourName') : 'Your Name'), marginLeft, yMain);
    yMain += 7;
    yMain += 4;
    // Header bottom line
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.line(0, yMain, pageW, yMain);
    yMain += 10;
    
    // Sidebar separator (light vertical line)
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.line(sidebarEndX, 25, sidebarEndX, pageH);
    
    // Sidebar: Contact
    doc.setTextColor(greyText[0], greyText[1], greyText[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text((typeof t !== 'undefined' ? t('previewContact') : 'CONTACT').toUpperCase(), marginLeft, ySide);
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.line(marginLeft, ySide + 1, marginLeft + sidebarW - 4, ySide + 1);
    ySide += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    if (cv.email) { doc.text('✉ ' + cv.email, marginLeft, ySide); ySide += 3.5; }
    if (cv.phone) { doc.text('✆ ' + cv.phone, marginLeft, ySide); ySide += 3.5; }
    if (cv.location) { doc.text('◉ ' + cv.location, marginLeft, ySide); ySide += 3.5; }
    ySide += 4;
    
    // Sidebar: Skills
    if (cv.skills && cv.skills.length > 0) {
      doc.setTextColor(greyText[0], greyText[1], greyText[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text((typeof t !== 'undefined' ? t('skills') : 'SKILLS').toUpperCase(), marginLeft, ySide);
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.line(marginLeft, ySide + 1, marginLeft + sidebarW - 4, ySide + 1);
      ySide += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      var skillLine = '';
      cv.skills.forEach(function(s, i){
        var sep = (i < cv.skills.length - 1) ? ', ' : '';
        var next = s + sep;
        if (doc.getTextWidth(skillLine + next) > sidebarW - 2) {
          doc.text(skillLine, marginLeft, ySide);
          ySide += 3.5;
          skillLine = s + sep;
        } else {
          skillLine += next;
        }
      });
      if (skillLine) { doc.text(skillLine, marginLeft, ySide); ySide += 3.5; }
      ySide += 4;
    }
    
    // Sidebar: Education
    if (cv.educations && cv.educations.length > 0) {
      doc.setTextColor(greyText[0], greyText[1], greyText[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text((typeof t !== 'undefined' ? t('education') : 'EDUCATION').toUpperCase(), marginLeft, ySide);
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.line(marginLeft, ySide + 1, marginLeft + sidebarW - 4, ySide + 1);
      ySide += 6;
      doc.setFont('helvetica', 'normal');
      cv.educations.forEach(function(edu){
        doc.setFontSize(7);
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree || 'Degree', marginLeft, ySide);
        ySide += 3.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(greyText[0], greyText[1], greyText[2]);
        if (edu.school) { doc.text(edu.school, marginLeft, ySide); ySide += 3; }
        if (edu.start || edu.end) {
          var dateText = [edu.start, edu.end].filter(Boolean).join(' - ');
          doc.text(dateText, marginLeft, ySide);
          ySide += 3;
        }
        ySide += 2;
      });
      ySide += 4;
    }
    
    // Main: Profile
    if (cv.summary) {
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text((typeof t !== 'undefined' ? t('previewProfile') : 'PROFILE').toUpperCase(), mainX, yMain);
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.line(mainX, yMain + 1, mainX + 25, yMain + 1);
      yMain += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(greyText[0], greyText[1], greyText[2]);
      var sumLines = doc.splitTextToSize(cv.summary, mainW);
      doc.text(sumLines, mainX, yMain);
      yMain += sumLines.length * 4.5 + 6;
    }
    
    // Main: Experience
    if (cv.experiences && cv.experiences.length > 0) {
      if (yMain > pageH - 40) { doc.addPage(); yMain = 20; }
      
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text((typeof t !== 'undefined' ? t('experience') : 'EXPERIENCE').toUpperCase(), mainX, yMain);
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.line(mainX, yMain + 1, mainX + 25, yMain + 1);
      yMain += 7;
      
      cv.experiences.forEach(function(exp){
        if (yMain > pageH - 30) { doc.addPage(); yMain = 20; }
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        var roleText = exp.role || 'Position';
        if (exp.company) roleText += ' — ' + exp.company;
        doc.text(roleText, mainX, yMain);
        
        if (exp.start || exp.end) {
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(greyText[0], greyText[1], greyText[2]);
          var dateText = [exp.start, exp.end].filter(Boolean).join(' - ');
          doc.text(dateText, pageW - marginRight, yMain, { align: 'right' });
        }
        yMain += 4.5;
        
        if (exp.desc) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(greyText[0], greyText[1], greyText[2]);
          var descLines = doc.splitTextToSize(exp.desc, mainW);
          doc.text(descLines, mainX, yMain);
          yMain += descLines.length * 4 + 3;
        }
        
        yMain += 3;
      });
    }
  }

  function generateExecutivePDF(doc, cv, pageW, pageH){
    var sidebarW = 55;
    var marginLeft = 12;
    var marginRight = 10;
    var sidebarEndX = pageW - sidebarW - marginRight;
    var mainW = sidebarEndX - marginLeft - 8;
    var yMain = 20;
    var ySide = 20;
    var purple = [79, 70, 229];
    var darkText = [15, 23, 42];
    var greyText = [71, 85, 105];
    var lightText = [100, 116, 139];
    
    // Header
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(cv.name || (typeof t !== 'undefined' ? t('yourName') : 'Your Name'), marginLeft, yMain);
    yMain += 8;
    if (cv.summary) {
      doc.setFontSize(9);
      doc.setTextColor(greyText[0], greyText[1], greyText[2]);
      var sumLines = doc.splitTextToSize(cv.summary, mainW);
      doc.text(sumLines, marginLeft, yMain);
      yMain += sumLines.length * 4 + 4;
    }
    doc.setDrawColor(200, 200, 200);
    doc.line(marginLeft, yMain, sidebarEndX - 8, yMain);
    yMain += 8;
    
    // Sidebar background
    doc.setFillColor(248, 250, 252);
    doc.rect(sidebarEndX, 0, sidebarW + marginRight, pageH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(sidebarEndX, 0, sidebarEndX, pageH);
    
    // Sidebar: Contact
    doc.setTextColor(purple[0], purple[1], purple[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text((typeof t !== 'undefined' ? t('previewContact') : 'CONTACT').toUpperCase(), sidebarEndX + 6, ySide);
    doc.line(sidebarEndX + 6, ySide + 1, pageW - marginRight, ySide + 1);
    ySide += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(greyText[0], greyText[1], greyText[2]);
    if (cv.email) { doc.text('• ' + cv.email, sidebarEndX + 6, ySide); ySide += 3.5; }
    if (cv.phone) { doc.text('• ' + cv.phone, sidebarEndX + 6, ySide); ySide += 3.5; }
    if (cv.location) { doc.text('• ' + cv.location, sidebarEndX + 6, ySide); ySide += 3.5; }
    ySide += 4;
    
    // Sidebar: Skills
    if (cv.skills && cv.skills.length > 0) {
      doc.setTextColor(purple[0], purple[1], purple[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text((typeof t !== 'undefined' ? t('skills') : 'SKILLS').toUpperCase(), sidebarEndX + 6, ySide);
      doc.line(sidebarEndX + 6, ySide + 1, pageW - marginRight, ySide + 1);
      ySide += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(greyText[0], greyText[1], greyText[2]);
      var skillLine = '';
      cv.skills.forEach(function(s, i){
        var sep = (i < cv.skills.length - 1) ? ', ' : '';
        var next = s + sep;
        if (doc.getTextWidth(skillLine + next) > sidebarW - 4) {
          doc.text(skillLine, sidebarEndX + 6, ySide);
          ySide += 3.5;
          skillLine = next;
        } else {
          skillLine += next;
        }
      });
      if (skillLine) { doc.text(skillLine, sidebarEndX + 6, ySide); ySide += 3.5; }
      ySide += 4;
    }
    
    // Sidebar: Education
    if (cv.educations && cv.educations.length > 0) {
      doc.setTextColor(purple[0], purple[1], purple[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text((typeof t !== 'undefined' ? t('education') : 'EDUCATION').toUpperCase(), sidebarEndX + 6, ySide);
      doc.line(sidebarEndX + 6, ySide + 1, pageW - marginRight, ySide + 1);
      ySide += 6;
      doc.setFont('helvetica', 'normal');
      cv.educations.forEach(function(edu){
        doc.setFontSize(7);
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree || 'Degree', sidebarEndX + 6, ySide);
        ySide += 3.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(lightText[0], lightText[1], lightText[2]);
        if (edu.school) { doc.text(edu.school, sidebarEndX + 6, ySide); ySide += 3; }
        if (edu.start || edu.end) {
          doc.text([edu.start, edu.end].filter(Boolean).join(' – '), sidebarEndX + 6, ySide);
          ySide += 3;
        }
        ySide += 2;
      });
      ySide += 4;
    }
    
    // Main: Experience
    if (cv.experiences && cv.experiences.length > 0) {
      doc.setTextColor(purple[0], purple[1], purple[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text((typeof t !== 'undefined' ? t('experience') : 'WORK EXPERIENCE').toUpperCase(), marginLeft, yMain);
      doc.line(marginLeft, yMain + 1, mainW + marginLeft, yMain + 1);
      yMain += 7;
      
      cv.experiences.forEach(function(exp){
        if (yMain > pageH - 30) { doc.addPage(); yMain = 20; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        var roleText = exp.role || 'Position';
        doc.text(roleText, marginLeft, yMain);
        if (exp.start || exp.end) {
          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(lightText[0], lightText[1], lightText[2]);
          doc.text([exp.start, exp.end].filter(Boolean).join(' – '), sidebarEndX - 8, yMain, { align: 'right' });
        }
        yMain += 4;
        if (exp.company) {
          doc.setFontSize(8);
          doc.setTextColor(lightText[0], lightText[1], lightText[2]);
          doc.text(exp.company, marginLeft, yMain);
          yMain += 4;
        }
        if (exp.desc) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(greyText[0], greyText[1], greyText[2]);
          var descLines = doc.splitTextToSize(exp.desc, mainW - 4);
          doc.text(descLines, marginLeft + 4, yMain);
          yMain += descLines.length * 3.5 + 3;
        }
        yMain += 3;
      });
    }
  }

  function init(){
    // Tab switching
    var tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(function(btn){
      btn.onclick = function() {
        tabBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var tabId = 'tab-' + btn.getAttribute('data-tab');
        document.querySelectorAll('.form-panel, .preview-panel').forEach(function(p){ p.classList.remove('active'); });
        var target = document.getElementById(tabId);
        if (target) target.classList.add('active');
      };
    });

    // Add skill
    document.getElementById('add-skill').onclick = function(){
      var input = document.getElementById('skill-input');
      if (input.value.trim()) {
        addSkillChip(input.value.trim());
        input.value = '';
      }
    };
    
    // Add experience/education
    document.getElementById('add-experience').onclick = addExperienceRow;
    document.getElementById('add-education').onclick = addEducationRow;
    
    // Email validation
    var emailEl = document.getElementById('cv-email');
    var emailError = document.getElementById('email-error');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateEmail() {
      var val = emailEl.value.trim();
      if (val && !emailPattern.test(val)) {
        emailEl.classList.add('field-invalid');
        if (emailError) emailError.textContent = 'Please enter a valid email';
        return false;
      }
      emailEl.classList.remove('field-invalid');
      if (emailError) emailError.textContent = '';
      return true;
    }
    
    if (emailEl) {
      emailEl.addEventListener('blur', validateEmail);
    }

    // Photo upload
    var photoInput = document.getElementById('cv-photo');
    if (photoInput) {
      photoInput.addEventListener('change', function() {
        var file = photoInput.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          showToast('Photo must be under 2MB', true);
          photoInput.value = '';
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          data.photo = e.target.result;
          saveData();
          renderPreview(data);
          var photoInfo = document.getElementById('cv-photo-name');
          if (photoInfo) photoInfo.textContent = '✓ ' + file.name;
        };
        reader.readAsDataURL(file);
      });
    }

    // Download
    function handleDownload() {
      if (!validateEmail()) {
        showToast('Please enter a valid email address', true);
        return;
      }
      var cvData = collectCVData();
      generatePDF(cvData);
    }
    document.getElementById('download').onclick = handleDownload;
    var previewDownload = document.getElementById('download-preview');
    if (previewDownload) previewDownload.onclick = handleDownload;
    
    // Template
    document.querySelectorAll('input[name="template"]').forEach(function(radio){
      radio.onchange = function() { setTemplate(this.value); };
    });
    
    // Fields
    var fields = ['cv-name', 'cv-email', 'cv-phone', 'cv-location', 'cv-summary'];
    fields.forEach(function(id){
      var el = document.getElementById(id);
      if (el) {
        var key = id.replace('cv-', '');
        el.oninput = function(){
          data[key] = this.value;
          saveData();
          scheduleRender(data);
        };
        el.onblur = function(){
          if (this.value) {
            this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
            data[key] = this.value;
            saveData();
            scheduleRender(data);
          }
        };
      }
    });
    
    // Load
    loadData();
    
    if (!data.experiences.length) data.experiences.push({ role:'', company:'', start:'', end:'', desc:'' });
    if (!data.educations.length) data.educations.push({ degree:'', school:'', start:'', end:'', desc:'' });
    
    renderExperiencesFromData();
    renderEducationsFromData();
    renderSkills();
    
    document.addEventListener('languageChanged', function(){ renderPreview(data); });
    
    // Mobile swipe to switch tabs
    (function(){
      var layout = document.querySelector('.cv-builder .layout');
      if (!layout) return;
      var touchStartX = 0;
      var touchStartY = 0;
      var tabBtns = document.querySelectorAll('.tab-btn');
      var currentTab = 0;
      
      function getCurrentTabIndex() {
        for (var i = 0; i < tabBtns.length; i++) {
          if (tabBtns[i].classList.contains('active')) return i;
        }
        return 0;
      }
      
      layout.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      
      layout.addEventListener('touchend', function(e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
          currentTab = getCurrentTabIndex();
          if (dx < 0 && currentTab < tabBtns.length - 1) {
            tabBtns[currentTab + 1].click();
          } else if (dx > 0 && currentTab > 0) {
            tabBtns[currentTab - 1].click();
          }
        }
      }, { passive: true });
    })();
    
    // Section drag reordering
    (function(){
      var sectionContainer = document.querySelector('.cv-builder .panel');
      if (!sectionContainer) return;
      var draggedSection = null;
      
      function addDragHandles() {
        var sections = sectionContainer.querySelectorAll('.section');
        sections.forEach(function(sec) {
          if (sec.querySelector('.section-drag-handle')) return;
          var handle = document.createElement('span');
          handle.className = 'section-drag-handle';
          handle.innerHTML = '⠿';
          handle.draggable = false;
          var title = sec.querySelector('.section-title');
          if (title) title.insertBefore(handle, title.firstChild);
          
          sec.draggable = true;
          sec.addEventListener('dragstart', function(e) {
            draggedSection = sec;
            sec.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
          });
          sec.addEventListener('dragend', function() {
            sec.classList.remove('dragging');
            draggedSection = null;
            document.querySelectorAll('.section.drag-over').forEach(function(s){ s.classList.remove('drag-over'); });
            saveSectionOrder();
          });
          sec.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedSection && draggedSection !== sec) {
              document.querySelectorAll('.section.drag-over').forEach(function(s){ s.classList.remove('drag-over'); });
              sec.classList.add('drag-over');
            }
          });
          sec.addEventListener('dragleave', function() {
            sec.classList.remove('drag-over');
          });
          sec.addEventListener('drop', function(e) {
            e.preventDefault();
            sec.classList.remove('drag-over');
            if (draggedSection && draggedSection !== sec) {
              var allSections = Array.from(sectionContainer.querySelectorAll('.section'));
              var fromIdx = allSections.indexOf(draggedSection);
              var toIdx = allSections.indexOf(sec);
              if (fromIdx < toIdx) {
                sec.parentNode.insertBefore(draggedSection, sec.nextSibling);
              } else {
                sec.parentNode.insertBefore(draggedSection, sec);
              }
            }
          });
        });
      }
      
      function saveSectionOrder() {
        var sections = sectionContainer.querySelectorAll('.section');
        var order = [];
        sections.forEach(function(sec) {
          var title = sec.querySelector('.section-title');
          if (title) order.push(title.textContent.trim());
        });
        try { localStorage.setItem('cvSectionOrder', JSON.stringify(order)); } catch(e){}
      }
      
      addDragHandles();
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
