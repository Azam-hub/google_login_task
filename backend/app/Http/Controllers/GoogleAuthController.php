<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    function redirectToGoogleLogin() {
        // return Socialite::driver('google')->redirect();
        return response()->json([
            "status" => true,
            'url' => Socialite::driver('google')
                         ->stateless()
                         ->redirect()
                         ->getTargetUrl(),
        ]);
    }


    function handleGoogleCallback(Request $req) {

        $googleId = $req->google_id;
        // if (!$googleId) {

        //     return response()->json(["agr nai h" => $googleId]);
        // } else {
            
        //     return response()->json(["agr hai" => $googleId]);
        // }
        if ($req->error == "access_denied") {
            return response()->json([
                'status' => false,
                'error' => 'User Access Denied'
            ]);
        }

        // $user = "";
        $googleUser = null;

        if (!$googleId) {
            try {
                
                $googleUser = Socialite::driver('google')->stateless()->user();
    
                $googleId = $googleUser->getId();
    
            } catch (ClientException $e) {
                return response()->json([
                    'status' => false,
                    'errors' => $e,
                    'error' => 'Invalid credentials provided.'
                ]);
            }
            
        }

        $user = User::where("google_id", $googleId)->first();

        if (!$user) {
            $user = new User();
            
            $user->name = $googleUser->getName();
            $user->email = $googleUser->getEmail();
            $user->profile_pic = $googleUser->getAvatar();
            $user->google_id = $googleId;
            
            $user->save();
        }

        $token = $user->createToken('google-token')->plainTextToken;



        // return response()->json(['ss', $user]);
        Auth::login($user);
        if (Auth::check()) {
            return response()->json([
                "status" => true,
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } else {
            return response()->json([
                "status" => false,
                "error" => "Can't login",
            ]);
        }

    }

    // Function to check user logged in or not
    function checkLogin() {
        // return Auth::check();
        if (Auth::check()) {
            return response()->json([
                "status" => true,
                "user" => Auth::user(),
            ]);
        } else {
            return response()->json([
                "status" => false,
            ]);
        }
        
    }



    function logout() {
        Auth::user()->tokens()->delete();

        return response()->json([
            "status" => true,
            "message" => "Logged out successfully",
        ]);
    }


}

