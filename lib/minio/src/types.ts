export type ConfigWithS3Options = {
    bucketName: string;
    connection: {
        endPoint: string;
        port: number;
        accessKey: string;
        secretKey: string;
        useSSL: boolean;
        region: string;
    };
};
