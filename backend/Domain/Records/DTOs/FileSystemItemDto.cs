using Domain.Records.DTOs;
using System.Text.Json.Serialization;

public abstract class FileSystemItemDto
{
    public abstract FileSystemItemType ItemType { get; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum FileSystemItemType
{
    Directory,
    File
}

public class DirectoryDto
{
    public required string CasePath { get; set; }
    public List<DirectoryDto>? SubDirectories { get; set; }
    public List<FileRecordDto>? Files { get; set; }

    public void AddDirectory(DirectoryDto directory)
    {
        SubDirectories ??= new List<DirectoryDto>();
        SubDirectories.Add(directory);
    }

    public void AddFile(FileRecordDto file)
    {
        Files ??= new List<FileRecordDto>();
        Files.Add(file);
    }
}

public class DirectoryItemDto : FileSystemItemDto
{
    public override FileSystemItemType ItemType => FileSystemItemType.Directory;
    public required DirectoryDto Directory {  get; set; }
}

public class FileItemDto : FileSystemItemDto
{
    public override FileSystemItemType ItemType => FileSystemItemType.File;
    public required FileRecordDto File {  get; set; }
}