import * as http from 'http';
import { userRoutes } from './routes/user.route';

const server = http.createServer(userRoutes);

const PORT = 3000;
server.listen(process.env.PORT || PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
