import multer from "multer"

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage }).array('files', 4);
