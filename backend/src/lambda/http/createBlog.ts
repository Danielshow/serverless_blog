import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { createLogger } from '../../libs/logger'
import { createBlog } from '../../helpers/blog';
import { middyfy } from '../../libs/lambda'
import { getUserId } from '../../auth/utils';
import { CreateBlogRequest } from '../../requests/CreateBlogRequest';

const logger = createLogger('createBlogs')

export const handler = middyfy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const newBlog: CreateBlogRequest = JSON.parse(event.body)
  const userId = getUserId(event);
  logger.info("Create new Blog", { newBlog })
  const result = await createBlog(newBlog, userId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      item: result,
    })
  }
})