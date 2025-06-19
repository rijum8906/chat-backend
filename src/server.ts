import { app } from '@/app';
import appRouter from '@/routes/v1/routes';
import { globalErrorHandler } from '@/middlewares/errorHandler';

app.use('/api/v1', appRouter);

// Global Error Handler
app.use(globalErrorHandler());

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
