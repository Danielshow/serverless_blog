import * as AWS from 'aws-sdk'

export class BlogFileStorage {
  constructor(
    private readonly s3 = createS3Client(),
    private readonly bucketName = process.env.BLOG_BUCKET,
    private readonly SIGNED_URL_EXPIRATION = process.env
      .SIGNED_URL_EXPIRATION || 60 * 60 * 24 * 7
  ) {}

  async getUploadUrl(blogId: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: blogId,
      Expires: Number(this.SIGNED_URL_EXPIRATION)
    }
    return this.s3.getSignedUrl('putObject', params)
  }
}

function createS3Client() {
  return new AWS.S3({
    signatureVersion: 'v4'
  })
}
