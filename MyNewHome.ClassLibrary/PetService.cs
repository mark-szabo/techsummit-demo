using Azure.Cosmos;
using Microsoft.ApplicationInsights;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyNewHome.ClassLibrary
{
    public class PetService
    {
        private const string DatabaseId = "MyNewHome";
        private const string ContainerId = "Pets";
        private const string PartitionKey = "/type";

        private readonly CosmosClient _cosmosClient;
        private readonly Database _database;
        private readonly Container _container;

        private readonly TelemetryClient _telemetryClient;

        public PetService(CosmosClient cosmosClient, TelemetryClient telemetryClient)
        {
            _cosmosClient = cosmosClient;
            _database = _cosmosClient.CreateDatabaseIfNotExistsAsync(DatabaseId).GetAwaiter().GetResult();
            _container = _database.CreateContainerIfNotExistsAsync(ContainerId, PartitionKey).GetAwaiter().GetResult();
            _telemetryClient = telemetryClient;
        }

        public async Task<Pet> GetPetAsync(string id, PetType type)
        {
            return await _container.ReadItemAsync<Pet>(id, new PartitionKey((int)type));
        }

        public async Task<IEnumerable<Pet>> ListPetsAsync()
        {
            // Selecting all pets is a cross partition query. 
            // We set the max concurrency to 4, which controls the max number of partitions that our client will query in parallel.
            return await _container.GetItemQuery<Pet>("SELECT * FROM c WHERE c.published ORDER BY c._ts DESC", null, new QueryRequestOptions { MaxConcurrency = 4, MaxItemCount = 20 });
        }

        public async Task<Pet> AddPetAsync(Pet pet)
        {
            if (pet.Id == null) pet.Id = Guid.NewGuid().ToString();
            pet.Published = false;

            if (pet.Birthdate > DateTime.Now) throw new ArgumentException("Pet birthdate cannot be in the future.", "birthdate");

            var newPet = await _container.CreateItemAsync(pet, new PartitionKey((int)pet.Type));

            _telemetryClient.TrackEvent(
                "New pet added.",
                new Dictionary<string, string>
                {
                    { "Pet type", pet.Type.ToString() },
                },
                new Dictionary<string, double>
                {
                    { "New pet", 1 },
                });

            return newPet;
        }

        public async Task<Pet> UpdatePetAsync(Pet pet)
        {
            return await _container.ReplaceItemAsync(pet, pet.Id, new PartitionKey((int)pet.Type));
        }

        public async Task DeletePetAsync(string id, PetType type)
        {
            await _container.DeleteItemAsync<Pet>(id, new PartitionKey((int)type));
        }
    }
}
