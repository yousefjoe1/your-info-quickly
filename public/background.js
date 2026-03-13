// const basicsInfo = [
//     {
//         field: "Name",
//         title: "Youssef Mahmoud",
//         type: "text",
//         tags: ["name", "your name", "full name", "الاسم", "الاسم بالكامل", "اسمك"]
//     },
//     {
//         field: "Phone",
//         title: "01554464169",
//         type: "tel",
//         tags: ["your phone", "phone number", "what's app", "cell phone", "الهاتف", "رقم الجوال", "رقم الهاتف", "واتساب",'رقم الواتس']
//     },
//     {
//         field: "Email",
//         title: "yousefmahmoud150@gmail.com",
//         type: "email",
//         tags: ["email", "your email", "contact email", "البريد الإلكتروني", "الايميل"]
//     },
//     {
//         field: "LinkedIn",
//         title: "https://www.linkedin.com/in/youssefmahmoud1/",
//         type: "url",
//         tags: ["linked in", "linkedIn", "linkedin", "لينكد إن", "لينكدين"]
//     },
//     {
//         field: "Experience",
//         title: "3+ years",
//         type: "text",
//         tags: ["experience", "current experience", "total experience", "الخبرة", "سنوات الخبرة", "خبراتك"]
//     },
//     {
//         field: "Location",
//         title: "Egypt",
//         type: "text",
//         tags: ["location", "city", "الموقع", "العنوان", "المدينة", "محل الإقامة",'country','البلد','الدولة']
//     },
//     {
//         field: "Github",
//         title: "https://github.com/yousefjoe1",
//         type: "url",
//         tags: ["github", "git hub", "جيت هاب"]
//     },
//     {
//         field: "Portfolio",
//         title: "https://yousefjoe1.github.io/Youssef_Portfolio/#/about",
//         type: "url",
//         tags: ["portfolio", "website", "web site", "projects", "معرض الأعمال", "الموقع الشخصي", "موقعك", "رابط أعمالك"]
//     },
//     {
//         field: "CV",
//         title: "https://drive.google.com/file/d/1NLYsFcKbiaEHWCF1ZyQcKnlrdOPJtPPt/view?usp=sharing",
//         type: "url",
//         tags: ["CV", "CV link","السيره الذاتيه"]
//     }
// ];


// background.js
const basicsInfo = [
    {
        id: "name",
        field: "Name",
        title: "Youssef Mahmoud",
        type: "text",
        tags: [
            { id: "name", tagName: "name" },
            { id: "your_name", tagName: "your name" },
            { id: "full_name", tagName: "full name" },
            { id: "al_ism", tagName: "الاسم" },
            { id: "al_ism_bilkamil", tagName: "الاسم بالكامل" },
            { id: "ismak", tagName: "اسمك" }
        ]
    },
    {
        id: "phone",
        field: "Phone",
        title: "01554464169",
        type: "tel",
        tags: [
            { id: "phone", tagName: "phone" },
            { id: "your_phone", tagName: "your phone" },
            { id: "phone_number", tagName: "phone number" },
            { id: "whats_app", tagName: "what's app" },
            { id: "cell_phone", tagName: "cell phone" },
            { id: "al_hatif", tagName: "الهاتف" },
            { id: "raqm_aljawal", tagName: "رقم الجوال" },
            { id: "raqm_alhatif", tagName: "رقم الهاتف" },
            { id: "watsab", tagName: "واتساب" },
            { id: "raqm_alwats", tagName: "رقم الواتس" }
        ]
    },
    {
        id: "email",
        field: "Email",
        title: "yousefmahmoud150@gmail.com",
        type: "email",
        tags: [
            { id: "email", tagName: "email" },
            { id: "your_email", tagName: "your email" },
            { id: "contact_email", tagName: "contact email" },
            { id: "al_bareed_alelectroni", tagName: "البريد الإلكتروني" },
            { id: "al_email", tagName: "الايميل" }
        ]
    },
    {
        id: "linkedin",
        field: "LinkedIn",
        title: "https://www.linkedin.com/in/youssefmahmoud1/",
        type: "url",
        tags: [
            { id: "linkedin", tagName: "linkedin" },
            { id: "linked_in", tagName: "linked in" },
            { id: "linkedin_ar", tagName: "لينكد إن" },
            { id: "linkedin_ar2", tagName: "لينكدين" }
        ]
    },
    {
        id: "experience",
        field: "Experience",
        title: "3+ years",
        type: "text",
        tags: [
            { id: "experience", tagName: "experience" },
            { id: "current_experience", tagName: "current experience" },
            { id: "total_experience", tagName: "total experience" },
            { id: "al_khibra", tagName: "الخبرة" },
            { id: "sanawat_alkhibra", tagName: "سنوات الخبرة" },
            { id: "khibratak", tagName: "خبراتك" }
        ]
    },
    {
        id: "location",
        field: "Location",
        title: "Egypt",
        type: "text",
        tags: [
            { id: "location", tagName: "location" },
            { id: "city", tagName: "city" },
            { id: "al_mawqae", tagName: "الموقع" },
            { id: "al_unwan", tagName: "العنوان" },
            { id: "al_madina", tagName: "المدينة" },
            { id: "mahal_al_iqama", tagName: "محل الإقامة" },
            { id: "country", tagName: "country" },
            { id: "al_balad", tagName: "البلد" },
            { id: "al_dawla", tagName: "الدولة" }
        ]
    },
    {
        id: "github",
        field: "Github",
        title: "https://github.com/yousefjoe1",
        type: "url",
        tags: [
            { id: "github", tagName: "github" },
            { id: "git_hub", tagName: "git hub" },
            { id: "git_hub_ar", tagName: "جيت هاب" }
        ]
    },
    {
        id: "portfolio",
        field: "Portfolio",
        title: "https://yousefjoe1.github.io/Youssef_Portfolio/#/about",
        type: "url",
        tags: [
            { id: "portfolio", tagName: "portfolio" },
            { id: "website", tagName: "website" },
            { id: "web_site", tagName: "web site" },
            { id: "projects", tagName: "projects" },
            { id: "maarad_alaamal", tagName: "معرض الأعمال" },
            { id: "al_mawqae_alshakhsi", tagName: "الموقع الشخصي" },
            { id: "mawqaeak", tagName: "موقعك" },
            { id: "rabat_aaamalak", tagName: "رابط أعمالك" }
        ]
    },
    {
        id: "cv",
        field: "CV",
        title: "https://drive.google.com/file/d/1NLYsFcKbiaEHWCF1ZyQcKnlrdOPJtPPt/view?usp=sharing",
        type: "url",
        tags: [
            { id: "cv", tagName: "cv" },
            { id: "cv_link", tagName: "cv link" },
            { id: "al_sira_althatia", tagName: "السيره الذاتيه" }
        ]
    }
];

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        // Check if data already exists just to be safe
        chrome.storage.local.get("info", (result) => {
            if (!result.info) {
                chrome.storage.local.set({ info: basicsInfo }, () => {
                    console.log("✅ Initialized basic info for the first time.");
                });
            }
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // GET
  if (message.action === 'getData') {
    chrome.storage.local.get("info", (result) => {
      sendResponse({
        success: true,
        data: result.info || []
      });
    });
    return true; 
  }

  // SAVE
  if (message.action === 'saveData') {
    chrome.storage.local.set(
      { info: message.data },
      () => {
        sendResponse({ success: true });
      }
    );
    return true;
  }

});
