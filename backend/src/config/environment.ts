export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/iou_db'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || ''
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development'
  }
};
