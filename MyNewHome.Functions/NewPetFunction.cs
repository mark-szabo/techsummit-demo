using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Azure.Cosmos;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using MyNewHome.ClassLibrary;
using Newtonsoft.Json;

namespace MyNewHome.Functions
{
    public static class NewPetFunction
    {
        private static readonly string cosmosConnectionString = Environment.GetEnvironmentVariable("CosmosConnectionString");
        private static readonly string computerVisionApiKey = Environment.GetEnvironmentVariable("ComputerVision");
        private static readonly string storageConnectionString = Environment.GetEnvironmentVariable("StorageConnectionString");
        private static readonly string signalRConnectionString = Environment.GetEnvironmentVariable("SignalRConnectionString");
        private static readonly Uri imageCdnHost = new Uri(Environment.GetEnvironmentVariable("ImageCdnHost"));

        private static readonly PetService petService = new PetService(new CosmosClient(cosmosConnectionString), new TelemetryClient());
        private static readonly HttpClient client = new HttpClient();
        private static readonly CloudBlobClient storage = CloudStorageAccount.Parse(storageConnectionString).CreateCloudBlobClient();

        [FunctionName("NewPetFunction")]
        public static async Task Run([QueueTrigger("newpets", Connection = "StorageConnectionString")]string queueItem, ILogger log)
        {
            // Deserialize queue message
            var petFromQueue = JsonConvert.DeserializeObject<Pet>(queueItem);

            // Download image
            var blob = new CloudBlockBlob(new Uri(petFromQueue.ImageUrl), storage);
            var stream = await blob.OpenReadAsync();

            ByteArrayContent content;
            using (var binaryReader = new BinaryReader(stream))
            {
                var byteArray = binaryReader.ReadBytes((int)stream.Length);
                content = new ByteArrayContent(byteArray);
            }
            content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            // Call Cognitive Services Computer Vision
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", computerVisionApiKey);
            var response = await client.PostAsync(
                "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/generateThumbnail?width=400&height=300&smartCropping=true",
                content);

            if (response.IsSuccessStatusCode)
            {
                // Upload image to blob
                var thumbnail = await response.Content.ReadAsStreamAsync();
                await blob.UploadFromStreamAsync(thumbnail);

                // Swap url host to CDN
                var url = new Uri(imageCdnHost, blob.Uri.PathAndQuery).AbsoluteUri.ToString();

                // Save url to Cosmos DB and publish
                var pet = await petService.GetPetAsync(petFromQueue.Id, petFromQueue.Type);
                pet.ImageUrl = url;
                pet.Published = true;
                await petService.UpdatePetAsync(pet);

                // Let the clients know of hte new pet using SignalR
                var serviceManager = new ServiceManagerBuilder()
                    .WithOptions(option =>
                    {
                        option.ConnectionString = signalRConnectionString;
                    })
                    .Build();

                var hubContext = await serviceManager.CreateHubContextAsync("PetHub");

                await hubContext.Clients.All.SendAsync("refresh");
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                log.LogError(result);
            }
        }
    }
}
