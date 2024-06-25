import {GridFsStorage} from 'multer-gridfs-storage';
import dotenv from 'dotenv'; 
import multer from 'multer';



dotenv.config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;



const storage = new GridFsStorage({
    url: `mongodb+srv://${username}:${password}@blog-app.0vngbur.mongodb.net/blogapp?retryWrites=true&w=majority`,
    options:{ useNewUrlParser: true},
    file: (request,file) =>{
        console.log('File received:', file); // Log the file being uploaded
        const match = ["image/png","image/jpg","image/jpeg"];
        if(match.indexOf(file.mimetype) === -1){
            console.log('Invalid file type:', file.mimetype);
            return `${Date.now()}-blog-${file.originalname}`;
        }
        return{
            // bucketName: "photos",
            // filename:`${Date.now()}-blog-${file.originalname}`
            filename: `${Date.now()}-blog-${file.originalname}`,
            metadata: { contentType: file.mimetype } 
        };
    }
});
export default multer({ storage});
// const upload = multer({ storage });
// export default upload;