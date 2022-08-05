import Stripe from 'stripe';
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.SK_TEST);
import {storage, db} from '../db.js'
import {
    ref,
    uploadBytesResumable ,
    getDownloadURL
} from "firebase/storage";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore"; 

export const uploadPost = async (req, res) => {
    const post = JSON.parse(req.body.post)
    const id = req.body.paymentId
    const images = req.files
    const insertPost = {
        title: post.name,
        description: post.desc,
        category:post.category,
        images: [],
        created_at:Timestamp.now().toDate()
    }

    //make payment
    try {
        const payment = await stripe.paymentIntents.create({
            amount:500,
            currency:"USD",
            description:"Post Fancy Frens",
            payment_method:id,
            confirm:true
        }).then(result=>{
            url_array_get(images).then((urls)=>{
                //add to collection
                insertPost.images=urls
                const str=insertPost.created_at.toString().split(" ")
                insertPost.created_at=`${str[2]}/${str[1]}/${str[3]}`
                addDocument(insertPost).then((id)=>{
                    res.status(200).json({
                        id:id,
                        ...insertPost
                    })
                })
            })
        })
    } catch (error) {
        res.status(404).json({message:"Payment Failed"})
    }
}

function url_array_get(images){
    let promises = [];
    images.forEach(function(image) {
        const timestamp = Date.now();
        const name = image.originalname.split(".")[0];
        const type = image.originalname.split(".")[1];
        const fileName = `${name}_${timestamp}.${type}`;

        let storageRef = ref(storage, fileName)
        promises.push(
            uploadBytesResumable(storageRef, image.buffer).then((snapshot) => {
                return getDownloadURL(storageRef).then((url)=>{
                    return url
                })
            }) 
        )
    });
    return Promise.all(promises);
}

async function addDocument(post){
    try {
        const doc = await addDoc(collection(db, "posts"), post)
        return doc.id

    } catch (e) {
      console.error("Error adding document: ", e);
    }
}

