using TaskBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace TaskBackend.Controllers.dto
{
    public class UpdateTaskDto : IValidatableObject
    {
        [Required]
        [MinLength(3)]
        [MaxLength(150)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public Status Status { get; set; }

        [Required]
        public Priority Priority { get; set; }

        public DateTime? DueDate { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrWhiteSpace(Title))
            {
                yield return new ValidationResult("Title is required", new[] { nameof(Title) });
            }

            if (Title != null && Regex.IsMatch(Title, @"^\d+$"))
            {
                yield return new ValidationResult("Title cannot contain only numbers", new[] { nameof(Title) });
            }

            if (Title != null && Title.Trim().Length < 3)
            {
                yield return new ValidationResult("Title must be at least 3 characters", new[] { nameof(Title) });
            }
        }
    }
}
