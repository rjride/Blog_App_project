import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from "@mui/material";
import {AddCircle as Add} from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DataContext } from '../../../context/DataProvider';
import { API } from '../../../service/api';

// Styled Components
const Container = styled(Box)(({ theme })=>({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex:1;
    margin: 0 30px;
    font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
    width: 100%;
    margin-top: 50px;
    font-size: 18px;
    border: none;
    &:focus-visible {
        outline: none;
    }
`;

// Initial Post State
const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
};

const Update = () => {
    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState(null);
    const { account } = useContext(DataContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const url = post.picture ? post.picture : "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";

    // Fetch Post Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching post with ID:', id);
                let response = await API.getPostByid(id);
                console.log('API Response:', response);

                if (response.issuccess) {
                    if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
                        console.log('Valid data received:', response.data);

                        // Logging each field of the response data to debug
                        Object.keys(response.data).forEach(key => {
                            console.log(`${key}:`, response.data[key]);
                        });

                        // Update post state with fetched data
                        setPost(prevPost => ({
                            ...prevPost,
                            ...response.data
                        }));
                    } else {
                        console.error("No valid data in response or response data is not an object");
                    }
                } else {
                    console.error("Failed to fetch post data:", response.message || 'Unknown error');
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };
        fetchData();
    }, [id]);

    // Handle File Upload
    useEffect(() => {
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);

                try {
                    const response = await API.uploadFile(data);
                    if (response.isSuccess && response.data) {
                        console.log("Uploaded image data:", response.data);
                        setPost(prevPost => ({ ...prevPost, picture: response.data }));
                    } else {
                        console.error("Failed to upload image:", response.message || 'No data in response');
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            }
        };
        getImage();

        // Set initial categories and username
        setPost(prevPost => ({
            ...prevPost,
            categories: location.search?.split('=')[1] || 'All',
            username: account.username
        }));

        console.log("Categories set to:", location.search?.split('=')[1] || 'All');
        console.log("Username set to:", account.username);
    }, [file, location.search, account.username]);

    // Debug Component Rerender
    useEffect(() => {
        console.log('Component Rerendered, Current Post State:', post);
    }, [post]);

    // Handle Input Change
    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    // Update Blog Post
    const updateBlogPost = async () => {
        try {
            let response = await API.updatePost(post);
            if (response.issuccess) {
                navigate(`/details/${id}`);
            } else {
                console.error("Failed to update post:", response.message || 'Unknown error');
                console.log("Response object:", response);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <Container>
            <Image src={url} alt='banner' />
            <StyledFormControl>
            <label htmlFor="fileInput">
                <Add fontSize="large" color="action" />
            </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <InputTextField
                    placeholder="Title"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                />
                <Button onClick={updateBlogPost} variant="contained" color="primary">Update</Button>
            </StyledFormControl>
            <Textarea
                minRows={5}
                placeholder="Tell your story..."
                onChange={handleChange}
                name="description"
                value={post.description}
            />
        </Container>
    );
};

export default Update;
