package ca.uoit.rockpaperscissorsassignmentfinal;

import java.util.HashMap;
import java.util.Map;

public class Game {
    private Map<String, Player> players;
    private boolean startGame;

    // Constructor
    public Game() {
        players = new HashMap<>();
    }

    // add player to the game
    public void addPlayer(Player player) {
        players.put(player.getPlayerId(), player);
    }

    // remove player from the game
    public void removePlayer(String playerId) {
        players.remove(playerId);
    }

    public void startGame() {
        startGame = true;
    }

    public String getGameStatus() {
        if (!startGame) {
            return "Game hasn't started.";
        } else {
            return "Game has started.";
        }
    }

    // determine the winner of a game
    public String determineWinner(String player1Choice, String player2Choice) {
        // statement for determine the winner
        if ((player1Choice.equals("Rock") && player2Choice.equals("Scissor")) ||
                (player1Choice.equals("Paper") && player2Choice.equals("Rock")) ||
                (player1Choice.equals("Scissor") && player2Choice.equals("Paper"))) {
            return "Player 1";
        } else if ((player2Choice.equals("Rock") && player1Choice.equals("Scissor")) ||
                (player2Choice.equals("Paper") && player1Choice.equals("Rock")) ||
                (player2Choice.equals("Scissor") && player1Choice.equals("Paper"))) {
            return "Player 2";
        } else {
            return "Draw";
        }
    }

}