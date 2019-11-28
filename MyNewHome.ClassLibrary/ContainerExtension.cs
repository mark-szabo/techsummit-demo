using Azure.Cosmos;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyNewHome.ClassLibrary
{
    public static class ContainerExtension
    {
        public static async Task<List<T>> GetItemQuery<T>(this Container container, string queryText, string continuationToken = null, QueryRequestOptions requestOptions = null, CancellationToken cancellationToken = default)
        {
            var results = new List<T>();

            QueryDefinition queryDefinition = new QueryDefinition(queryText);

            await foreach (T item in container.GetItemQueryIterator<T>(queryDefinition, continuationToken, requestOptions, cancellationToken))
            {
                results.Add(item);
            }

            return results;
        }
    }
}
