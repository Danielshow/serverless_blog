import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { createLogger } from '../../libs/logger'
import { getUserBlogs } from '../../helpers/blog';
import { middyfy } from '../../libs/lambda'
import { getUserId } from '../../auth/utils';

const logger = createLogger('getBlogs')

export const handler = middyfy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Get user blogs")
  const userId = getUserId(event)
  const result = await getUserBlogs(userId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: result,
    })
  }
})
