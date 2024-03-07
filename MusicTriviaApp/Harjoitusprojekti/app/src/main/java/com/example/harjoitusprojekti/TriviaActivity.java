package com.example.harjoitusprojekti;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.w3c.dom.Text;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class TriviaActivity extends AppCompatActivity {

    private String answer;
    ArrayList<String> players;
    String fileContent = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trivia);

        answer = getString(R.string.please_click_the_next_question_button);
        TextView player1 = findViewById(R.id.player1TextView);
        TextView player2 = findViewById(R.id.player2TextView);

        Intent intent = getIntent();

        // Apply the player names if found
        if (intent.hasExtra("PLAYERS")) {
            players = intent.getStringArrayListExtra("PLAYERS");
            if (players.size() == 2) {
                player2.setText(players.get(1));
            }
            player1.setText((players.get(0)));
        }

    }

    public void getTriviaQuestion(View view) {
        // Fetch the question
        String QUESTION_URL = "https://api.api-ninjas.com/v1/trivia?category=music";
        StringRequest request = new StringRequest(Request.Method.GET, QUESTION_URL, this::parseTriviaAndUpdateUi, error -> {
            TextView helloText = findViewById(R.id.questionTextView);
            helloText.setText(R.string.something_went_wrong);
        }) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("X-Api-Key", "V+/Hzh3VTpU4ISv31WQqqg==QAhez7HTA1GUvQ1x");
                return headers;
            }
        };
        Volley.newRequestQueue(this).add(request);
    }

    private void parseTriviaAndUpdateUi(String response) {
        try {
            JSONArray triviaJSON = new JSONArray(response);
            String question = triviaJSON.getJSONObject(0).getString("question");
            question = question.endsWith("?") ? question : question + "?";
            answer = triviaJSON.getJSONObject(0).getString("answer");
            TextView helloText = findViewById(R.id.questionTextView);
            helloText.setText(question);
            TextView answerTextView = findViewById(R.id.answerTextView);
            answerTextView.setText("");

        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public void showAnswer(View view) {
        TextView answerTextView = findViewById(R.id.answerTextView);
        answerTextView.setText(answer);
    }

    public void saveScore(View view) {
        String fileName = "quiz";
        EditText player1Score = findViewById(R.id.counterEditText);
        EditText player2Score = findViewById(R.id.counterEditText2);
        String[] scores = {player1Score.getText().toString(), player2Score.getText().toString()};

        // Add player names to file name and fill content
        if (players != null) {
            for (int i = 0; i < players.size(); i++) {
                fileName += "_" + players.get(i).replace(" ", "_");
                fileContent += players.get(i) + ": " + scores[i] + "\n";
            }
        }

        // Add date and time to filename
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyddMM_HHmm");
        String formattedDate = sdf.format(calendar.getTime());
        fileName += String.format("_%s.txt", formattedDate);

        SaveManager.saveToFile(this, fileName, fileContent);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent resultData) {
        super.onActivityResult(requestCode, resultCode, resultData);
        if (resultCode == Activity.RESULT_OK && requestCode == SaveManager.REQUEST_CODE) {
            SaveManager.onActivityResult(this, requestCode, resultCode, resultData, fileContent);
        }
        fileContent = "";
    }

    public void changeCounterValue(View view) {
        EditText editText = null;
        int id = view.getId();

        if (id == R.id.incrementButton || id == R.id.decrementButton) {
            editText = findViewById(R.id.counterEditText);
        } else if (id == R.id.incrementButton2 || id == R.id.decrementButton2) {
            editText = findViewById(R.id.counterEditText2);
        } else {
            throw new RuntimeException("Button id not found");
        }


        int currentValue = Integer.parseInt(editText.getText().toString());
        if (id == R.id.incrementButton || id == R.id.incrementButton2) {
            currentValue += 1;
        } else if (id == R.id.decrementButton || id == R.id.decrementButton2) {
            currentValue -= 1;
        }

        if (currentValue >= 0) {
            editText.setText(String.valueOf(currentValue));
        }

    }

    @Override
    protected void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        EditText score1 = findViewById(R.id.counterEditText);
        EditText score2 = findViewById(R.id.counterEditText2);
        TextView questionTextView = findViewById(R.id.questionTextView);
        TextView answerTextView = findViewById(R.id.answerTextView);


        bundle.putStringArrayList("PLAYER_LIST", players);
        bundle.putString("SCORE_1", score1.getText().toString());
        bundle.putString("SCORE_2", score2.getText().toString());
        bundle.putString("QUESTION", questionTextView.getText().toString());
        bundle.putString("ANSWER", answerTextView.getText().toString());
    }

    @Override
    protected void onRestoreInstanceState(Bundle bundle) {
        super.onRestoreInstanceState(bundle);
        String score1 = bundle.getString("SCORE_1");
        String score2 = bundle.getString("SCORE_2");
        String question = bundle.getString("QUESTION");
        String answer = bundle.getString("ANSWER");

        EditText score1EditText = findViewById(R.id.counterEditText);
        EditText score2EditText = findViewById(R.id.counterEditText2);
        TextView questionTextView = findViewById(R.id.questionTextView);
        TextView answerTextView = findViewById(R.id.answerTextView);

        score1EditText.setText(score1);
        score2EditText.setText(score2);
        questionTextView.setText(question);
        answerTextView.setText(answer);
        players = bundle.getStringArrayList("PLAYER_LIST");

    }
}