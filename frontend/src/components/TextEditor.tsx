import React, { useState, useEffect, useRef } from 'react';

const TextEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [summary, setSummary] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const getSuggestion = async () => {
      if (text.length > 0) {
        try {
          const response = await fetch('http://localhost:3000/api/suggest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
          });
          const data = await response.json();
          setSuggestion(data.suggestion);
        } catch (error) {
          console.error('Error fetching suggestion:', error);
        }
      } else {
        setSuggestion('');
      }
    };

    const debounce = setTimeout(getSuggestion, 300);
    return () => clearTimeout(debounce);
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setText(suggestion);
      setSuggestion('');
    }
  };

  const handleSummarize = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  return (
    <div className="text-editor-container">
      <div className="ai-suggestions">
        <h3>AI Suggestions <span>&lt;Click TAB to USE&gt;</span></h3>
        <div className="suggestion-box">{suggestion}</div>
      </div>
      <div className="text-editor">
        <h3>Text Editor</h3>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing..."
        />
      </div>
      <div className="summary-section">
        <button className="summarize-button" onClick={handleSummarize}>Summarize</button>
        <div className="summary-box">
          <h3>Summary</h3>
          <div>{summary}</div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;