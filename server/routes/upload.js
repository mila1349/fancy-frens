import express from "express";
import { upload } from "../middleware/image.js";
import {uploadPost} from "../controllers/uploadPost.js";
import {getPosts} from '../controllers/getPost.js'
import { getPost } from "../controllers/getSinglePost.js";

const router = express.Router();
router.post('/upload', upload, uploadPost);
router.get('/posts', getPosts);
router.post('/posts', getPost);


export default router