using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBackend.Controllers.dto;
using TaskBackend.Data;
using TaskBackend.Models;

namespace TaskBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("projects/{projectId}/tasks")]
        public async Task<IActionResult> GetTasks(
      int projectId,
      string? status,
      string? priority,
      string? sortBy = "createdAt",
      string? sortDir = "desc",
      int page = 1,
      int pageSize = 10
  )
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var query = _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<Status>(status, true, out var statusEnum))
                query = query.Where(t => t.Status == statusEnum);

            if (!string.IsNullOrEmpty(priority) && Enum.TryParse<Priority>(priority, true, out var priorityEnum))
                query = query.Where(t => t.Priority == priorityEnum);

            var isAsc = string.Equals(sortDir, "asc", StringComparison.OrdinalIgnoreCase);

            query = sortBy?.ToLower() switch
            {
                "duedate" => isAsc ? query.OrderBy(t => t.DueDate) : query.OrderByDescending(t => t.DueDate),
                "priority" => isAsc ? query.OrderBy(t => t.Priority) : query.OrderByDescending(t => t.Priority),
                _ => isAsc ? query.OrderBy(t => t.CreatedAt) : query.OrderByDescending(t => t.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var tasks = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                data = tasks,
                page,
                pageSize,
                totalCount,
                totalPages
            });
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<IActionResult> CreateTask(int projectId, [FromBody] CreateTaskDto dto)
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

            if (dto.DueDate.HasValue && dto.DueDate.Value.Date < DateTime.UtcNow.Date)
                return BadRequest(new { errors = new { DueDate = new[] { "DueDate must be today or in the future." } } });

            var task = new TaskItem
            {
                ProjectId = projectId,
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority,
                DueDate = dto.DueDate
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpGet("tasks/{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Comments)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null) return NotFound();

            return Ok(task);
        }

        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
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

            if (dto.DueDate.HasValue && dto.DueDate.Value.Date < DateTime.UtcNow.Date)
                return BadRequest(new { errors = new { DueDate = new[] { "DueDate must be today or in the future." } } });

            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Status = dto.Status;
            task.Priority = dto.Priority;
            task.DueDate = dto.DueDate;

            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpDelete("tasks/{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("tasks/{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == id);
            if (!taskExists) return NotFound();

            var comments = await _context.Comments
                .Where(c => c.TaskId == id)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost("tasks/{id}/comments")]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Author))
                return BadRequest(new { errors = new { Author = new[] { "Author is required" } } });

            if (string.IsNullOrWhiteSpace(dto.Body))
                return BadRequest(new { errors = new { Body = new[] { "Body is required" } } });

            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == id);
            if (!taskExists) return NotFound();

            var comment = new Comment
            {
                TaskId = id,
                Author = dto.Author,
                Body = dto.Body
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpDelete("comments/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    public class CommentDto
    {
        public string Author { get; set; }
        public string Body { get; set; }
    }
}
