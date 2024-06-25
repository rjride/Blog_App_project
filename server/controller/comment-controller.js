import Comments from '../modal/comment.js';




export const newComment = async(request,response) =>{
    try{
const comment = await new Comments(request.body);
comment.save();
response.status(200).json({msg: 'comment saved successfully'});
    }catch(error){
        response.status(500).json({ error: error.message});
    }
}


export  const getComments = async(request,response)=>{
    try{
const comments = await Comments.find({postId: request.params.id});
response.status(200).json(comments);
    }catch(error){
response.status(500).json({error: error.message})
    }
}

export const deleteComment = async (request,response) =>{
           
            try {

                        const commentId = request.params.id;
        console.log(`Attempting to delete comment with ID: ${commentId}`);
                const comment = await Comments.findByIdAndDelete(commentId);
                if (!comment) {
                    console.log('Comment not found');
                    return response.status(404).json({ error: 'Comment not found' });
                }
                
                console.log('Comment deleted successfully');
                return response.status(200).json({ msg: 'Comment deleted successfully' });
            } catch (error) {
                console.error('Error deleting comment:', error);
                response.status(500).json({ error: error.message });
            }
            // try {
            //     const commentId = request.params._id;
            //     console.log(`Attempting to delete comment with ID: ${commentId}`); // Log the comment ID
                
            //     const comment = await Comments.findById(commentId);
            //     if (!comment) {
            //         console.log('Comment not found');
            //         return response.status(404).json({ error: 'Comment not found' });
            //     }
        
            //     await comment.remove();
            //     console.log('Comment deleted successfully');
            //     return response.status(200).json({ msg: 'Comment deleted successfully' });
            // } catch (error) {
            //     console.error('Error deleting comment:', error);
            //     return response.status(500).json({ error: error.message });
            // }
        };