import { collection, query, getDocs, Timestamp, where} from "firebase/firestore"; 
import {db} from '../db.js'


export const getPost = async (req, res)=>{
    const {title} = req.params

    try {
        const q = query(collection(db, "posts"), where("title", ">=", title))
        const querySnapshot = await getDocs(q);

        const result = []
        querySnapshot.forEach((doc) => {
            result.push({
                id:doc.id,
                title:doc.data().title,
                description:doc.data().description,
                images:doc.data().images,
                category:doc.data().category,
                created_at:doc.data().created_at.toDate()
            })
        });
        
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }

};