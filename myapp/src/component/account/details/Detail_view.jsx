import { Box, Typography ,styled} from '@mui/material';
import {Edit,Delete} from '@mui/icons-material';
import { useParams,Link, useNavigate } from 'react-router-dom';
import { useEffect, useState ,useContext} from 'react';
import { API } from '../../../service/api.js';
import { DataContext } from '../../../context/DataProvider.jsx';

// components
import Comments from './comments/comments.jsx';



const Container = styled(Box)(({ theme })=>({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));

const Image = styled('img')({
       width:'100%',
       height: '60vh',
       objectFit: 'cover',
});

const Heading = styled(Typography)`
   font-size: 38px;
   font-weight: 600;
   text-align: center;
   margin: 50px 0 10px 0;
   word-break: break-word;

`; 

const EditIcon = styled(Edit)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
`;

const DeleteIcon = styled(Delete)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
`;

const Author = styled(Box)`
  color: #878787;
  margin: 20px 0;
  display: flex;
`;

const Description = styled(Typography)`
  word-break: break-word;   
`;



const DetailView = () => {
    const [post, setPost] = useState({});

    const { id } = useParams();
    const {account} = useContext(DataContext);

    const navigate = useNavigate();

    const url = post.picture ? post.picture : 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

    useEffect(() => {
        const fetchData = async () => {
            try {
                //console.log('Fetching post with ID:', id);
                let response = await API.getPostByid(id);
               // console.log('API Response:', response);
                if (response.issuccess) {
                    setPost(response.data);
                   // console.log('Post fetched and state updated:', response.data);
                } else {
                    //console.error("Failed to fetch post data", response.message);
                }
            } catch (error) {
                //console.error("Error fetching post data", error);
            }
        }
        fetchData();
    }, [id]);

    // Check component rerendering by logging outside useEffect
    useEffect(() => {
        //console.log('Component Rerendered, Current Post State:', post);
    }, [post]);

    // Handling case where post might be empty initially
    if (!post.title) return <Typography>Loading...</Typography>;

    const deleteBlog = async () =>{
        try {
            let response = await API.deletePost(post._id); // Just pass the ID
            if (response.issuccess) {
                navigate('/');
            } else {
                console.error('Failed to delete post:', response.msg);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    return (
        <Container>
            <Image src={url} alt='blog' />
            <Box style = {{float:'right'}}>
                {
                    account.username === post.username && 
                    <>
                    <Link to={`/update/${post._id}`}> <EditIcon color="primary" /></Link> 
                    <DeleteIcon onClick={() => deleteBlog()}color="error" />
                    </>
                }
                
            </Box>
            <Heading>{post.title}</Heading>

            <Author mt={2}>
                <Typography>Author: <Box component="span" style={{fontWeight: 600}}>{post.username}</Box></Typography>
                <Typography style={{marginLeft: 'auto'}}>
                    {new Date(post.createdDate).toDateString()}
                </Typography>
            </Author>
            <Description>{post.description}</Description>
            <Comments post={post} />
        </Container>
    );
}

export default DetailView;
