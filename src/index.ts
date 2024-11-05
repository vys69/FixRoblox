import 'dotenv/config';
import express from 'express';
import routes from './routes';

const app = express();
const port = process.env.PORT || 6969;

app.use('/', routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export default app;
