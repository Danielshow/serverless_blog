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
  try {
    logger.info('Processing event: ', { body:event.body })
    let newBlog: CreateBlogRequest;
    if (typeof event.body == 'string') {
       newBlog = JSON.parse(event.body)
    } else {
       newBlog = event.body
    }
    const userId = getUserId(event);
    console.log(userId)
    logger.info("Create new Blog", { newBlog })
    const result = await createBlog(newBlog, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: result,
      })
    }
  } catch(err) {
    logger.error("Error creating blog", { error: err.message })
  }
})