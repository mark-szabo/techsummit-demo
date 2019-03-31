using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyNewHome.ClassLibrary
{
    public static class CosmosResultSetIteratorExtension
    {
        public static async Task<List<T>> ToList<T>(this CosmosResultSetIterator<T> queryResultSetIterator)
        {
            var results = new List<T>();

            while (queryResultSetIterator.HasMoreResults)
            {
                var currentResultSet = await queryResultSetIterator.FetchNextSetAsync();
                results.AddRange(currentResultSet);
            }

            return results;
        }
    }
}
