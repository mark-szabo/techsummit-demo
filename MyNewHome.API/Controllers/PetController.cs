using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using MyNewHome.ClassLibrary;

namespace MyNewHome.Controllers
{
    [Route("api/pet")]
    [Produces("application/json")]
    [ApiController]
    public class PetController : ControllerBase
    {
        private readonly TelemetryClient _telemetryClient;

        public PetController()
        {
            _telemetryClient = new TelemetryClient();
        }

        [HttpGet]
        public IEnumerable<Pet> GetPets()
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<ActionResult<Pet>> PostPet([FromBody] Pet pet)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            throw new NotImplementedException();

            return CreatedAtAction("GetPets", new { id = pet.Id }, pet);
        }
    }
}
