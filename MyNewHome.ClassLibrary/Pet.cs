using System;

namespace MyNewHome.ClassLibrary
{
    public class Pet
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime Birthdate { get; set; }
        public string ContactEmail { get; set; }
        public PetType Type { get; set; }
        public string ImageUrl { get; set; }
    }
}
