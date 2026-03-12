import { useState } from "react"
import Popup from "./features/fill-forms/Popup"

type Tabs = 'fill-forms' | 'send-emails'

function App() {

  const [tabs, setTabs] = useState<Tabs>('fill-forms')

  const openInFullPage = () => {
    if (window.chrome && chrome.runtime && chrome.runtime.getURL) {
      const url = chrome.runtime.getURL("index.html");
      chrome.tabs.create({ url });
    }
  };


  return (
    <main className="container p-4 bg-brand-bg">


      <button
        onClick={openInFullPage}
        className="save-button mb-3 text-white px-4 py-2 rounded-lg"
      >
        Open Full Page
      </button>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setTabs('fill-forms')} className="save-button p-2 rounded-lg">Fill Form</button>
        {/* <button onClick={() => setTabs('send-emails')} className="save-button p-2 rounded-lg">Send Emails</button> */}
      </div>
      {tabs === 'fill-forms' && <Popup />}
      {/* {tabs === 'send-emails' && <SendEmails />} */}
    </main>
  )
}

export default App