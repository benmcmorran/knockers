package edu.wpi.knockers;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class KnockersFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "KckFirebaseMsgService";

    @Override
    public void onMessageReceived(RemoteMessage message) {
        Log.d(TAG, "FROM: " + message.getFrom());

        if (message.getData().size() > 0) {
            Log.d(TAG, "Message data: " + message.getData());
        }

        if (message.getNotification() != null) {
            Log.d(TAG, "Message body: " + message.getNotification().getBody());
            sendNotification(
                    message.getNotification().getBody(),
                    message.getNotification().getTitle()
            );
        }
    }

    private void sendNotification(String body, String title) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
        Uri notificationSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
        NotificationCompat.Builder notifyBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title != null ? title : "Knockt")
                .setContentText(body)
                .setAutoCancel(true)
                .setSound(notificationSound)
                .setContentIntent(pendingIntent);

        NotificationManager notifyManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        notifyManager.notify(0, notifyBuilder.build());
    }
}
