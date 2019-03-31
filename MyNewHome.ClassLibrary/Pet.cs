using Newtonsoft.Json;
using System;

namespace MyNewHome.ClassLibrary
{
    public class Pet
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "birthdate")]
        public DateTime Birthdate { get; set; }

        [JsonProperty(PropertyName = "contactEmail")]
        public string ContactEmail { get; set; }

        [JsonProperty(PropertyName = "type")]
        public PetType Type { get; set; }

        [JsonProperty(PropertyName = "imageUrl")]
        public string ImageUrl { get; set; }

        public override string ToString() => JsonConvert.SerializeObject(this);
    }
}
