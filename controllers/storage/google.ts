import { Storage, Bucket } from "@google-cloud/storage";
import sharp from "sharp";

class GoogleStorage {
    private static GoogleStorage: GoogleStorage
    private storage: Storage
    private bucketName: string
    private bucket: Bucket

    private constructor(bucketName: string) {
        this.storage = new Storage({
            projectId: 'doofat-382610',
            keyFilename: 'doofat-382610-a00b69da1e2e.json'
        })
        this.bucketName = bucketName
        this.bucket = this.storage.bucket(bucketName as string)
    }

    static createInstance(bucketName: string) {
        if (!GoogleStorage.GoogleStorage) {
            GoogleStorage.GoogleStorage = new GoogleStorage(bucketName)
        }
        return GoogleStorage.GoogleStorage
    }

    public async uploadFile(file: any, path: string) {
        const { originalname, buffer } = await this.optimizeFile(file)

        const uploadFile = async () => {
            await this.deleteDirectory(`${path}`)

            const blob = this.bucket.file(`${path}/${originalname}`)

            const blobStream = blob.createWriteStream({
                resumable: false
            })

            blobStream.on('finish', async () => {
                await blob.makePublic()
                const publicUrl = await blob.publicUrl()
                return publicUrl
            }).on('error', (err) => {
                console.log(err);
            }).end(buffer)
        }
        uploadFile()
        return this.getPublicUrl(`${path}/${originalname}`)
    }

    public deleteDirectory = async (path: string) => {
        await this.bucket.deleteFiles({ prefix: path })
    }

    public getPublicUrl = (fileName: string) =>
        `https://storage.googleapis.com/${this.bucketName}/${fileName}`


    private async optimizeFile(file: any) {
        const { originalname, buffer } = file
        const image = await sharp(buffer).webp().toBuffer()
        const newName = Date.now() + '.webp'
        return { originalname: newName, buffer: image }
    }
}

export default GoogleStorage