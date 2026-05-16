const mongoose = require('mongoose');

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] Geen MONGODB_URI ingesteld, MongoDB wordt niet gebruikt');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('[Database] ✅ Verbonden met MongoDB');
  } catch (err) {
    console.error('[Database] ❌ Fout bij verbinden:', err.message);
  }
}

module.exports = { connect };
