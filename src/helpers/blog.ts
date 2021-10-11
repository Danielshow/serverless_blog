import * as uuid from 'uuid'
import { BlogItem } from '../models/BlogItem'
import { BlogUpdate } from '../models/BlogUpdate'
import { TodoAccess } from './blogAccess'
import { CreateBlogRequest } from '../requests/CreateBlogRequest'
import { UpdateBlogRequest } from '../requests/UpdateBlogRequest'
import { BlogFileStorage } from './attachmentUtils'

const blogAccess = new TodoAccess()
const fileStorage = new BlogFileStorage()
const bucketName = process.env.BLOG_BUCKET

export async function getAllBlogs(): Promise<BlogItem[]> {
  const blogs = await blogAccess.getAllBlogs()
  return blogs;
}


export async function getUserBlogs(userId): Promise<BlogItem[]> {
  const blogs = await blogAccess.getUserBlogs(userId)
  return blogs;
}

export async function createBlog(
  createBlogRequest: CreateBlogRequest,
  userId: string
): Promise<BlogItem> {
  const blogId = uuid.v4()
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${blogId}`
  const data = {
    content: createBlogRequest.content,
    title: createBlogRequest.title,
    blogId,
    attachmentUrl,
    published: false,
    userId,
    createdAt: new Date().toISOString(),
    publishedAt: null,
  }
  
  await blogAccess.createBlog(data)
  return data
}

export async function updateBlog(
  updateBlogRequest: UpdateBlogRequest,
  userId: string,
  blogId: string
): Promise<BlogUpdate> {
  await blogAccess.updateBlog(blogId, updateBlogRequest, userId)
  return updateBlogRequest
}

export async function deleteBlog(
  blogId: string,
  userId: string
): Promise<null> {
  await blogAccess.deleteBlog(blogId, userId)
  return null
}

export async function generateUploadUrl(blogId: string, userId: string): Promise<string | null> {
    const blogAvailable = await blogAccess.blogExists(blogId, userId);
    if (!blogAvailable) {
        return null
    }

    return fileStorage.getUploadUrl(blogId)
}
