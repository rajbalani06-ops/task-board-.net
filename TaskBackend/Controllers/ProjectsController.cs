using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBackend.Controllers.dto;
using TaskBackend.Data;
using TaskBackend.Models;

namespace TaskBackend.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Tasks)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.CreatedAt,
                    TodoCount = p.Tasks.Count(t => t.Status == Status.Todo),
                    InProgressCount = p.Tasks.Count(t => t.Status == Status.InProgress),
                    ReviewCount = p.Tasks.Count(t => t.Status == Status.Review),
                    DoneCount = p.Tasks.Count(t => t.Status == Status.Done)
                })
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        k => k.Key,
                        v => v.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new { errors });
            }

            var existingProject = await _context.Projects
                .FirstOrDefaultAsync(p => p.Name.ToLower() == dto.Name.ToLower());

            if (existingProject != null)
            {
                return Conflict(new
                {
                    errors = new
                    {
                        Name = new[] { "Project name must be unique" }
                    }
                });
            }

            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        k => k.Key,
                        v => v.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new { errors });
            }

            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            var duplicateProject = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id != id && p.Name.ToLower() == dto.Name.ToLower());

            if (duplicateProject != null)
            {
                return Conflict(new
                {
                    errors = new
                    {
                        Name = new[] { "Project name must be unique" }
                    }
                });
            }

            project.Name = dto.Name;
            project.Description = dto.Description;

            await _context.SaveChangesAsync();

            return Ok(project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
