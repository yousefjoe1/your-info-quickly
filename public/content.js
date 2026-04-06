
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autoFillForm") {
    const data = request.data;
    
    data.forEach(info => {
      const element = findBestMatchingInputBtn(info);
      
      if (element) {
        fillInputElementByClickBtn(element, info.title);
        console.log(`✅ Filled "${info.field}" with "${info.title}"`);
      } else {
        console.warn(`❌ Could not find input for "${info.field}"`);
      }
    });
    
    sendResponse({ status: "success" });
  }
  return true;
});

function isLatinBasedBtn(text) {
  const latinRegex = /^[a-z\s'"]+$/i;
  return latinRegex.test(text);
}

function getSearchTermsBtn(info) {
  return [info.field, ...(info.tags || [])]
    .map(t => {
      const tagName = typeof t === 'object' ? t.tagName : t;
      return tagName.toLowerCase();
    })
    .filter(t => isLatinBasedBtn(t));
}

function findBestMatchingInputBtn(info) {
  const searchTerms = getSearchTermsBtn(info);
  let element = null;
  
  // Strategy 1: Direct attribute matching
  element = findByDirectAttributesBtn(searchTerms);
  if (element && verifyInputContextByClickBtn(element, searchTerms)) {
    console.log('🎯 Found via direct attributes');
    return element;
  }
  
  // Strategy 2: Find input by verifying its context (labels/parent text)
  element = findByContextVerificationBtn(searchTerms);
  if (element) {
    console.log('🎯 Found via context verification');
    return element;
  }
  
  return null;
}

function findByDirectAttributesBtn(searchTerms) {
  const standardSelector = searchTerms.map(term => 
    `input[name*="${term}" i], 
     input[id*="${term}" i], 
     input[placeholder*="${term}" i], 
     textarea[name*="${term}" i]`
  ).join(', ');
  
  return document.querySelector(standardSelector);
}

function findByContextVerificationBtn(searchTerms) {
  // Get all inputs on the page
  const allInputs = document.querySelectorAll('input:not([type="hidden"]), textarea, [contenteditable="true"]');
  
  for (let input of allInputs) {
    if (verifyInputContextByClickBtn(input, searchTerms)) {
      return input;
    }
  }
  
  return null;
}

function verifyInputContextByClickBtn(input, searchTerms) {
  // Check up to 4 levels of parents
  let currentElement = input;
  const maxLevels = 4;
  
  for (let level = 0; level < maxLevels; level++) {
    if (!currentElement || currentElement === document.body) break;
    
    // Check all text-bearing elements within this parent
    const textElements = currentElement.querySelectorAll('label, span, div, p, th, b, legend, strong');
    
    for (let textEl of textElements) {
      // Skip if this element contains the input itself (avoid checking descendants)
      if (textEl.contains(input) && textEl !== currentElement) continue;
      
      const text = textEl.innerText?.trim().toLowerCase();
      
      // Check if text matches any of our search terms using includes
      if (text && text.length > 0 && text.length < 50) {
        const matchedTerm = searchTerms.find(term => text.includes(term));
        if (matchedTerm) {
          console.log(`📍 Verified at level ${level}: "${text}" contains "${matchedTerm}"`);
          return true;
        }
      }
    }
    
    // Also check the associated label via 'for' attribute
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        const labelText = label.innerText?.trim().toLowerCase();
        const matchedTerm = searchTerms.find(term => labelText?.includes(term));
        if (matchedTerm) {
          console.log(`📍 Verified via label[for]: "${labelText}" contains "${matchedTerm}"`);
          return true;
        }
      }
    }
    
    // Check aria-label and aria-labelledby
    if (input.hasAttribute('aria-label')) {
      const ariaLabel = input.getAttribute('aria-label').toLowerCase();
      const matchedTerm = searchTerms.find(term => ariaLabel.includes(term));
      if (matchedTerm) {
        console.log(`📍 Verified via aria-label: "${ariaLabel}" contains "${matchedTerm}"`);
        return true;
      }
    }
    
    if (input.hasAttribute('aria-labelledby')) {
      const labelId = input.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(labelId);
      if (labelElement) {
        const labelText = labelElement.innerText?.trim().toLowerCase();
        const matchedTerm = searchTerms.find(term => labelText?.includes(term));
        if (matchedTerm) {
          console.log(`📍 Verified via aria-labelledby: "${labelText}" contains "${matchedTerm}"`);
          return true;
        }
      }
    }
    
    currentElement = currentElement.parentElement;
  }
  
  return false;
}

