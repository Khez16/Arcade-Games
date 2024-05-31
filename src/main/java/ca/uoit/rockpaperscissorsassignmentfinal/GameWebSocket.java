package ca.uoit.rockpaperscissorsassignmentfinal;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@ServerEndpoint("/game")
public class GameWebSocket {

    private static Map<String, Session> sessions = new HashMap<>();
    private static Game game = new Game();

    // Declare player1Choice as a class-level variable
    private String player1Choice;

    @OnOpen
    public void onOpen(Session session) {
        sessions.put(session.getId(), session);
        System.out.println("WebSocket connection opened: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("Message received from client " + session.getId() + ": " + message);

        // Parse message and handle accordingly
        String[] parts = message.split(",");
        String messageType = parts[0];
        String playerId = parts[1];
        String playerChoice = parts[2];

        switch (messageType) {
            case "join":
                game.addPlayer(new Player(playerId));
                break;
            case "move":
                // player1 and player2 alternately make moves
                if (playerId.equals("player1")) {
                    // Store player1's choice
                    player1Choice = playerChoice;
                } else if (playerId.equals("player2")) {
                    // Store player2's choice and determine winner
                    String winner = game.determineWinner(player1Choice, playerChoice);
                    sendMessageToAll("updateScoresAndAnnouncement," + winner);
                }
                break;
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session.getId());
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("Error on session " + session.getId() + ": " + throwable.getMessage());
    }

    // Method to send message to all connected clients
    private void sendMessageToAll(String message) {
        for (Session session : sessions.values()) {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}