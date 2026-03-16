//todo : apply better approach

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autoFillForm") {
    const data = request.data;
    
    data.forEach(info => {
      const element = findBestMatchingInput(info);
      
      if (element) {
        fillInputElementByClick(element, info.title);
        console.log(`✅ Filled "${info.field}" with "${info.title}"`);
      } else {
        console.warn(`❌ Could not find input for "${info.field}"`);
      }
    });
    
    sendResponse({ status: "success" });
  }
  return true;
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function isLatinBased(text) {
  const latinRegex = /^[a-z\s'"]+$/i;
  return latinRegex.test(text);
}

function getSearchTerms(info) {
  return [info.field, ...(info.tags || [])]
    .map(t => {
      const tagName = typeof t === 'object' ? t.tagName : t;
      return tagName.toLowerCase();
    })
    .filter(t => isLatinBased(t));
}

function findBestMatchingInput(info) {
  const searchTerms = getSearchTerms(info);
  let element = null;
  
  // Strategy 1: Direct attribute matching
  element = findByDirectAttributes(searchTerms);
  if (element && verifyInputContextByClick(element, searchTerms)) {
    console.log('🎯 Found via direct attributes');
    return element;
  }
  
  // Strategy 2: Find input by verifying its context (labels/parent text)
  element = findByContextVerification(searchTerms);
  if (element) {
    console.log('🎯 Found via context verification');
    return element;
  }
  
  return null;
}

function findByDirectAttributes(searchTerms) {
  const standardSelector = searchTerms.map(term => 
    `input[name*="${term}" i], 
     input[id*="${term}" i], 
     input[placeholder*="${term}" i], 
     textarea[name*="${term}" i]`
  ).join(', ');
  
  return document.querySelector(standardSelector);
}

function findByContextVerification(searchTerms) {
  // Get all inputs on the page
  const allInputs = document.querySelectorAll('input:not([type="hidden"]), textarea, [contenteditable="true"]');
  
  for (let input of allInputs) {
    if (verifyInputContextByClick(input, searchTerms)) {
      return input;
    }
  }
  
  return null;
}

function verifyInputContextByClick(input, searchTerms) {
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

function fillInputElementByClick(element, value) {
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

// approach 4
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "autoFillForm") {
//     const data = request.data;
    
//     data.forEach(info => {
//       const element = findBestMatchingInput(info);
      
//       if (element) {
//         fillInputElementBtn(element, info.title);
//         console.log(`✅ Filled "${info.field}" with "${info.title}"`);
//       } else {
//         console.warn(`❌ Could not find input for "${info.field}"`);
//       }
//     });
    
//     sendResponse({ status: "success" });
//   }
//   return true;
// });

// function isLatinBased(text) {
//   const latinRegex = /^[a-z\s'"]+$/i;
//   return latinRegex.test(text);
// }

// function getSearchTerms(info) {
//   return [info.field, ...(info.tags || [])]
//     .map(t => {
//       const tagName = typeof t === 'object' ? t.tagName : t;
//       return tagName.toLowerCase();
//     })
//     .filter(t => isLatinBased(t));
// }

// function findBestMatchingInput(info) {
//   const searchTerms = getSearchTerms(info);
//   let element = null;
  
//   // Strategy 1: Direct attribute matching
//   element = findByDirectAttributes(searchTerms);
//   if (element && verifyInputContextBtn(element, searchTerms)) {
//     console.log('🎯 Found via direct attributes');
//     return element;
//   }
  
//   // Strategy 2: Find input by verifying its context (labels/parent text)
//   element = findByContextVerification(searchTerms);
//   if (element) {
//     console.log('🎯 Found via context verification');
//     return element;
//   }
  
//   return null;
// }

// function findByDirectAttributes(searchTerms) {
//   const standardSelector = searchTerms.map(term => 
//     `input[name*="${term}" i], 
//      input[id*="${term}" i], 
//      input[placeholder*="${term}" i], 
//      textarea[name*="${term}" i]`
//   ).join(', ');
  
//   return document.querySelector(standardSelector);
// }

// function findByContextVerification(searchTerms) {
//   // Get all inputs on the page
//   const allInputs = document.querySelectorAll('input:not([type="hidden"]), textarea, [contenteditable="true"]');
  
//   for (let input of allInputs) {
//     if (verifyInputContextBtn(input, searchTerms)) {
//       return input;
//     }
//   }
  
//   return null;
// }

// function verifyInputContextBtn(input, searchTerms) {
//   // Check up to 4 levels of parents
//   let currentElement = input;
//   const maxLevels = 4;
  
//   for (let level = 0; level < maxLevels; level++) {
//     if (!currentElement || currentElement === document.body) break;
    
//     // Check all text-bearing elements within this parent
//     const textElements = currentElement.querySelectorAll('label, span, div, p, th, b, legend, strong');
    
//     for (let textEl of textElements) {
//       // Skip if this element contains the input itself (avoid checking descendants)
//       if (textEl.contains(input) && textEl !== currentElement) continue;
      
//       const text = textEl.innerText?.trim().toLowerCase();
      
//       // Check if text matches our search terms
//       if (text && text.length > 0 && text.length < 50) {
//         for (let term of searchTerms) {
//           if (text.includes(term)) {
//             console.log(`📍 Verified at level ${level}: "${text}" contains "${term}"`);
//             return true;
//           }
//         }
//       }
//     }
    
//     // Also check the associated label via 'for' attribute
//     if (input.id) {
//       const label = document.querySelector(`label[for="${input.id}"]`);
//       if (label) {
//         const labelText = label.innerText?.trim().toLowerCase();
//         if (labelText && searchTerms.some(term => labelText.includes(term))) {
//           console.log(`📍 Verified via label[for]: "${labelText}"`);
//           return true;
//         }
//       }
//     }
    
//     // Check aria-label and aria-labelledby
//     if (input.hasAttribute('aria-label')) {
//       const ariaLabel = input.getAttribute('aria-label').toLowerCase();
//       if (searchTerms.some(term => ariaLabel.includes(term))) {
//         console.log(`📍 Verified via aria-label: "${ariaLabel}"`);
//         return true;
//       }
//     }
    
//     if (input.hasAttribute('aria-labelledby')) {
//       const labelId = input.getAttribute('aria-labelledby');
//       const labelElement = document.getElementById(labelId);
//       if (labelElement) {
//         const labelText = labelElement.innerText?.trim().toLowerCase();
//         if (labelText && searchTerms.some(term => labelText.includes(term))) {
//           console.log(`📍 Verified via aria-labelledby: "${labelText}"`);
//           return true;
//         }
//       }
//     }
    
//     currentElement = currentElement.parentElement;
//   }
  
//   return false;
// }

// function fillInputElementBtn(element, value) {
//   // Handle React/Vue controlled inputs
//   const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
//     window.HTMLInputElement.prototype, 
//     "value"
//   ).set;
  
//   const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
//     window.HTMLTextAreaElement.prototype, 
//     "value"
//   ).set;
  
//   if (element.tagName === 'TEXTAREA') {
//     nativeTextAreaValueSetter.call(element, value);
//   } else if (element.hasAttribute('contenteditable')) {
//     element.innerText = value;
//   } else {
//     nativeInputValueSetter.call(element, value);
//   }
  
//   // Trigger events for framework reactivity
//   element.dispatchEvent(new Event('input', { bubbles: true }));
//   element.dispatchEvent(new Event('change', { bubbles: true }));
//   element.dispatchEvent(new Event('blur', { bubbles: true }));
  
//   // Focus briefly to ensure visibility
//   element.focus();
// }







// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================
// ==========================================================================================================







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
`;

let profileData = [];
let dropdown = null;
let activeInput = null;

function init() {
  injectStyles();
  loadData();
  attachListeners();
  
  try {
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.info) profileData = changes.info.newValue || [];
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

function loadData() {
  try {
    if (!chrome?.runtime?.id) return;
    chrome.storage.local.get('info', (result) => {
      profileData = result.info || [];
    });
  } catch (e) {}
}

// ─── MATCHING ENGINE ────────────────────────
function verifyInputContext(input, info) {
  const searchTerms = [info.field, ...(info.tags || [])]
    .map(t => (typeof t === 'object' ? t.tagName : t).toLowerCase())
    .filter(t => /^[a-z\s'"]+$/i.test(t));

  let current = input;
  for (let i = 0; i < 5; i++) {
    if (!current || current === document.body) break;
    const text = current.innerText?.toLowerCase() || "";
    if (searchTerms.some(term => text.includes(term))) return true;
    current = current.parentElement;
  }
  return false;
}

// ─── DROPDOWN UI ────────────────────────────
function showDropdown(input) {
  removeDropdown();
  activeInput = input;
  input.classList.add('__af_focused_input__');

  const sorted = [...profileData].sort((a, b) => {
    const aM = verifyInputContext(input, a);
    const bM = verifyInputContext(input, b);
    return (aM === bM) ? 0 : aM ? -1 : 1;
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

    // Mousedown prevents blur from closing dropdown before selection
    item.addEventListener('mousedown', (e) => {
      e.preventDefault();
      fillInputElement(input, info.title);
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
  if (dropdown) {
    dropdown.remove();
    dropdown = null;
  }
  if (activeInput) {
    activeInput.classList.remove('__af_focused_input__');
    activeInput = null;
  }
}

// ─── FRAMEWORK-SAFE FILL ────────────────────
function fillInputElement(element, value) {
  element.focus();
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set || 
                 Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  
  try { setter.call(element, value); } catch (e) { element.value = value; }
  
  // High-compatibility events for Google Forms/React
  element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// ─── LISTENERS ──────────────────────────────
function attachListeners() {
  const SELECTOR = 'input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"]), textarea';

  // Open on Click / Focus
  document.addEventListener('focusin', (e) => {
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

  // Close when clicking outside
  document.addEventListener('mousedown', (e) => {
    if (dropdown && !dropdown.contains(e.target) && e.target !== activeInput) {
      removeDropdown();
    }
  });

  // Reposition on window changes
  window.addEventListener('resize', () => {
    if (activeInput) positionDropdown(activeInput);
  });
  window.addEventListener('scroll', () => {
    if (activeInput) positionDropdown(activeInput);
  }, { passive: true });
}

init();