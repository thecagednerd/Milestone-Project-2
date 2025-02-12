// OpenRouteService API Key
const API_KEY = "5b3ce3597851110001cf6248c577fc2b662e4b4bba183a6570c2ce97";

document.getElementById("distanceForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page reload

  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const pricePerMile = parseFloat(document.getElementById("pricePerMile").value);
  const bookingFee = parseFloat(document.getElementById("bookingFee").value);
  const result = document.getElementById("result");

  // Clears the previous result
  result.textContent = "Calculating...";

  // Validates the inputs
  if (!origin || !destination || isNaN(pricePerMile) || isNaN(bookingFee)) {
    result.textContent = "Please fill in all fields correctly.";
    return;
  }

  try {
    // Parse latitude and longitude from input
    // const [originLat, originLon] = origin.split(",").map(Number);
    // const [destinationLat, destinationLon] = destination.split(",").map(Number);

    // if (
    //   isNaN(originLat) || 
    //   isNaN(originLon) || 
    //   isNaN(destinationLat) || 
    //   isNaN(destinationLon)
    // ) {
    //   throw new Error("Invalid latitude/longitude format.");
    // }

    // Fetch distance data from OpenRouteService
    async function geocode(text){
      const response = await fetch(`https://api.openrouteservice.org/geocode/search?text=${text}`, {
        method: "GET",
        headers: {
          "Authorization": API_KEY,
          "Content-Type": "application/json",
        }
      });
  
      const data = await response.json();
    }
    const response = await fetch("https://api.openrouteservice.org/v2/matrix/driving-car", {
      method: "POST",
      headers: {
        "Authorization": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations: [[originLon, originLat], [destinationLon, destinationLat]],
        metrics: ["distance"],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Get the distance in meters and convert to miles
      const distanceMeters = data.distances[0][1];
      const distanceMiles = distanceMeters / 1609.34;

      // Calculate cost
      const cost = distanceMiles * pricePerMile + bookingFee;

      // Display the result
      result.textContent = `Distance: ${distanceMiles.toFixed(2)} miles | Cost: £${cost.toFixed(2)}`;
    } else {
      result.textContent = `Error: ${data.error || "Unable to fetch distance data."}`;
    }
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
});
