import { connectDB } from './config/db';
import { env } from './config/env';
import app from './app';

// Start server
const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📝 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 API URL: http://localhost:${env.PORT}/api`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;