function fillInputElementByClickBtn(element, value) {
  // Handle React/Vue controlled inputs
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 
    "value"
  ).set;
  
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 
    "value"
  ).set;
  
  if (element.tagName === 'TEXTAREA') {
    nativeTextAreaValueSetter.call(element, value);
  } else if (element.hasAttribute('contenteditable')) {
    element.innerText = value;
  } else {
    nativeInputValueSetter.call(element, value);
  }
  
  // Trigger events for framework reactivity
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
  
  // Focus briefly to ensure visibility
  element.focus();
}


// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================


// =====================================================================================
// =====================================================================================
// =====================================================================================
// =====================================================================================

// ============================================
// AUTOFILL CONTENT SCRIPT — Complete
// ============================================

// ─── SHARED STATE (declared once at top) ────





/*========================================*/
/*========================================*/
/*========================================*/
/*========================================*/
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// if (request.action === 'autoFillForm') {
//   const data = request.data;

//   // Use profileData from storage if available, fallback to request data
//   const profile = profileData.length > 0 ? profileData : data;

//   const results = smartFill(profile);

//   sendResponse({
//     status: 'success',
//     filled: results.filled,
//     unmatched: results.unmatched
//   });
// }
//   return true;
// });



// function smartFill(profileData) {
//   const results = { filled: [], unmatched: [] };
//   const SELECTOR = 'input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]):not([type="button"]), textarea';
  
//   const allInputs = document.querySelectorAll(SELECTOR);

//   allInputs.forEach(input => {
//     // Already filled — skip
//     if (input.value && input.value.trim() !== '') return;

//     const detectedText = detectNearestText(input);
//     if (!detectedText) {
//       results.unmatched.push(input.name || input.id || 'unknown');
//       return;
//     }

//     const bestMatch = findBestMatchForLabelText(detectedText, profileData);
//     if (!bestMatch) {
//       results.unmatched.push(detectedText);
//       return;
//     }

//     fillInputElement(input, bestMatch.title);
//     results.filled.push(bestMatch.field);
//   });

//   return results;
// }

// function detectNearestText(input) {
//   // Priority 1: label[for]
//   if (input.id) {
//     const label = document.querySelector(`label[for="${input.id}"]`);
//     if (label) return label.innerText?.trim().toLowerCase();
//   }

//   // Priority 2: aria-label
//   const ariaLabel = input.getAttribute('aria-label');
//   if (ariaLabel) return ariaLabel.trim().toLowerCase();

//   // Priority 3: aria-labelledby
//   const labelledBy = input.getAttribute('aria-labelledby');
//   if (labelledBy) {
//     const ref = document.getElementById(labelledBy);
//     if (ref) return ref.innerText?.trim().toLowerCase();
//   }

//   // Priority 4: placeholder
//   if (input.placeholder) return input.placeholder.trim().toLowerCase();

//   // Priority 5: scan surrounding DOM
//   // Check previous siblings first (label/span usually comes BEFORE the input)
//   const nearbyText = scanNearbyElements(input);
//   if (nearbyText) return nearbyText;

//   return null;
// }

// function scanNearbyElements(input) {
//   const TEXT_TAGS = ['label', 'span', 'p', 'div', 'legend', 'b', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'li'];
  
//   // Walk up to 5 parent levels
//   let current = input.parentElement;
//   for (let level = 0; level < 5; level++) {
//     if (!current || current === document.body) break;

