using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBackend.Data;
using TaskBackend.Models;

namespace TaskBackend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var today = DateTime.UtcNow.Date;
            var next7Days = today.AddDays(7);

            var totalProjects = await _context.Projects.CountAsync();
            var totalTasks = await _context.Tasks.CountAsync();

            var todoCount = await _context.Tasks.CountAsync(t => t.Status == Status.Todo);
            var inProgressCount = await _context.Tasks.CountAsync(t => t.Status == Status.InProgress);
            var reviewCount = await _context.Tasks.CountAsync(t => t.Status == Status.Review);
            var doneCount = await _context.Tasks.CountAsync(t => t.Status == Status.Done);

            var overdueCount = await _context.Tasks.CountAsync(t =>
                t.DueDate.HasValue &&
                t.DueDate.Value.Date < today &&
                t.Status != Status.Done);

            var dueWithin7Days = await _context.Tasks
                .Where(t =>
                    t.DueDate.HasValue &&
                    t.DueDate.Value.Date >= today &&
                    t.DueDate.Value.Date <= next7Days)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Status,
                    t.Priority,
                    t.DueDate,
                    t.ProjectId
                })
                .ToListAsync();

            return Ok(new
            {
                totalProjects,
                totalTasks,
                tasksByStatus = new
                {
                    todo = todoCount,
                    inProgress = inProgressCount,
                    review = reviewCount,
                    done = doneCount
                },
                overdueCount,
                dueWithin7Days
            });
        }
    }
}
