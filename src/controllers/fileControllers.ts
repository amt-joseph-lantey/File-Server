import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import db from "../connection/database";



const uploadDirectory: string = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (req: Request, file: Express.Multer.File, callback) => {
        callback(null, file.originalname);
    },
});

export const upload = multer({ storage: storage });

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const uploadedFile = req.file as Express.Multer.File;

        console.log(`Uploaded file: ${uploadedFile.originalname}`);

        const filename: string = uploadedFile.originalname;
        const description: string = req.body.description;

        // Insert the file details (filename and description) into the "files" table
        const insertFile: string =
            "INSERT INTO files (filename, description) VALUES ($1, $2) RETURNING id";
        const values: (string | number)[] = [filename, description];
        const result: any = await db.query(insertFile, values);
        const fileId: number = result.rows[0].id;

        return res.status(201).json({ id: fileId, filename, description });
    } catch (error) {
        console.error("Error uploading file: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUploadedFiles = async (req: Request, res: Response) => {
    try {
        const files = await db.query("SELECT * FROM files", []);
        res.status(200).json(files.rows);
    } catch (error) {
        console.log("Error fetching uploaded files", error);
        res.status(500).json({ message: "Error fetching uploaded files", error });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join("dist", "uploads", filename);

    try {
        // Check if the file exists before attempting to delete it
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        // Delete the file
        fs.unlinkSync(filePath);

        // Delete the file record from the database
        const result = await db.query("DELETE FROM files WHERE filename = $1", [
            filename,
        ]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "File deleted successfully" });
        } else {
            res.status(404).json({ message: "File not found" });
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Error deleting file" });
    }
};


export const searchFile = async (req: Request, res: Response) => {
    const filename = req.params.filename;

    try {
        // Search for files in the database matching the filename
        const searchResults = await db.query("SELECT id, filename, description FROM files WHERE filename LIKE $1", 
        [filename]);

        const files = searchResults.rows;

    } catch (error) {
        // Handle errors here
        console.error('Error searching for files:', error);
        res.status(500).send('Internal Server Error');
    }
};