//     // Check all previous siblings of current element at this level
//     // (because label/span usually comes BEFORE input in DOM)
//     let sibling = current.previousElementSibling;
//     while (sibling) {
//       const text = extractText(sibling, input);
//       if (text) return text;
//       sibling = sibling.previousElementSibling;
//     }

//     // Also check text-bearing children of the parent
//     // but skip anything that contains or IS the input
//     const children = current.querySelectorAll(TEXT_TAGS.join(', '));
//     for (const child of children) {
//       if (child.contains(input) || input.contains(child)) continue;
//       const text = extractText(child, input);
//       if (text) return text;
//     }

//     current = current.parentElement;
//   }

//   return null;
// }

// function extractText(el, inputToExclude) {
//   // Skip if element contains the input (we want label text, not field container text)
//   if (el.contains(inputToExclude)) return null;

//   const text = el.innerText?.trim().toLowerCase();
  
//   // Must be meaningful but not too long (avoid grabbing whole sections)
//   if (text && text.length > 0 && text.length < 80) return text;
  
//   return null;
// }

// function findBestMatchForLabelText(labelText, profileData) {
//   let bestMatch = null;
//   let bestScore = 0;

//   for (const info of profileData) {
//     const terms = [info.field, ...(info.tags || [])]
//       .map(t => (typeof t === 'object' ? t.tagName : t).toLowerCase())
//       .filter(t => isLatinBased(t));

//     for (const term of terms) {
//       if (labelText.includes(term) || term.includes(labelText)) {
//         // Longer match = more specific = better
//         const score = term.length;
//         if (score > bestScore) {
//           bestScore = score;
//           bestMatch = info;
//         }
//       }
//     }
//   }

//   return bestMatch;
// }






/*========================================*/
/*========================================*/
/*========================================*/
/*========================================*/



let profileData = [];
let dropdown = null;
let activeInput = null;
let dropdownEnabled = true;

// Mapping mode state
let mappingMode = false;
let mappingOverlay = null;
let mappingTarget = null;
let highlightBox = null;
let mappingMoveTimer = null;

