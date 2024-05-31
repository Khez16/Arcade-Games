package ca.uoit.rockpaperscissorsassignmentfinal;

// import
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@ServerEndpoint(value="/game")
public class ChatServer {

    // store IDs
    private Map<String, String> players = new HashMap<String, String>();

    // WebSocket connection is opened
    @OnOpen
    public void open(Session session) throws IOException {
        // welcome message to the client
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): Welcome to the game.\"}");
    }

    // WebSocket connection is closed
    @OnClose
    public void close(Session session) throws IOException {
        // Retrieve the user ID of the closing session
        String userId = session.getId();
        // Check if the user is in the player map
        if (players.containsKey(userId)) {
            // Retrieve the username associated with the user ID
            String player = players.get(userId);
            // Remove the user from the player map
            players.remove(userId);
            // Broadcast a message to all open sessions indicating the user has left the game
            for (Session peer : session.getOpenSessions()){
                peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + player + " left the game.\"}");
            }
        }
    }

    // message is received from a WebSocket client
    @OnMessage
    public void handleMessage(String comm, Session session) throws IOException {
        // Variables
        String userID = session.getId();
        // Parse the received JSON message
        JSONObject jsonmsg = new JSONObject(comm);
        // Extract the type and message content from the JSON message
        String type = (String) jsonmsg.get("type");
        String message = (String) jsonmsg.get("msg");

        // If it's not the user's first message
        if(players.containsKey(userID)){
            // Retrieve the username associated with the user ID
            String player = players.get(userID);
            // Broadcast the message to all connected clients
            for(Session peer: session.getOpenSessions()){
                peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(" + player + "): " + message+"\"}");
            }
        } else { // If it's the user's first message
            // Add the user to the player map with their username
            players.put(userID, message);
            // Send a welcome message to the user
            session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): Welcome, " + message + "!\"}");
            // Broadcast a message to all connected clients indicating the player has joined the game
            for(Session peer: session.getOpenSessions()){
                if(!peer.getId().equals(userID)){
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + message + " joined the game.\"}");
                }
            }
        }
    }
}
