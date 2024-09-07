import { BaseResponse, BlogResource, DataResponse } from "../resources";
import axiosConfig from '../configuration/axiosConfig';

class BlogService {
    createBlog(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Blog', payload);
    }

    getAllBlogs(): Promise<DataResponse<BlogResource[]>> {
        return axiosConfig.get('/api/Blog')
    }

    getBlogById(id: number | string) : Promise<DataResponse<BlogResource>> {
        return axiosConfig.get('/api/Blog/' + id)
    }

    updateBlog(id: number | string, payload: FormData) : Promise<void> {
        return axiosConfig.put('/api/Blog/' + id, payload)
    }

    getAllBlogExceptBlogId(id: number | string) : Promise<DataResponse<BlogResource[]>>  {
        return axiosConfig.get('/api/Blog/except/' + id)
    }

    getAllBlogRelatedUserId(userId: number | string, blogId: number | string) : Promise<DataResponse<BlogResource[]>>  {
        return axiosConfig.get('/api/Blog/related/' + userId + "/" + blogId)
    }

    hiddenBlog(id: number | string) : Promise<void> {
        return axiosConfig.put('/api/Blog/hidden/' + id)
    }

    showBlog(id: number | string) : Promise<void> {
        return axiosConfig.put('/api/Blog/show/' + id)
    }

    deleteBlog(id: number | string) : Promise<void> {
        return axiosConfig.delete('/api/Blog/' + id)
    }
}

const blogService = new BlogService();
export default blogService;