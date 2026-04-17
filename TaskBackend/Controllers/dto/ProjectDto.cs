using System.ComponentModel.DataAnnotations;

namespace TaskBackend.Controllers.dto
{
    public class ProjectDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(300)]
        public string? Description { get; set; }
    }
}
