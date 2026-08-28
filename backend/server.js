import dotenv from 'dotenv';

// The project .env must win over unrelated system-level environment values.
dotenv.config({ override: true });

const { default: app } = await import('./app.js');
const { connectDatabase } = await import('./config/db.js');
const port = Number(process.env.PORT || 5000);

connectDatabase()
  .then(() => {
    const server = app.listen(port, () => console.info(`API listening on ${port}`));

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. The RCDF API may already be running.`);
      } else {
        console.error('Unable to start API:', error.message);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('Unable to start API:', error.message);
    process.exit(1);
  });
