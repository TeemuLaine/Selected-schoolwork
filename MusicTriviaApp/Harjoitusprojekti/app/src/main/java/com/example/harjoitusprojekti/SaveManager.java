package com.example.harjoitusprojekti;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class SaveManager {

    static final int REQUEST_CODE = 1;

    public static void saveToFile(Activity activity, String fileName, String content) {
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_TITLE, fileName);

        activity.startActivityForResult(intent, REQUEST_CODE);
    }

    public static void onActivityResult(Activity activity, int requestCode, int resultCode, Intent resultData, String content) {
        if (resultCode == Activity.RESULT_OK && requestCode == REQUEST_CODE && resultData != null) {
            Uri uri = resultData.getData();
            try {
                OutputStream outputStream = activity.getContentResolver().openOutputStream(uri);
                if (outputStream != null) {
                    outputStream.write(content.getBytes());
                    outputStream.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}