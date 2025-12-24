const basicsInfo = [
    {
        field: "Name",
        title: "",
        type: "text",
        tags: ["name", "your name", "full name", "الاسم", "الاسم بالكامل", "اسمك"]
    },
    {
        field: "Phone",
        title: "",
        type: "tel",
        tags: ["your phone", "phone number", "what's app", "cell phone", "الهاتف", "رقم الجوال", "رقم الهاتف", "واتساب",'رقم الواتس']
    },
    {
        field: "Email",
        title: "",
        type: "email",
        tags: ["email", "your email", "contact email", "البريد الإلكتروني", "الايميل"]
    },
    {
        field: "LinkedIn",
        title: "",
        type: "url",
        tags: ["linked in", "linkedIn", "linkedin", "لينكد إن", "لينكدين"]
    },
    {
        field: "Experience",
        title: "",
        type: "text",
        tags: ["experience", "current experience", "total experience", "الخبرة", "سنوات الخبرة", "خبراتك"]
    },
    {
        field: "Location",
        title: "",
        type: "text",
        tags: ["location", "city", "الموقع", "العنوان", "المدينة", "محل الإقامة",'country','البلد','الدولة']
    },
    {
        field: "Github",
        title: "",
        type: "url",
        tags: ["github", "git hub", "جيت هاب"]
    },
    {
        field: "Portfolio",
        title: "",
        type: "url",
        tags: ["portfolio", "website", "web site", "projects", "معرض الأعمال", "الموقع الشخصي", "موقعك", "رابط أعمالك"]
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
    chrome.storage.local.get(['info'], (result) => {
      sendResponse({
        success: true,
        data: result.info || []
      });
    });
    return true; // ⬅️ مهم
  }

  // SAVE
  if (message.action === 'saveData') {
    chrome.storage.local.set(
      { info: message.data },
      () => {
        sendResponse({ success: true });
      }
    );
    return true; // ⬅️ مهم جدًا
  }

});
