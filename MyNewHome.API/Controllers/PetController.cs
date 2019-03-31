using System.Collections.Generic;
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
        private readonly PetService _petService;

        public PetController(PetService petService)
        {
            _petService = petService;
            _telemetryClient = new TelemetryClient();
        }

        [HttpGet]
        public async Task<IEnumerable<Pet>> GetPetsAsync()
        {
            return await _petService.ListPetsAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Pet>> PostPet([FromBody] Pet pet)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            pet = await _petService.AddPetAsync(pet);

            return CreatedAtAction("GetPetsAsync", new { id = pet.Id }, pet);
        }

        [HttpPost("recognize")]
        public async Task<ActionResult<string>> RecognizePetType([FromBody] Pet pet)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            pet = await _petService.AddPetAsync(pet);

            return CreatedAtAction("GetPets", new { id = pet.Id }, pet);
        }
    }
}
