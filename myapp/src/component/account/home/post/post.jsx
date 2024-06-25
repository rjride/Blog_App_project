import { useEffect, useState } from "react";
import { API } from "../../../../service/api.js";
import { Box ,Grid} from "@mui/material";
import Post from './SinglePost.jsx';
import {useSearchParams,Link} from 'react-router-dom';


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await API.getAllPosts({category: category || '' });
       // console.log('API response:', response);

        if (response.issuccess) {
        //  console.log('Setting posts:', response.data);
          setPosts(response.data);
        } else {
       //   console.error('API response is not successful:', response);
        }
      } catch (error) {
       // console.error('Failed to fetch posts:', error);
      }
    };
    fetchData();
  }, [category]);

  //console.log('Rendering posts:', posts);

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <Grid item lg={3} sm={4} xs={12}>
            <Link to={`details/${post._id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
            <Post  post={post} />
            </Link>
            {/* key={index}               */}
          </Grid>
        ))
      ) : (
        <Box style={{ color: '#878787', margin: '30px 80px', fontSize: 18 }}>
          No data available to display
        </Box>
      )}
    </>
  );
};

export default Posts;
