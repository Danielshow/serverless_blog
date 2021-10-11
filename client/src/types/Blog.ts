export interface Blog {
  userId: string
  blogId: string
  createdAt: string
  published: boolean
  publishedAt?: string
  attachmentUrl?: string
  content: string
  title: string
}
