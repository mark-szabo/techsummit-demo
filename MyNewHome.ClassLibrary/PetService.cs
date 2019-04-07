﻿using Microsoft.ApplicationInsights;
using Microsoft.Azure.Cosmos;
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
        private readonly CosmosDatabase _database;
        private readonly CosmosContainer _container;

        private readonly TelemetryClient _telemetryClient;

        public PetService(string connectionString)
        {
            _cosmosClient = new CosmosClient(connectionString);
            _database = _cosmosClient.Databases.CreateDatabaseIfNotExistsAsync(DatabaseId).GetAwaiter().GetResult();
            _container = _database.Containers.CreateContainerIfNotExistsAsync(ContainerId, PartitionKey).GetAwaiter().GetResult();
            _telemetryClient = new TelemetryClient();
        }

        public async Task<Pet> GetPetAsync(string id, PetType type)
        {
            return await _container.Items.ReadItemAsync<Pet>((int)type, id);
        }

        //public async Task<IEnumerable<Pet>> ListPetsAsync()
        //{
        //    // Selecting all pets is a cross partition query. 
        //    // We set the max concurrency to 4, which controls the max number of partitions that our client will query in parallel.
        //    return await _container.Items.CreateItemQuery<Pet>("SELECT * FROM c WHERE c.published ORDER BY c._ts DESC", maxConcurrency: 4, maxItemCount: 20).ToList();
        //}

        //public async Task<Pet> AddPetAsync(Pet pet)
        //{
        //    if (pet.Id == null) pet.Id = Guid.NewGuid().ToString();
        //    pet.Published = false;

        //    if (pet.Birthdate > DateTime.Now) throw new ArgumentException("Pet birthdate cannot be in the future.", "birthdate");

        //    var newPet = await _container.Items.CreateItemAsync((int)pet.Type, pet);

        //    _telemetryClient.TrackEvent(
        //        "New pet added.",
        //        new Dictionary<string, string>
        //        {
        //            { "Pet type", pet.Type.ToString() },
        //        },
        //        new Dictionary<string, double>
        //        {
        //            { "New pet", 1 },
        //        });

        //    return newPet;
        //}

        public async Task<Pet> UpdatePetAsync(Pet pet)
        {
            return await _container.Items.ReplaceItemAsync((int)pet.Type, pet.Id, pet);
        }

        public async Task DeletePetAsync(string id, PetType type)
        {
            await _container.Items.DeleteItemAsync<Pet>((int)type, id);
        }
    }
}
