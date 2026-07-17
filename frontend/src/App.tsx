import { useState } from 'react';
import './index.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) return;

    const url = "http://localhost:3000/url";
    const options = {
      method : 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        url: longUrl,
      }) 
    }

    try{
      const response = await fetch(url,options);
      if (!response.ok) throw new Error ('Failed to fetch url');
      const result = await response.json(); 
      setShortUrl(result["Shortened URL"]);
      setIsCopied(false);
    }catch(error){
      console.error(error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <h1 className="title">NanoLink</h1>
      <p className="subtitle">Shorten your massive links with style.</p>

      <div className="glass-card">
        <form onSubmit={handleSubmit} className="input-group">
          <input
            type="url"
            className="input-field"
            placeholder="Paste your long URL here..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn">
            Shorten URL
          </button>
        </form>

        {shortUrl && (
          <div className="result-container">
            <div className="result-label">Your new Short Link</div>
            <div className="result-box">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-url">
                {shortUrl}
              </a>
              <button type="button" onClick={copyToClipboard} className="copy-btn">
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
