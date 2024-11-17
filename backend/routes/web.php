<?php

use App\Http\Controllers\CheckPerformanceController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Route::get('/auth/google-login', function () {
Route::get('/login', function () {
    return view();
});

Route::get('/auth/google-login', [GoogleAuthController::class, "redirectToGoogleLogin"]);
Route::get("/auth/google-callback", [GoogleAuthController::class, "googleCallback"]);

Route::get("/checkScore", [CheckPerformanceController::class, "index"]);