// ─── STYLES ─────────────────────────────────
const STYLES = `
  #__af_dropdown__ {
    position: absolute; z-index: 2147483647; background: #0f0f13;
    border: 1px solid #2a2a3a; border-radius: 12px; padding: 6px;
    min-width: 280px; max-width: 360px; max-height: 280px;
    overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15);
    font-family: 'Segoe UI', system-ui, sans-serif; scrollbar-width: thin;
  }
  #__af_dropdown__::-webkit-scrollbar { width: 4px; }
  #__af_dropdown__::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 4px; }
  .__af_header__ { font-size: 9px; font-weight: 700; color: #4a4a6a; padding: 4px 10px 8px; border-bottom: 1px solid #1a1a2a; margin-bottom: 4px; text-transform: uppercase; }
  .__af_item__ { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: background 0.12s; border: 1px solid transparent; }
  .__af_item__:hover { background: #1a1a2a; border-color: #2a2a3a; }
  .__af_item__.__af_match__ { background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.2); }
  .__af_dot__ { width: 7px; height: 7px; border-radius: 50%; background: #3a3a5a; }
  .__af_item__.__af_match__ .__af_dot__ { background: #7c3aed; box-shadow: 0 0 6px rgba(124,58,237,0.6); }
  .__af_field__ { font-size: 11px; font-weight: 700; color: #9090b8; min-width: 72px; font-family: 'Courier New', monospace; }
  .__af_item__.__af_match__ .__af_field__ { color: #a78bfa; }
  .__af_value__ { font-size: 12px; color: #c8c8e8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  .__af_focused_input__ { outline: 2px solid rgba(124,58,237,0.5) !important; outline-offset: 2px !important; }

  /* Mapping mode styles */
  .__af_mapping_cursor__ * { cursor: crosshair !important; }
  .__af_highlight_box__ {
    position: fixed; pointer-events: none; z-index: 2147483640;
    border: 2px solid #3b82f6; border-radius: 6px;
    background: rgba(59,130,246,0.06); transition: all 0.1s ease;
  }
  #__af_mapping_overlay__ {
    position: fixed; z-index: 2147483647; background: #0f0f13;
    border: 1px solid #3b82f6; border-radius: 14px; padding: 12px 14px;
    min-width: 240px; max-width: 320px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.2);
    font-family: 'Segoe UI', system-ui, sans-serif; pointer-events: all;
  }
  #__af_mapping_overlay__ .__af_mo_label__ { font-size: 10px; font-weight: 700; color: #4a4a6a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  #__af_mapping_overlay__ .__af_mo_detected__ { font-size: 11px; color: #6b7280; margin-bottom: 10px; padding: 4px 8px; background: #1a1a2a; border-radius: 6px; }
  #__af_mapping_overlay__ .__af_mo_field__ { font-size: 13px; font-weight: 700; color: #a78bfa; margin-bottom: 2px; }
  #__af_mapping_overlay__ .__af_mo_value__ { font-size: 12px; color: #c8c8e8; margin-bottom: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #__af_mapping_overlay__ .__af_mo_none__ { font-size: 12px; color: #6b7280; margin-bottom: 12px; font-style: italic; }
  #__af_mapping_overlay__ .__af_mo_buttons__ { display: flex; gap: 8px; }
  #__af_mapping_overlay__ .__af_mo_fill__ { flex: 1; padding: 6px 12px; background: #7c3aed; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
  #__af_mapping_overlay__ .__af_mo_fill__:hover { background: #6d28d9; }
  #__af_mapping_overlay__ .__af_mo_fill__:disabled { background: #3a3a5a; cursor: not-allowed; }
  #__af_mapping_overlay__ .__af_mo_skip__ { padding: 6px 12px; background: #1a1a2a; color: #9090b8; border: 1px solid #2a2a3a; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
  #__af_mapping_overlay__ .__af_mo_skip__:hover { background: #2a2a3a; }
  #__af_mapping_overlay__ .__af_mo_badge__ { display: inline-block; font-size: 9px; font-weight: 700; color: #f97316; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3); border-radius: 4px; padding: 1px 5px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
  #__af_mapping_overlay__ .__af_mo_esc__ { font-size: 10px; color: #4a4a6a; text-align: center; margin-top: 10px; }
`;

// ─── INIT ────────────────────────────────────
function init() {
  injectStyles();

  try {
    if (!chrome?.runtime?.id) {
      attachListeners();
      return;
    }
    // Load both profileData and dropdownEnabled before attaching listeners
    chrome.storage.local.get(['info', 'dropdownEnabled'], (result) => {
      profileData = result.info || [];
      dropdownEnabled = result.dropdownEnabled !== false; // default true
      attachListeners();
    });
  } catch (e) {
    attachListeners();
  }

  // Keep in sync with live storage changes
  try {
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.info) profileData = changes.info.newValue || [];
        if (changes.dropdownEnabled !== undefined) {
          dropdownEnabled = changes.dropdownEnabled.newValue;
          if (!dropdownEnabled) removeDropdown();
        }
      });
    }
  } catch (e) {}
}

function injectStyles() {
  if (document.getElementById('__af_styles__')) return;
  const style = document.createElement('style');
  style.id = '__af_styles__';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

// ─── MESSAGE LISTENER ────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'autoFillForm') {
    const data = request.data;
    const filled = [];
    const unmatched = [];

    data.forEach(info => {
      const element = findBestMatchingInputBtn(info);
      if (element) {
        fillInputElement(element, info.title);
        filled.push(info.field);
      } else {
        unmatched.push(info.field);
      }
    });

    sendResponse({ status: 'success', filled, unmatched });
  }

  if (request.action === 'enableDropdown') {
    dropdownEnabled = true;
    sendResponse({ status: 'ok' });
  }

  if (request.action === 'disableDropdown') {
    dropdownEnabled = false;
    removeDropdown();
    sendResponse({ status: 'ok' });
  }

  if (request.action === 'startMappingMode') {
    startMappingMode();
    sendResponse({ status: 'ok' });
  }

  if (request.action === 'stopMappingMode') {
    stopMappingMode();
    sendResponse({ status: 'ok' });
  }

  return true;
});

