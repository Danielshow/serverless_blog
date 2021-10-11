import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { createLogger } from '../../libs/logger'
import { getAllBlogs } from '../../helpers/blog';
import { middyfy } from '../../libs/lambda'

const logger = createLogger('getBlogs')

export const handler = middyfy(async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Get all blogs")
  const result = await getAllBlogs()
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: result,
    })
  }
})
