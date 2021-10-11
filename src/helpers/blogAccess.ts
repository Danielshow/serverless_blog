import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWSXray from 'aws-xray-sdk';

import { BlogItem } from "../models/BlogItem";
import { BlogUpdate } from "../models/BlogUpdate";

const XAWS = AWSXray.captureAWS(AWS)

export class BlogAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly blogsTable = process.env.BLOGS_TABLE,
  ) {}

  async getAllBlogs(): Promise<BlogItem[]> {
    const result = await this.docClient
    .query({
      TableName: this.blogsTable,
      KeyConditionExpression: 'published = :published',
      ExpressionAttributeValues: {
        ':published': true
      }
    })
    .promise()

    const items = result.Items;

    return items as BlogItem[];
  }

  async getUserBlogs(userId: string): Promise<BlogItem[]> {
    const result = await this.docClient
    .query({
      TableName: this.blogsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

    const items = result.Items;

    return items as BlogItem[];
  }

  async createBlog(item: BlogItem): Promise<BlogItem> {
    await this.docClient.put({
        TableName: this.blogsTable,
        Item: item
      }).promise()

    return item;
  }

  async updateBlog(blogId: string, blog: BlogUpdate, userId: string): Promise<BlogUpdate> {
    await this.docClient
        .update({
          TableName: this.blogsTable,
          Key: {
            blogId,
            userId
          },
          UpdateExpression:
            'set title = :title, content = :content, published = :published',
          ExpressionAttributeValues: {
            ':title': blog.title,
            ':content': blog.title,
            ':published': blog.published
          }
        })
        .promise()

    return blog;
  }

  async deleteBlog(blogId: string, userId: string): Promise<null> {
    await this.docClient
        .delete({
          TableName: this.blogsTable,
          Key: {
            blogId,
            userId
          }
        })
        .promise()

    return null;
  }

  async blogExists(blogId: string, userId: string) {
    const result = await this.docClient
      .query({
        TableName: this.blogsTable,
        KeyConditionExpression: 'blogId = :blogId and userId = :userId',
        ExpressionAttributeValues: {
          ':blogId': blogId,
          ':userId': userId
        }
      })
      .promise()
    return !!result.Items.length
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
