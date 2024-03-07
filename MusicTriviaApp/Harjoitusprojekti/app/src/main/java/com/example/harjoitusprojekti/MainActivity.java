package com.example.harjoitusprojekti;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    protected ArrayList<String> players = new ArrayList<>();
    protected int playerCounter = 0;

    StringBuilder playersText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize the list with default player names
        players.add("Player 1");
        players.add("Player 2");

        // Create a StringBuilder to store the text representation of the player list
        playersText = new StringBuilder(getString(R.string.players) + "\n");

        setContentView(R.layout.activity_main);
    }

    public void addPlayer(View view) {

        EditText editText = findViewById(R.id.addPlayerEditText);
        TextView playersListTextView = findViewById(R.id.playersTextView);
        TextView errorText = findViewById(R.id.errorTextView);

        // Get entered name
        String playerName = editText.getText().toString().trim();


        if (!playerName.isEmpty()) {
            // Player limit is 2, so check that it's below that
            if (playerCounter < 2) {
                errorText.setText("");

                // Replace the player at the current counter index with the new player name
                players.set(playerCounter, playerName);
                playerCounter++;

                // Update the displayed list of players
                playersText.append("\n").append(playerName);
                playersListTextView.setText(playersText.toString());
            } else {
                errorText.setText(R.string.player_count_maxed_out);
            }
        } else {
            errorText.setText(R.string.player_name_can_t_be_empty);
        }

        editText.setText("");
    }

    public void removePlayer(View view) {
        TextView errorText = findViewById(R.id.errorTextView);
        TextView playersListTextView = findViewById(R.id.playersTextView);

        if (playerCounter > 0) {
            players.set(playerCounter - 1, "Player " + playerCounter);
            playerCounter--;
            playersText = new StringBuilder(getString(R.string.players));
            for (int i = 0; i < playerCounter; i++) {
                playersText.append(players.get(playerCounter - 1)).append("\n");
            }
            playersListTextView.setText(playersText);
        } else {
            errorText.setText(R.string.no_players_to_remove);
        }
    }

    public void startTrivia(View view) {
        Intent intent = new Intent(this, TriviaActivity.class);
        intent.putStringArrayListExtra("PLAYERS", players);
        startActivity(intent);
    }

    @Override
    protected void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        bundle.putInt("COUNTER_VALUE", playerCounter);
        bundle.putStringArrayList("PLAYER_LIST", players);
        bundle.putString("PLAYERS_TEXT", playersText.toString());
    }

    @Override
    protected void onRestoreInstanceState(Bundle bundle) {
        super.onRestoreInstanceState(bundle);
        playerCounter = bundle.getInt("COUNTER_VALUE");
        players = bundle.getStringArrayList("PLAYER_LIST");
        playersText = new StringBuilder();
        playersText.append(bundle.getString("PLAYERS_TEXT"));
        TextView playersListTextView = findViewById(R.id.playersTextView);
        playersListTextView.setText(playersText);
    }
}