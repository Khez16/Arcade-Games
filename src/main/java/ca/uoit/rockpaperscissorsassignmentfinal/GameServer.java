package ca.uoit.rockpaperscissorsassignmentfinal;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
@Path("/game")
public class GameServer {
    private static Game game = new Game();

    // Endpoint to start a new game
    @POST
    @Path("/start")
    @Produces(MediaType.APPLICATION_JSON)
    public String startGame() {
        // Call the startGame method of the Game class
        game.startGame();
        // Return a JSON response indicating that the game has started
        return "{\"message\": \"Game started\"}";
    }

    // Endpoint to get the game status
    @GET
    @Path("/status")
    @Produces(MediaType.APPLICATION_JSON)
    public String getGameStatus() {
        // Call the getGameStatus method of the Game class to retrieve the game status
        String status = game.getGameStatus();
        // Return a JSON response containing the game status
        return "{\"status\": \"" + status + "\"}";
    }
}