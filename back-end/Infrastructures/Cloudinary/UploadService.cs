using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace back_end.Infrastructures.Cloudinary
{
    public class UploadService : IUploadService
    {
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;
        private readonly ILogger<UploadService> _logger;

        public UploadService(IOptions<CloudinarySettings> config, ILogger<UploadService> logger)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new CloudinaryDotNet.Cloudinary(account);
            _logger = logger;

        }

        public async Task<List<string>> UploadMutlipleFilesAsync(List<IFormFile> files)
        {
            var uploadResults = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(file.FileName, stream),
                            Folder = "ClothingStore",
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                        {
                            uploadResults.Add(uploadResult.SecureUrl.ToString());
                        }
                    }
                }
            }

            return uploadResults;
        }

        public async Task<string> UploadSingleFileAsync(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "ClothingStore",
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new Exception("Upload ảnh thất bại");
                }
            }
        }
    }

    public class CloudinarySettings
    {
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
        public string CloudName { get; set; }
    }
}
