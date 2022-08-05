import { collection, query, getDocs, Timestamp, where, orderBy} from "firebase/firestore"; 
import {db} from '../db.js'


export const getPosts = async (req, res)=>{
    //find date 7 days ago from now
    const now = Timestamp.now()
    const weekAgo = Timestamp.fromMillis(now.toMillis() - 604800000).toDate()
    
    try {
        // const posts = await query(collection('posts').where("created_at", ">=", weekAgo))
        const q = query(collection(db, "posts"), where("created_at", ">=", weekAgo), orderBy("created_at", "desc"))
        const querySnapshot = await getDocs(q);

        const result = []
        querySnapshot.forEach((doc) => {
            const str=doc.data().created_at.toDate().toString().split(" ")
            result.push({
                id:doc.id,
                title:doc.data().title,
                description:doc.data().description,
                images:doc.data().images,
                category:doc.data().category,
                created_at:`${str[2]}/${str[1]}/${str[3]}`
            })
        });
        
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }

};