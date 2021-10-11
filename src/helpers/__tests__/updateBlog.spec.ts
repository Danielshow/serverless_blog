import { updateBlog } from '../blog';
import { BlogAccess } from '../blogAccess';


jest.mock('../blogAccess');

const blogAccess = new BlogAccess();

test("Update successfully", async () => {
  blogAccess.updateBlog = jest.fn().mockResolvedValue({
      title: 'test',
      content: 'test',
      published: false
  });
  
  const item = {
    title: "test",
    content: "test",
    published: true
  }

  const result = await updateBlog(item, 'sample', '123');
  expect(result.content).toBe('test');
});
