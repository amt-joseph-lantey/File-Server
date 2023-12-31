// Import necessary modules and libraries
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import passwordRoutes from "./routes/passwordRoutes";
import db from "./connection/database";
import fileRoutes from "./routes/fileRoutes";
import downloadRoutes from "./routes/downloadRoutes";
import path from "path";

// Create a class for the Express server
export class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = 5000; // Define the server port

    this.connectDatabase();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureEJS();
    this.configureStaticDirectories();
    this.startServer();
  }

  // Configure middleware functions
  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

  }

  // Configure API routes
  private configureRoutes(): void {
    this.app.use("/api", userRoutes);
    this.app.use("/api", passwordRoutes);
    this.app.use("/api", fileRoutes);
    this.app.use("/api", downloadRoutes);
  }

  // Connect to the database asynchronously
  private async connectDatabase(): Promise<void> {
    try {
      await db.connect(); // Attempt to connect to the database
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  // Configure the view engine (EJS)
  private configureEJS(): void {
    this.app.set("view engine", "ejs"); // Set the view engine to EJS
    this.app.set("views", path.join(__dirname, "..", "src", "views")); // Define the path to view templates
  }

  // Configure static directories for serving files (e.g., CSS, JavaScript)
  private configureStaticDirectories(): void {
    this.app.use(express.static(path.join(__dirname, "public"))); // Define the path to the public directory
  }

  private startServer(): void {
    this.app.get("/", (req, res) => {
      res.render("login");
    });

    // Start listening on the defined port
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

// Create a new instance of the server class to start the Express server
new Server();
