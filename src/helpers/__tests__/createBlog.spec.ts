import { createBlog } from '../blog';
import { BlogAccess } from '../blogAccess';


jest.mock('../blogAccess');

const blogAccess = new BlogAccess();

test("Create successfully", async () => {
  blogAccess.createBlog = jest.fn().mockResolvedValue({
      blogId: '123',
      title: 'test',
      content: 'test',
      published: false
  });
  
  const item = {
    title: "test",
    content: "test",
  }

  const result = await createBlog(item, 'sample');
  expect(result.content).toBe('test');
  expect(result).toHaveProperty('createdAt')
  expect(result).toHaveProperty('attachmentUrl')
});
