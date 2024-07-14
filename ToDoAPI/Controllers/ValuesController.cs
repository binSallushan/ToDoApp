using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToDoAPI.Models;

namespace ToDoAPI.Controllers
{
    [Route("/[action]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet(Name = "GetAllTodoItems")]
        public IEnumerable<TodoItem> GetAllToDoItems()
        {
            return TodoItem.AllItems;
        }

        [HttpGet(Name = "TestGet")]
        public string TestGet()
        {
            return "testCompleted";
        }

        [HttpPost(Name = "AddTodoItem")]
        public void AddToDoItem([FromBody] string name)
        {
            var item = new TodoItem()
            {
                Id = ++TodoItem.currentID,
                Name = name,
                IsCompleted = false
            };

            TodoItem.AllItems.Add(item);
        }

        [HttpPost(Name = "RemoveTodoItem")]
        public void RemoveToDoItem([FromBody]int id)
        {
            var item = TodoItem.AllItems.Where(x => x.Id == id).FirstOrDefault();
            if (item != null)
            {
                TodoItem.AllItems.Remove(item);
            }
            else
                throw new ArgumentException("id is invalid");
        }

        [HttpPost(Name = "ChangeStatusToDoItem")]
        public void ChangeStatusToDoItem([FromBody]TodoItem item)
        {
            var itemInList = TodoItem.AllItems.Where(x => x.Id == item.Id).FirstOrDefault();
            if (itemInList != null)
            {
                itemInList.IsCompleted = item.IsCompleted;
            }
            else
                throw new ArgumentException("id is invalid");
        }

        [HttpPost(Name = "ClearTodoList")]
        public void ClearTodoList()
        {
            TodoItem.AllItems.Clear();
        }
        
    }
}
