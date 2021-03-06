import { apiEndpoint } from '../config'
import { Blog } from '../types/Blog';
import { CreateBlogRequest } from '../types/CreateBlogRequest';
import Axios from 'axios'
import { UpdateBlogRequest } from '../types/UpdateBlogRequest';

export async function getBlogs(): Promise<Blog[]> {
  console.log('Fetching blogs')

  const response = await Axios.get(`${apiEndpoint}/blogs`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log('Blogs:', response.data)
  return response.data['items']
}

export async function getUserBlogs(idToken: string): Promise<Blog[]> {
  console.log('Fetching blogs for a user')

  const response = await Axios.get(`${apiEndpoint}/blogs/user/mine`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Blogs for a user:', response.data)
  return response.data['items']
}

export async function createBlog(
  idToken: string,
  newBlog: CreateBlogRequest
): Promise<Blog | null> {
  try {
    const response = await Axios.post(`${apiEndpoint}/blogs`, JSON.stringify(newBlog), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })
    console.log('Created blog:', response.data)
    const blog = response.data as unknown as {
      item: Blog
    }
    return blog.item;
  } catch(err) {
    console.log(err)
    return null
  }
}

export async function patchBlog(
  idToken: string,
  blogId: string,
  updatedBlog: UpdateBlogRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/blogs/${blogId}`, JSON.stringify(updatedBlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBlog(
  idToken: string,
  blogId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  blogId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/blogs/${blogId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  const blog = response.data as unknown as {
    uploadUrl: string
  }
  return blog.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