// ============================================
// AUTO FILL HELPERS
// ============================================

function isLatinBased(text) {
  return /^[a-z\s'"\/\-_.@+:]+$/i.test(text);
}

function getSearchTerms(info) {
  return [info.field, ...(info.tags || [])]
    .map(t => (typeof t === 'object' ? t.tagName : t).toLowerCase())
    .filter(t => isLatinBased(t));
}

function findBestMatchingInput(info) {
  const searchTerms = getSearchTerms(info);

  let element = findByDirectAttributes(searchTerms);
  if (element && verifyInputContextByTerms(element, searchTerms)) return element;

  element = findByContextVerification(searchTerms);
  if (element) return element;

  return null;
}

function findByDirectAttributes(searchTerms) {
  const selector = searchTerms.map(term =>
    `input[name*="${term}" i], input[id*="${term}" i], input[placeholder*="${term}" i], textarea[name*="${term}" i]`
  ).join(', ');
  try { return document.querySelector(selector); } catch (e) { return null; }
}

function findByContextVerification(searchTerms) {
  const allInputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]), textarea');
  for (const input of allInputs) {
    if (verifyInputContextByTerms(input, searchTerms)) return input;
  }
  return null;
}

function verifyInputContextByTerms(input, searchTerms) {
  let current = input;
  for (let i = 0; i < 5; i++) {
    if (!current || current === document.body) break;
    const text = current.innerText?.toLowerCase() || '';
    if (searchTerms.some(term => text.includes(term))) return true;
    current = current.parentElement;
  }

  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      const t = label.innerText?.toLowerCase();
      if (searchTerms.some(term => t?.includes(term))) return true;
    }
  }

  const ariaLabel = input.getAttribute('aria-label')?.toLowerCase();
  if (ariaLabel && searchTerms.some(term => ariaLabel.includes(term))) return true;

  const labelledById = input.getAttribute('aria-labelledby');
  if (labelledById) {
    const ref = document.getElementById(labelledById);
    const t = ref?.innerText?.toLowerCase();
    if (t && searchTerms.some(term => t.includes(term))) return true;
  }

  return false;
}

// ============================================
// DROPDOWN
// ============================================

function verifyInputContext(input, info) {
  const searchTerms = [info.field, ...(info.tags || [])]
    .map(t => (typeof t === 'object' ? t.tagName : t).toLowerCase())
    .filter(t => isLatinBased(t));
  return verifyInputContextByTerms(input, searchTerms);
}

function showDropdown(input) {
  removeDropdown();
  activeInput = input;
  input.classList.add('__af_focused_input__');

  const sorted = [...profileData].sort((a, b) => {
    const aM = verifyInputContext(input, a);
    const bM = verifyInputContext(input, b);
    return aM === bM ? 0 : aM ? -1 : 1;
  });

  dropdown = document.createElement('div');
  dropdown.id = '__af_dropdown__';
  dropdown.innerHTML = `<div class="__af_header__">Quick Fill</div>`;

  sorted.forEach(info => {
    const matched = verifyInputContext(input, info);
    const item = document.createElement('div');
    item.className = '__af_item__' + (matched ? ' __af_match__' : '');
    item.innerHTML = `
      <div class="__af_dot__"></div>
      <div class="__af_field__">${info.field}</div>
      <div class="__af_value__" title="${info.title}">${info.title}</div>
    `;
    item.addEventListener('mousedown', (e) => {
      e.preventDefault();
      fillInputElementByClickBtn(input, info.title);
      removeDropdown();
    });
    dropdown.appendChild(item);
  });

  document.body.appendChild(dropdown);
  positionDropdown(input);
}

