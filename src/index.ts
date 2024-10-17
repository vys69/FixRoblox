import express from 'express';
import router from './routes';

const app = express();
const port = process.env.PORT || 6969;

app.use('/', router);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export default app;
