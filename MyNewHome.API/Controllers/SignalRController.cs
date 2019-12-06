using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Azure.SignalR.Management;

namespace MyNewHome.Controllers
{
    [Route("signalr")]
    [Produces("application/json")]
    [ApiController]
    public class SignalRController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public SignalRController(IConfiguration configuration)
        {
            var connectionString = configuration["Azure:SignalR:ConnectionString"];
            _serviceManager = new ServiceManagerBuilder()
                .WithOptions(o => o.ConnectionString = connectionString)
                .Build();
        }

        [HttpPost("negotiate")]
        public ActionResult Index()
        {
            return new JsonResult(new Dictionary<string, string>()
            {
                { "url", _serviceManager.GetClientEndpoint("PetHub") },
                { "accessToken", _serviceManager.GenerateClientAccessToken("PetHub") }
            });
        }
    }
}
