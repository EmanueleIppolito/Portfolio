package RockPaperScissors.game.logic;

import javax.swing.*;
import java.awt.*;
import java.util.Random;

public class GameLogic {
    private static final String GAME_TITLE = "Rock, Paper, Scissors";
    private static final String[] OPTIONS = {"Rock", "Paper", "Scissors"};
    private String player;
    private int wins,
                losses,
                draws;
    private int getPlayerChoice(){
        return JOptionPane.showOptionDialog(null, "Choose your move:", GAME_TITLE, JOptionPane.DEFAULT_OPTION, JOptionPane.QUESTION_MESSAGE, null, OPTIONS, OPTIONS[0]);
    }
    private int getComputerChoice(Random random){
        return random.nextInt(OPTIONS.length);
    }
    private String checkResult(int playerChoice, int computerChoice){
        if(playerChoice == computerChoice){
            draws++;
            return "Draw!";

        } else if ((playerChoice == 0 && computerChoice == 2) ||
                (playerChoice == 1 && computerChoice == 0) ||
                (playerChoice == 2 && computerChoice == 1)) {
            wins++;
            return "You Win!";


        }else{
            losses++;
            return "You Lose :(";
        }
    }
    private void showRoundResult(int playerChoice, int computerChoice,String resultMessage){
        JOptionPane.showMessageDialog(null, String.format("""
                 %s chose: %s
                 Computer chose: %s
                 
                 %s""", player, OPTIONS[playerChoice], OPTIONS[computerChoice], resultMessage),GAME_TITLE, JOptionPane.INFORMATION_MESSAGE);
    }
    private boolean playAgain(){
        int keepPlaying = JOptionPane.showConfirmDialog(null, "Do you want to play another match?", GAME_TITLE, JOptionPane.YES_NO_OPTION);
        return keepPlaying == JOptionPane.YES_OPTION;
    }
    private void showFinalStats(){
        JOptionPane.showMessageDialog(null, String.format("""
                Final stats for %s
                
                Wins: %d
                Draws: %d
                Losses: %d""", player, wins, draws, losses), GAME_TITLE, JOptionPane.INFORMATION_MESSAGE);
    }
    private String askPlayerName(){
        String player = JOptionPane.showInputDialog(null, "What's your name?", GAME_TITLE, JOptionPane.QUESTION_MESSAGE);
        if(player == null || player.trim().isEmpty()){
            player = "GinoPippo";
        }
        return player;
    }
    public void setGraphicStyle() {
        Font messageFont = UIManager.getFont("OptionPane.messageFont");
        Font buttonFont = UIManager.getFont("OptionPane.buttonFont");
        Font inputFont = UIManager.getFont("TextField.font");

        if (messageFont != null) {
            UIManager.put("OptionPane.messageFont", messageFont.deriveFont(Font.BOLD, 40f));
            UIManager.put("Label.font", messageFont.deriveFont(Font.BOLD, 40f));
        }

        if (buttonFont != null) {
            UIManager.put("OptionPane.buttonFont", buttonFont.deriveFont(Font.BOLD, 26f));
            UIManager.put("Button.font", buttonFont.deriveFont(Font.BOLD, 26f));
        }

        if (inputFont != null) {
            UIManager.put("TextField.font", inputFont.deriveFont(Font.PLAIN, 22f));
        }
    }
    public GameLogic(){
            setGraphicStyle();
            player = askPlayerName();
            JOptionPane.showMessageDialog(null, "Welcome " + player + "!", GAME_TITLE, JOptionPane.INFORMATION_MESSAGE);

    }
    public void startGame(){
        boolean gameRunning = true;
        Random random = new Random();
            while(gameRunning){
                int playerChoice = getPlayerChoice();
                if(playerChoice == JOptionPane.CLOSED_OPTION){
                    gameRunning = false;
                    continue;
                }
                int computerChoice = getComputerChoice(random);
                String resultMessage = checkResult(playerChoice, computerChoice);
                showRoundResult(playerChoice, computerChoice, resultMessage);
                gameRunning = playAgain();
            }
            showFinalStats();
    }
}
