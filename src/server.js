import app from './app';
import { seedPlatformAdmin } from './scripts/seedPlatformAdmin';
async function bootstrap() {
    // This variable will hold our server instance
    let server;
    try {
        // Start the server
        server = app.listen(5000, () => {
            console.log(`🚀 Tour Guide.. Server is running on http://localhost:5000`);
        });
        // Function to gracefully shut down the server
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed gracefully.');
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        };
        const unexpectedErrorHandler = (error) => {
            console.error(error);
            exitHandler();
        };
        // Handle unhandled promise rejections
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        process.on('SIGINT', () => exitHandler());
    }
    catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}
(async () => {
    await bootstrap();
    await seedPlatformAdmin();
})();
