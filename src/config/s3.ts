import AWS from 'aws-sdk';

// Enter copied or downloaded access ID and secret key here
const ID = process.env.S3_ACCESS_KEY_ID;
const SECRET = process.env.S3_SECRET_ACCESS_KEY;
const REGION = process.env.S3_REGION;
// The name of the bucket that you have created
const BUCKET_NAME = process.env.S3_BUCKET;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    signatureVersion: 'v4',
    region: REGION,
});

/**
 * Send Response
 * @param {string} key file name
 * @param {number} seconds Expiry time
 * @param {boolean} makePublic Publicity status of the file
 * @param {string} fileType File type
 */
export const getPresignedUrl = async (key: string, seconds = 60, fileType: string) => {
    try {
        let params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: seconds,
            ContentType: fileType,
            ACL: 'public-read'
        };

        let url = await s3.getSignedUrl('putObject', params);

        return url;
    } catch (error) {
        console.log(error);
    }
};

/**
 * Send Response
 * @param {string} key file name
 */
export const checkKey = async (key: string) => {
    try {
        let params = {
            Bucket: BUCKET_NAME,
            Key: key
        };

        const headCode = await s3.headObject(params).promise();
        return headCode;
    } catch (error) {
        console.log(error);
    }
};