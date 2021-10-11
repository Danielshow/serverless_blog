import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../libs/logger'
import { getUserId } from '../../auth/utils'
import { middyfy } from '../../libs/lambda'
import { generateUploadUrl } from '../../helpers/blog'

const logger = createLogger('getUploadUrl')

export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const blogId = event.pathParameters.blogId
    const userId = getUserId(event)
    logger.info('Generate upload url', { blogId })
    const uploadUrl = await generateUploadUrl(blogId, userId)
    if (!uploadUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Blog does not exist'
        })
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)
