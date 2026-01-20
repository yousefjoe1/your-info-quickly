import { useState } from "react"
import Popup from "./features/fill-forms/Popup"

type Tabs = 'fill-forms' | 'send-emails'

function App() {

  const [tabs, setTabs] = useState<Tabs>('fill-forms')

  return (
    <main className="container p-4 bg-brand-bg">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setTabs('fill-forms')} className="save-button p-2 rounded-lg">Fill Forms</button>
        <button onClick={() => setTabs('send-emails')} className="save-button p-2 rounded-lg">Send Emails</button>
      </div>
      {tabs === 'fill-forms' && <Popup />}
      {/* {tabs === 'send-emails' && <SendEmails />} */}
    </main>
  )
}

export default App