import { Box,TextareaAutosize,Button,styled } from "@mui/material";
import { useState,useContext,useEffect } from "react";
import {DataContext} from '../../../../context/DataProvider.jsx';
import {API} from '../../../../service/api.js';

//component
import Comment from "./Comment.jsx";



const Container = styled(Box)`
     margin-top: 100px;
     display : flex;
`;

const Image = styled('img')({
    width: 50,
    height: 50,
    borderRadius: '50%'
})

const StyledTextArea = styled(TextareaAutosize)`
        height: 100%;
        width: 100%;
        margin: 0 20px;

`;

const initialValues = {
    name: '',
    postId:'',
    comments: '',
    date: new Date()
}

export const Comments = ({post}) => {


    const url = 'https://static.thenounproject.com/png/12017-200.png';

    const {account} = useContext(DataContext);
    const [comment,setComment] = useState(initialValues);
    const [comments,setComments] = useState([]);
    const [error, setError] = useState(null);
    const [toggle,setToggle] = useState(false);
    
 useEffect(()=>{
     const getData = async() =>{
      const response =  await API.getAllComments(post._id);
      if(response.issuccess){
       setComments(response.data); 
      }else{
        setError('Could not fetch comments.');
      }
     }
     getData();
 },[post,toggle])

const handleChange = (e) =>{
   // console.log('Before setComment:', comment);
    try {
      setComment({
        ...comment,
        name: account.username,
        postId: post._id,
        comments: e.target.value
      });
     // console.log('After setComment:', comment);
    } catch (error) {
      console.error('Error in handleChange:', error);
    }
}


const addComment = async(e)=>{
  let response = await  API.newComment(comment) ;
  if(response.issuccess){
    setComment(initialValues);
    // adding  this line 
    setComments(prevComments => [...prevComments, response.data]);
  }
  setToggle(prevstate =>!prevstate);
};




    return (
        <Box>
            <Container>
              <Image src={url} alt="dp" />
              <StyledTextArea
              minRows={5}
              placeholder="what's in your mind?"
              value={comment.comments}
              onChange={(e) => handleChange(e)}
               />
              <Button variant="contained" 
              color="primary"
               size="medium" 
               style={{ height: 40 }}
               onClick={(e) => addComment(e)}>Post</Button>
            </Container>
            {error && <Box color="red">{error}</Box>}
            <Box>
                
                {
                    comments && comments.length > 0 && comments.map((comment, index) => (
                    <Comment key={index} comment={comment} setToggle={setToggle} />

                    ))
                }
            </Box>
            
        </Box>
    )
}

export default Comments;