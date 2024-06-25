import { request, response } from 'express';
import Post from '../modal/post.js';




export const CreatePost = async(request,response) => {
    try{
    const post =  await new Post(request.body);
    post.save();
    return response.status(200).json('Post saved successfully');
} catch(error){
       return response.status(500).json(error);
}
}

export const getAllPosts = async (request,response) =>{
      let category = request.query.category;
      let posts;
    try{
      if(category){
      posts = await Post.find({categories: category})
      }else{
       posts =  await Post.find({})
      }
    return response.status(200).json(posts);
    }catch(error){
      return response.status(500).json({ msg: error.message});
    }
}

export const getPost = async (request,response) =>{
try{
  const post = await Post.findById(request.params.id);
return response.status(200).json(post);
}catch(error){
  return response.status(500).json({ msg: error.message});
}
}

export const updatePost = async(request,response) =>{
  try{
    const post = await Post.findById(request.params.id);
    if(!post){
      return response.status(404).json({msg: 'Post not find'});
    }
    await Post.findByIdAndUpdate(request.params.id,{$set: request.body}) // $set -> to replace the data 
    return response.status(200).json({ msg:'post updated successfully' })//$addToset for append the data
  }catch(error){
      return response.status(500).json({ msg: error.message});
  }
} 

// export const deletePost = async(request,response) =>{
//   try{
//     const post = await Post.findById(request.params.id);
//     if(!post){
//       return response.status(404).json({msg: 'Post not find'});
//     }
//     await post.delete();
//     return response.status(200).json({ msg:'post deleted successfully' });
//   }catch(error){
//       return response.status(500).json({ msg: error.message});
//   }
// } 

export const deletePost = async (request, response) => {
  try {
      // Find the post by its ID
      const post = await Post.findById(request.params.id);
      
      // If the post is not found, return a 404 error
      if (!post) {
          return response.status(404).json({ msg: 'Post not found' });
      }

      // Remove the post from the database
      await Post.findByIdAndDelete(request.params.id);

      // Respond with a success message
      return response.status(200).json({ msg: 'Post deleted successfully' });
  } catch (error) {
      // Log and respond with a 500 error if something goes wrong
      console.error('Error deleting post:', error);
      return response.status(500).json({ msg: error.message });
  }
};
