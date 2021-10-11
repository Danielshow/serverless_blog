import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createLogger } from "../../libs/logger";
import { deleteBlog } from "../../helpers/blog";
import { middyfy } from "../../libs/lambda";
import { getUserId } from "../../auth/utils";

const logger = createLogger("deleteBlog");

export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const blogId = event.pathParameters.blogId;
      const userId = getUserId(event);
      logger.info("Delete a blog for a user with id", { blogId, userId });
      await deleteBlog(blogId, userId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Blog Deleted Successfully"
        })
      };
    } catch (e) {
      logger.error("Error while deleting a blog", { error: e.message });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: e
        })
      };
    }
  }
);
