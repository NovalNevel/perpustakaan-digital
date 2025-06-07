import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auth_routes from "./routes/auth_routes";
import user_routes from "./routes/user_routes";
import book_routes from './routes/book_routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth_routes);

app.use("/api/users", user_routes);

app.use('/api/books', book_routes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
