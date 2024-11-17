<?php

use App\Http\Controllers\CheckPerformanceController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     // return $request->user();
//     Route::get('/auth/google-login', [GoogleAuthController::class, "redirectToGoogleLogin"]);
//     Route::get("/auth/google-callback", [GoogleAuthController::class, "handleGoogleCallback"]);
// });

// Route::middleware('web')->group(function () {
// });
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogleLogin']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post("/checkLogin", [GoogleAuthController::class, "checkLogin"]);
    Route::post("/logout", [GoogleAuthController::class, "logout"]);
    
    Route::get("/checkScore", [CheckPerformanceController::class, "index"]);
});
