const { auth, adminAuth } = require('./middleware/auth');
console.log('auth type:', typeof auth);
console.log('adminAuth type:', typeof adminAuth);
console.log('auth value:', auth);
console.log('adminAuth value:', adminAuth);
