<?php

use App\Http\Controllers\api\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login'])
    ->name('login');

Route::post('/forgot-password', [AuthController::class, 'forgot_password'])
    ->name('password.email');

Route::post('/reset-password', [AuthController::class, 'reset_password'])
    ->name('password.store');



Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth')
        ->name('logout');
});
