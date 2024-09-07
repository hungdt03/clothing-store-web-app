namespace back_end.Infrastructures.Cloudinary
{
    public interface IUploadService
    {
        Task<string> UploadSingleFileAsync(IFormFile file);
        Task<List<string>> UploadMutlipleFilesAsync(List<IFormFile> files);
    }
}