function positionDropdown(input) {
  if (!dropdown) return;
  const rect = input.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < 200) {
    dropdown.style.top = `${rect.top + window.scrollY - dropdown.offsetHeight - 5}px`;
  } else {
    dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
  }
  dropdown.style.left = `${rect.left + window.scrollX}px`;
  dropdown.style.width = `${Math.max(rect.width, 280)}px`;
}

function removeDropdown() {
  if (dropdown) { dropdown.remove(); dropdown = null; }
  if (activeInput) { activeInput.classList.remove('__af_focused_input__'); activeInput = null; }
}

// ============================================
// MAPPING MODE
// ============================================

function detectLabelForElement(el) {
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`);
    if (label) return label.innerText?.trim();
  }
  if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
  if (el.getAttribute('aria-labelledby')) {
    const ref = document.getElementById(el.getAttribute('aria-labelledby'));
    if (ref) return ref.innerText?.trim();
  }
  if (el.placeholder) return el.placeholder.trim();

  let current = el.parentElement;
  for (let i = 0; i < 5; i++) {
    if (!current || current === document.body) break;
    const candidates = current.querySelectorAll('label, legend, span, b, strong');
    for (const c of candidates) {
      if (c.contains(el)) continue;
      const text = c.innerText?.trim();
      if (text && text.length > 0 && text.length < 60) return text;
    }
    current = current.parentElement;
  }
  return null;
}

function findBestMatchForLabel(labelText) {
  if (!labelText || profileData.length === 0) return null;
  const label = labelText.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const info of profileData) {
    const terms = [info.field, ...(info.tags || [])]
      .map(t => (typeof t === 'object' ? t.tagName : t).toLowerCase());
    for (const term of terms) {
      if (label.includes(term) || term.includes(label)) {
        const score = term.length;
        if (score > bestScore) { bestScore = score; bestMatch = info; }
      }
    }
  }
  return bestMatch;
}

function findInputNearElement(el) {
  const SELECTOR = 'input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]):not([type="button"]), textarea';
  if (el.matches?.(SELECTOR)) return el;
  const child = el.querySelector?.(SELECTOR);
  if (child) return child;
  let current = el.parentElement;
  for (let i = 0; i < 5; i++) {
    if (!current || current === document.body) break;
    const found = current.querySelector(SELECTOR);
    if (found) return found;
    current = current.parentElement;
  }
  return null;
}

function showHighlight(input) {
  removeHighlight();
  const rect = input.getBoundingClientRect();
  highlightBox = document.createElement('div');
  highlightBox.className = '__af_highlight_box__';
  highlightBox.style.top = `${rect.top}px`;
  highlightBox.style.left = `${rect.left}px`;
  highlightBox.style.width = `${rect.width}px`;
  highlightBox.style.height = `${rect.height}px`;
  document.body.appendChild(highlightBox);
}

function removeHighlight() {
  if (highlightBox) { highlightBox.remove(); highlightBox = null; }
}

function showMappingOverlay(input, labelText, bestMatch, mouseX, mouseY) {
  removeMappingOverlay();
  mappingTarget = input;

  const overlay = document.createElement('div');
  overlay.id = '__af_mapping_overlay__';
  overlay.innerHTML = `
    <div class="__af_mo_badge__">🎯 Mapping Mode</div>
    <div class="__af_mo_label__">Detected Field</div>
    <div class="__af_mo_detected__">${labelText || '(no label found)'}</div>
    ${bestMatch
      ? `<div class="__af_mo_field__">${bestMatch.field}</div>
         <div class="__af_mo_value__" title="${bestMatch.title}">${bestMatch.title}</div>`
      : `<div class="__af_mo_none__">No matching profile field found</div>`
    }
    <div class="__af_mo_buttons__">
      <button class="__af_mo_fill__" ${!bestMatch ? 'disabled' : ''}>✓ Fill</button>
      <button class="__af_mo_skip__">✗ Skip</button>
    </div>
    <div class="__af_mo_esc__">Press ESC to exit mapping mode</div>
  `;

  document.body.appendChild(overlay);
  mappingOverlay = overlay;

  // Position near mouse, keep within viewport
  const ow = 320, oh = 200;
  let x = mouseX + 16;
  let y = mouseY + 16;
  if (x + ow > window.innerWidth) x = mouseX - ow - 8;
  if (y + oh > window.innerHeight) y = mouseY - oh - 8;
  overlay.style.left = `${x}px`;
  overlay.style.top = `${y}px`;

  overlay.querySelector('.__af_mo_fill__').addEventListener('click', (e) => {
    e.stopPropagation();
    if (bestMatch && mappingTarget) {
      fillInputElement(mappingTarget, bestMatch.title);
      removeMappingOverlay();
      removeHighlight();
      mappingTarget = null;
    }
  });

  overlay.querySelector('.__af_mo_skip__').addEventListener('click', (e) => {
    e.stopPropagation();
    removeMappingOverlay();
    removeHighlight();
    mappingTarget = null;
  });
}

function removeMappingOverlay() {
  if (mappingOverlay) { mappingOverlay.remove(); mappingOverlay = null; }
}

function onMappingMouseMove(e) {
  if (mappingOverlay && mappingOverlay.contains(e.target)) return;
  clearTimeout(mappingMoveTimer);
  mappingMoveTimer = setTimeout(() => {
    const input = findInputNearElement(e.target);
    if (!input) {
      removeMappingOverlay();
      removeHighlight();
      mappingTarget = null;
      return;
    }
    if (input === mappingTarget && mappingOverlay) return;
    const labelText = detectLabelForElement(input);
    const bestMatch = findBestMatchForLabel(labelText);
    showHighlight(input);
    showMappingOverlay(input, labelText, bestMatch, e.clientX, e.clientY);
  }, 80);
}

function onMappingKeyDown(e) {
  if (e.key === 'Escape') stopMappingMode();
}

function startMappingMode() {
  mappingMode = true;
  document.body.classList.add('__af_mapping_cursor__');
  document.addEventListener('mousemove', onMappingMouseMove);
  document.addEventListener('keydown', onMappingKeyDown);
}

function stopMappingMode() {
  mappingMode = false;
  document.body.classList.remove('__af_mapping_cursor__');
  document.removeEventListener('mousemove', onMappingMouseMove);
  document.removeEventListener('keydown', onMappingKeyDown);
  removeMappingOverlay();
  removeHighlight();
  mappingTarget = null;
  clearTimeout(mappingMoveTimer);
}

// ============================================
// FILL ENGINE
// ============================================

function fillInputElement(element, value) {
  element.focus();
  try {
    if (element.tagName === 'TEXTAREA') {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(element, value);
    } else if (element.hasAttribute('contenteditable')) {
      element.innerText = value;
    } else {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, value);
    }
  } catch (e) {
    element.value = value;
  }
  element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

// ============================================
// LISTENERS
// ============================================

function attachListeners() {
  const SELECTOR = 'input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]), textarea';

  document.addEventListener('focusin', (e) => {
    if (!dropdownEnabled) return;
    if (mappingMode) return; // don't show dropdown during mapping
    if (!chrome?.runtime?.id) return;
    const input = e.target.closest(SELECTOR);
    if (!input) return;

    if (profileData.length > 0) {
      showDropdown(input);
    } else {
      chrome.storage.local.get('info', (result) => {
        profileData = result.info || [];
        if (profileData.length > 0) showDropdown(input);
      });
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (dropdown && !dropdown.contains(e.target) && e.target !== activeInput) {
      removeDropdown();
    }
  });

  window.addEventListener('resize', () => { if (activeInput) positionDropdown(activeInput); });
  window.addEventListener('scroll', () => { if (activeInput) positionDropdown(activeInput); }, { passive: true });
}

// ─── START ───────────────────────────────────
init();