const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${url}`);
  
  // Serve video at /HomeRow
  if (url === '/HomeRow' || url === '/HomeRow/' || url === '/homerow' || url === '/homerow/') {
    const videoPath = path.join(__dirname, 'out', 'home-row.mp4');
    
    fs.stat(videoPath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Video not found');
        return;
      }
      
      // Handle range requests for seeking
      const range = req.headers.range;
      
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        const chunksize = (end - start) + 1;
        
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });
        
        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': stats.size,
          'Content-Type': 'video/mp4',
        });
        
        fs.createReadStream(videoPath).pipe(res);
      }
    });
    return;
  }
  
  // Serve landing page at root
  if (url === '/' || url === '') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>typing.com Video Preview</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #4a90d9 0%, #2d5a87 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          h1 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          }
          .subtitle {
            color: rgba(255,255,255,0.9);
            font-size: 1.2rem;
            margin-bottom: 2rem;
          }
          .video-container {
            background: rgba(0,0,0,0.3);
            border-radius: 16px;
            padding: 1rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          video {
            border-radius: 8px;
            max-width: 100%;
            width: 800px;
          }
          .branding {
            position: fixed;
            top: 20px;
            right: 20px;
            color: rgba(255,255,255,0.8);
            font-size: 1.5rem;
            font-weight: 700;
          }
          .footer {
            margin-top: 2rem;
            color: rgba(255,255,255,0.7);
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <div class="branding">typing.com</div>
        <h1>🎹 The Home Row</h1>
        <p class="subtitle">Learn proper finger placement for touch typing</p>
        <div class="video-container">
          <video controls autoplay>
            <source src="/HomeRow" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <p class="footer">Built with Remotion | typing.com Video POC</p>
      </body>
      </html>
    `);
    return;
  }
  
  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🎬 Video server running at http://localhost:${PORT}`);
  console.log(`📺 Video available at http://localhost:${PORT}/HomeRow`);
});
