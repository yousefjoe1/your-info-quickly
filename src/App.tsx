import { useState } from "react"
import Popup from "./features/fill-forms/Popup"

type Tabs = 'fill-forms' | 'send-emails'

function App() {

  const [tabs] = useState<Tabs>('fill-forms')
  // const [dropdownEnabled, setDropdownEnabled] = useState(true)

  const openInFullPage = () => {
    if (window.chrome && chrome.runtime && chrome.runtime.getURL) {
      const url = chrome.runtime.getURL("index.html");
      chrome.tabs.create({ url });
    }
  };

  const openSidePanel = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.sidePanel.open({ tabId: tab.id })
      }
    })
  }
  // const toggleDropdown = async () => {
  //   const newState = !dropdownEnabled
  //   setDropdownEnabled(newState)

  //   // Save to storage first — this is what content.js reads on re-injection
  //   await chrome.storage.local.set({ dropdownEnabled: newState })

  //   // Then message the active tab to update without needing re-injection
  //   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  //   if (!tab?.id) return

  //   await chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     files: ['content.js'],
  //   })

  //   chrome.tabs.sendMessage(tab.id, {
  //     action: newState ? 'enableDropdown' : 'disableDropdown',
  //   })
  // }

  const [mappingMode, setMappingMode] = useState(false)

  const toggleMappingMode = async () => {
    const newState = !mappingMode
    setMappingMode(newState)

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    })

    chrome.tabs.sendMessage(tab.id, {
      action: newState ? 'startMappingMode' : 'stopMappingMode',
    })

    // Close popup so user can see the page
    // if (newState) window.close()
  }
  return (
    <main className="container h-screen p-4 bg-brand-bg">

      <button title="close button" onClick={() => window.close()} className="absolute border border-brand-border rounded-full p-2 top-2 right-2">
        ❌
      </button>

      <div className="flex items-center mb-3 gap-2">
        <button
          onClick={toggleMappingMode}
          className={`save-button px-4 py-2 rounded-lg border transition-colors text-white ${mappingMode
            ? 'bg-danger hover:bg-danger/80 border-danger'
            : 'bg-brand-bg'
            }`}
        >
          {mappingMode ? '🛑 Stop Mapping' : '🎯 Map Fields'}
        </button>
        <button
          onClick={openInFullPage}
          className="save-button text-white px-4 py-2 rounded-lg"
        >
          Open Full Page
        </button>
        <button
          onClick={openSidePanel}
          className="save-button text-white px-4 py-2 rounded-lg"
        >
          Open Side Panel
        </button>

        {/* <button
          onClick={toggleDropdown}
          className={`px-4 py-2 rounded-lg border transition-colors text-white ${dropdownEnabled
            ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
            : "bg-gray-600 hover:bg-gray-700 border-gray-500"
            }`}
        >
          {dropdownEnabled ? "✅ Dropdown ON" : "⭕ Dropdown OFF"}
        </button> */}

      </div>

      {/* <div className="flex gap-2 mb-2">
        <button onClick={() => setTabs('fill-forms')} className="save-button p-2 rounded-lg">Fill Form</button>
        <button onClick={() => setTabs('send-emails')} className="save-button p-2 rounded-lg">Send Emails</button>
      </div> */}
      {tabs === 'fill-forms' && <Popup />}
      {/* {tabs === 'send-emails' && <SendEmails />} */}
    </main>
  )
}

export default App