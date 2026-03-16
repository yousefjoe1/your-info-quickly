// // content.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "autoFillForm") {
//     const data = request.data;

//     data.forEach(info => {
//       // const searchTerm = info.field.toLowerCase();

//             const isLatinBased = (text) => {
//     // Matches only basic Latin letters (a-z), optionally with spaces and apostrophes
//     const latinRegex = /^[a-z\s'"]+$/i;
//     return latinRegex.test(text);
// };

// const searchTerm = [info.field, ...(info.tags || [])]
//     .map(t => {
//         const tagName = typeof t === 'object' ? t.tagName : t;
//         return tagName.toLowerCase();
//     })
//     .filter(t => isLatinBased(t));

//       // الـ Selectors في CSS تستخدم *= للبحث عن "يحتوي على"
//       // سنبحث في name و id و placeholder
//       const selector = `
//         input[name*="${searchTerm}" i], 
//         input[id*="${searchTerm}" i], 
//         input[placeholder*="${searchTerm}" i],
//         textarea[name*="${searchTerm}" i],
//         textarea[id*="${searchTerm}" i]
//       `.replace(/\s+/g, ' ').trim(); 

//       const element = document.querySelector(selector);

//       if (element) {
//         element.value = info.title;
//         element.dispatchEvent(new Event('input', { bubbles: true }));
//         element.dispatchEvent(new Event('change', { bubbles: true }));
//       } else {
//         console.log("❌ ~ No element found for:", searchTerm);
//       }
//     });
    
//     sendResponse({ status: "success" });
//   }
//   return true; 
// });

// content.js

// approach 2
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "autoFillForm") {
//     const data = request.data;

//     data.forEach(info => {
//       const searchTerm = info.field.toLowerCase();

//       const standardSelector = `
//         input[name*="${searchTerm}" i], input[id*="${searchTerm}" i], 
//         input[placeholder*="${searchTerm}" i], textarea[name*="${searchTerm}" i]
//       `.replace(/\s+/g, ' ').trim();

//       let element = document.querySelector(standardSelector);

//       if (!element) {
//         console.log(`🔍 Searching smartly for: ${searchTerm}`);
        
//         const allElements = document.querySelectorAll('label, span, div, p, th');
        
//         for (let target of allElements) {
//           if (target.innerText?.toLowerCase().includes(searchTerm) && target.innerText.length < 100) {
            
//             if (target.tagName === 'LABEL' && target.htmlFor) {
//                element = document.getElementById(target.htmlFor);
//             }

//             if (!element) {
//               const parent = target.parentElement;
//               element = parent.querySelector('input, textarea');
//             }

//             if (element) {
//               console.log("🎯 Smart Match Found via parent/label logic!");
//               break; 
//             }
//           }
//         }
//       }

//       if (element) {
//         element.value = info.title;
//         element.dispatchEvent(new Event('input', { bubbles: true }));
//         element.dispatchEvent(new Event('change', { bubbles: true }));
//         console.log(`Filled: ${searchTerm}`);
//       } else {
//         console.log(`Could not find any match for: ${searchTerm}`);
//       }
//     });

//     sendResponse({ status: "success" });
//   }
//   return true;
// });


// approach 3
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "autoFillForm") {
//     const data = request.data;

//     data.forEach(info => {
//       const isLatinBased = (text) => {
//     const latinRegex = /^[a-z\s'"]+$/i;
//     return latinRegex.test(text);
// };

// const searchTerms = [info.field, ...(info.tags || [])]
//     .map(t => {
//         const tagName = typeof t === 'object' ? t.tagName : t;
//         return tagName.toLowerCase();
//     })
//     .filter(t => isLatinBased(t));


//       let element = null;

//       // 2. Initial Attempt: Standard Selectors
//       const standardSelector = searchTerms.map(term => 
//         `input[name*="${term}" i], input[id*="${term}" i], input[placeholder*="${term}" i], textarea[name*="${term}" i]`
//       ).join(', ');

//       element = document.querySelector(standardSelector);

//       // 3. The Bubble-Up Strategy (3-Level Deep Search)
//       if (!element) {
//         // Find all text-bearing elements
//         const potentialLabels = document.querySelectorAll('label, span, div, p, th, b');
        
//         for (let target of potentialLabels) {
//           const text = target.innerText?.trim().toLowerCase();
          
//           // Check if the element's text matches any of our keywords
//           if (text && searchTerms.some(term => text.includes(term)) && text.length < 30) {
            
//             // Start climbing: check Current, Parent, Grandparent, Great-Grandparent
//             let currentLevel = target;
//             for (let i = 0; i < 3; i++) {
//               if (!currentLevel || currentLevel === document.body) break;

//               // Search for an input/textarea inside this specific branch
//               const found = currentLevel.querySelector('input:not([type="hidden"]), textarea, [contenteditable="true"]');
              
//               if (found) {
//                 element = found;
//                 console.log(`🎯 Found via level ${i} parent:`, target.innerText);
//                 break; 
//               }
//               currentLevel = currentLevel.parentElement;
//             }
//           }
//           if (element) break;
//         }
//       }

//       // 4. Filling the Element
//       if (element) {
//         // Handle React-controlled inputs by setting the value through the prototype
//         const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
//         nativeInputValueSetter.call(element, info.title);

//         // Trigger events so React/Vue state updates
//         element.dispatchEvent(new Event('input', { bubbles: true }));
//         element.dispatchEvent(new Event('change', { bubbles: true }));
//         // element.value = info.title;
//         // element.dispatchEvent(new Event('input', { bubbles: true }));
//         // element.dispatchEvent(new Event('change', { bubbles: true }))
//       }
//     });

//     sendResponse({ status: "success" });
//   }
//   return true;
// });

// approach 4
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autoFillForm") {
    const data = request.data;
    
    data.forEach(info => {
      const element = findBestMatchingInput(info);
      
      if (element) {
        fillInputElement(element, info.title);
        console.log(`✅ Filled "${info.field}" with "${info.title}"`);
      } else {
        console.warn(`❌ Could not find input for "${info.field}"`);
      }
    });
    
    sendResponse({ status: "success" });
  }
  return true;
});

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
  if (element && verifyInputContext(element, searchTerms)) {
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
    if (verifyInputContext(input, searchTerms)) {
      return input;
    }
  }
  
  return null;
}

