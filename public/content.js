// // content.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "autoFillForm") {
//     const data = request.data;

//     data.forEach(info => {
//       // نحول اسم الحقل للغة صغيرة للبحث
//       const searchTerm = info.field.toLowerCase();

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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autoFillForm") {
    const data = request.data;

    data.forEach(info => {
      // 1. Prepare match terms (Field name + custom tags)
      const searchTerms = [info.field, ...(info.tags || [])].map(t => t.toLowerCase());
      let element = null;

      // 2. Initial Attempt: Standard Selectors
      const standardSelector = searchTerms.map(term => 
        `input[name*="${term}" i], input[id*="${term}" i], input[placeholder*="${term}" i], textarea[name*="${term}" i]`
      ).join(', ');

      element = document.querySelector(standardSelector);

      // 3. The Bubble-Up Strategy (3-Level Deep Search)
      if (!element) {
        // Find all text-bearing elements
        const potentialLabels = document.querySelectorAll('label, span, div, p, th, b');
        
        for (let target of potentialLabels) {
          const text = target.innerText?.trim().toLowerCase();
          
          // Check if the element's text matches any of our keywords
          if (text && searchTerms.some(term => text.includes(term)) && text.length < 50) {
            
            // Start climbing: check Current, Parent, Grandparent, Great-Grandparent
            let currentLevel = target;
            for (let i = 0; i < 3; i++) {
              if (!currentLevel || currentLevel === document.body) break;

              // Search for an input/textarea inside this specific branch
              const found = currentLevel.querySelector('input:not([type="hidden"]), textarea, [contenteditable="true"]');
              
              if (found) {
                element = found;
                console.log(`🎯 Found via level ${i} parent:`, target.innerText);
                break; 
              }
              currentLevel = currentLevel.parentElement;
            }
          }
          if (element) break;
        }
      }

      // 4. Filling the Element
      if (element) {
        // Handle React-controlled inputs by setting the value through the prototype
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(element, info.title);

        // Trigger events so React/Vue state updates
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    sendResponse({ status: "success" });
  }
  return true;
});