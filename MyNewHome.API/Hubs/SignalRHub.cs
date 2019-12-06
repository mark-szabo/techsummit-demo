using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyNewHome.API.Hubs
{
    public class SignalRHub : Hub
    {
        public async Task TriggerRefresh()
        {
            await Clients.All.SendAsync("refresh");
        }
    }
}
