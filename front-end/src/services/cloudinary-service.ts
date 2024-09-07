class CloudinaryService {
    async uploadImage(payload: FormData): Promise<any> {
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dofkizpzl/image/upload",
                {
                    method: "POST",
                    body: payload,
                }
            )

            const cloudResponse = await response.json()
            return cloudResponse;
        } catch (e) {
            console.log('Lỗi: ', e)
            return '';
        }

    }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
