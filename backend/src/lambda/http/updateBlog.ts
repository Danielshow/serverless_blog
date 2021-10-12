import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createLogger } from "../../libs/logger";
import { updateBlog } from "../../helpers/blog";
import { middyfy } from "../../libs/lambda";
import { getUserId } from "../../auth/utils";
import { UpdateBlogRequest } from "../../requests/UpdateBlogRequest";

const logger = createLogger("updateBlog");

export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const blogId = event.pathParameters.blogId;
      let updatedBlog: UpdateBlogRequest;
      if (typeof event.body == 'string') {
        updatedBlog = JSON.parse(event.body)
      } else {
        updatedBlog = event.body
      }
      const userId = getUserId(event);
      logger.info("Update a blog for a user with id", { blogId, userId });
      await updateBlog(updatedBlog, userId, blogId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Blog Updated Successfully"
        })
      };
    } catch (e) {
      logger.error("Error while updating a blog", { error: e.message });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: e
        })
      };
    }
  }
);
