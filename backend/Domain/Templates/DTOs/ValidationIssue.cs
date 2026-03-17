namespace Domain.Templates.DTOs
{
    public class ValidationIssue
    {
        /// <summary>
        /// Path in the template where the issue occurred.
        /// Example: "Chapters[1].Sections[0].SubSections[2]"
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// The actual text or tag that caused the issue.
        /// </summary>
        public string? Value { get; set; }

        /// <summary>
        /// Descriptive message about what is wrong.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Severity level (optional).
        /// </summary>
        public ValidationSeverity Severity { get; set; } = ValidationSeverity.Error;

        public ValidationIssue(string location, string message, string? value = null,
                               ValidationSeverity severity = ValidationSeverity.Error)
        {
            Location = location;
            Message = message;
            Value = value;
            Severity = severity;
        }
    }

    /// <summary>
    /// Optional enum to differentiate error severity.
    /// </summary>
    public enum ValidationSeverity
    {
        Info,
        Warning,
        Error
    }
}
