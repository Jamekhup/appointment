<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\EmployeeController;
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

    Route::get('/employee', [EmployeeController::class, 'index']);
    Route::post('/employee/create', [EmployeeController::class, 'create']);
    Route::put('/employee/update/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employee/delete/{id}', [EmployeeController::class, 'delete']);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth')
        ->name('logout');
});
