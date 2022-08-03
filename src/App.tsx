import React from 'react';
import './App.css';
import { invoke, } from '@tauri-apps/api'
import { useState, useEffect, useCallback } from 'react'
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/html";


function App() {
  const [html, setHtml] = useState<string>();
  const [md, setMd] = useState<string>();
  const [showHint, setShowHint] = useState<boolean>(true);
  useEffect(() => {
    invoke('get_markdown', { html: html })
      .then((response: any) => setMd(response))
  }, [html])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey === true) {
      if (event.key === "s") {
        setShowHint(false)
        document.getElementById("save-modal")?.click()
        
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const saveMd = async () => {
    if (md) {
      await writeTextFile(`document${md.length}_${new Date().toJSON().slice(0, 10)}.md`, md, { dir: BaseDirectory.Download });
    }
  }

  return (
    <div className='App m-9'>
      <h1 className='text-center text-white text-4xl font-bold'>HTML ➡️ Markdown</h1>
      <div className="flex justify-center">
        <AceEditor
          mode="html"
          theme="monokai"
          width='78%'
          onChange={(e) => { setHtml(e) }}
          name="htmlEditor"
          editorProps={{ $blockScrolling: true }}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          enableBasicAutocompletion={true}
        />
      </div>

      <br />
      <div>

        <pre>
          <code>
            <textarea className='textarea rounded-xl bg-neutral focus:outline-none' placeholder='Markdown output' cols={50} rows={10} value={md}></textarea>
          </code>
        </pre>
      </div>
{md ? <label htmlFor='save-modal' className='btn modal-button btn-primary'>Save md file</label> : <label htmlFor='save-modal' className='btn modal-button btn-disabled'>Save md file</label>}
      {md ? (<>
        

        <input type='checkbox' id='save-modal' onClick={saveMd} className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg'>Your markdown file has been saved!</h3>
            <p className='py-4'>You can find it in your downloads folder as {`document${md.length}_${new Date().toJSON().slice(0, 10)}.md`}</p>
            {showHint ? <p className='text-gray-500'>Did you know that you can hit CTRL + S while editing to quickly save your file?</p> : null}
            <div className='modal-action'>
              <label htmlFor='save-modal' className='btn'>Nice!</label>
            </div>
          </div>
        </div>
      </>) : null}
    </div>
  );
}

export default App;