function verifyInputContext(input, searchTerms) {
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
      
      // Check if text matches our search terms
      if (text && text.length > 0 && text.length < 50) {
        for (let term of searchTerms) {
          if (text.includes(term)) {
            console.log(`📍 Verified at level ${level}: "${text}" contains "${term}"`);
            return true;
          }
        }
      }
    }
    
    // Also check the associated label via 'for' attribute
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        const labelText = label.innerText?.trim().toLowerCase();
        if (labelText && searchTerms.some(term => labelText.includes(term))) {
          console.log(`📍 Verified via label[for]: "${labelText}"`);
          return true;
        }
      }
    }
    
    // Check aria-label and aria-labelledby
    if (input.hasAttribute('aria-label')) {
      const ariaLabel = input.getAttribute('aria-label').toLowerCase();
      if (searchTerms.some(term => ariaLabel.includes(term))) {
        console.log(`📍 Verified via aria-label: "${ariaLabel}"`);
        return true;
      }
    }
    
    if (input.hasAttribute('aria-labelledby')) {
      const labelId = input.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(labelId);
      if (labelElement) {
        const labelText = labelElement.innerText?.trim().toLowerCase();
        if (labelText && searchTerms.some(term => labelText.includes(term))) {
          console.log(`📍 Verified via aria-labelledby: "${labelText}"`);
          return true;
        }
      }
    }
    
    currentElement = currentElement.parentElement;
  }
  
  return false;
}

function fillInputElement(element, value) {
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


// =================================================================================================
// 
// =================================================================================================

// // approach 5
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "autoFillForm") {
//     const data = request.data;
    
//     data.forEach(info => {
//       const element = findBestMatchingInput(info);
      
//       if (element) {
//         fillInputElement(element, info.title);
//         console.log(`✅ Filled "${info.field}" with "${info.title}"`);
//       } else {
//         console.warn(`❌ Could not find input for "${info.field}"`);
//       }
//     });
    
//     sendResponse({ status: "success" });
//   }
//   return true;
// });

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

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
//   if (element && verifyInputContext(element, searchTerms)) {
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
//     if (verifyInputContext(input, searchTerms)) {
//       return input;
//     }
//   }
  
//   return null;
// }

// function verifyInputContext(input, searchTerms) {
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
      
//       // Check if text matches any of our search terms using includes
//       if (text && text.length > 0 && text.length < 50) {
//         const matchedTerm = searchTerms.find(term => text.includes(term));
//         if (matchedTerm) {
//           console.log(`📍 Verified at level ${level}: "${text}" contains "${matchedTerm}"`);
//           return true;
//         }
//       }
//     }
    
//     // Also check the associated label via 'for' attribute
//     if (input.id) {
//       const label = document.querySelector(`label[for="${input.id}"]`);
//       if (label) {
//         const labelText = label.innerText?.trim().toLowerCase();
//         const matchedTerm = searchTerms.find(term => labelText?.includes(term));
//         if (matchedTerm) {
//           console.log(`📍 Verified via label[for]: "${labelText}" contains "${matchedTerm}"`);
//           return true;
//         }
//       }
//     }
    
//     // Check aria-label and aria-labelledby
//     if (input.hasAttribute('aria-label')) {
//       const ariaLabel = input.getAttribute('aria-label').toLowerCase();
//       const matchedTerm = searchTerms.find(term => ariaLabel.includes(term));
//       if (matchedTerm) {
//         console.log(`📍 Verified via aria-label: "${ariaLabel}" contains "${matchedTerm}"`);
//         return true;
//       }
//     }
    
//     if (input.hasAttribute('aria-labelledby')) {
//       const labelId = input.getAttribute('aria-labelledby');
//       const labelElement = document.getElementById(labelId);
//       if (labelElement) {
//         const labelText = labelElement.innerText?.trim().toLowerCase();
//         const matchedTerm = searchTerms.find(term => labelText?.includes(term));
//         if (matchedTerm) {
//           console.log(`📍 Verified via aria-labelledby: "${labelText}" contains "${matchedTerm}"`);
//           return true;
//         }
//       }
//     }
    
//     currentElement = currentElement.parentElement;
//   }
  
//   return false;
// }

// function fillInputElement(element, value) {
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

