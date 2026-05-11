const cors = require('cors');

app.use(cors({
  origin: 'https://flowdesk-production-3f4a.up.railway.app',
  credentials: true
}));