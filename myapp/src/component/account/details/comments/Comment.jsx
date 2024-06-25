import { useContext } from "react";
import { Box, Typography,styled } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { DataContext } from "../../../../context/DataProvider";
import { API } from "../../../../service/api.js";

const DeleteIcon = styled(Delete)`
         margin-left: auto;
`

const Component = styled(Box)`
margin-top: 30px;
background: #F5F5F5;
padding: 10px;
`;

const Container = styled(Box)`
  display: flex;
  margin-bottom: 5px;
`
const Typostyle = styled(Typography)`
 font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
  
`;

const StyledDate = styled(Typography)`
  color: #878787;
  font-size: 14px;
`

const Comment = ({comment,setToggle}) =>{

    const {account} = useContext(DataContext);

    const removeComment = async() =>{
        try {
            console.log('Deleting comment with ID:', comment._id);
            let response = await API.deleteComment(comment._id);
            if (response.issuccess) {
                setToggle(prevState => !prevState);
            }else{
                console.error('Error deleting comment:', response.data);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

     return (
        <Component>
            
          <Container>
          <Typostyle >{'@'}{comment.name}</Typostyle> 
             <StyledDate >{new Date(comment.date).toDateString()}</StyledDate>
             {comment.name === account.username && <DeleteIcon onClick={()=> removeComment()}/>}
          </Container>  
         <Box>
         <Typography>{comment.comments}</Typography>
         </Box>
          
        </Component>
     );
};

export default Comment;