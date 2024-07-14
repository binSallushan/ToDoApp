namespace ToDoAPI.Models
{
    public class TodoItem
    {
        public static int currentID = 0;
        public static List<TodoItem> AllItems = new List<TodoItem>();
        public long Id { get; set; }
        public string? Name { get; set; }
        public bool IsCompleted { get; set; }
    }
}
