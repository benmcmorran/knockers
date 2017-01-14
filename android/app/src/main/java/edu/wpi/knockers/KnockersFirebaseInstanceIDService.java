package edu.wpi.knockers;

import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

public class KnockersFirebaseInstanceIDService extends FirebaseInstanceIdService {
    private static final String TAG = "KckFirebaseInsIDService";

    @Override
    public void onTokenRefresh() {
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d(TAG, "New Token: " + refreshedToken);
    }
}
