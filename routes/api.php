<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\EmployeeController;
use App\Http\Controllers\api\PatientController;
use App\Http\Controllers\api\ServiceController;
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

    Route::get('/service', [ServiceController::class, 'index']);
    Route::post('/service/create', [ServiceController::class, 'create']);
    Route::put('/service/update/{id}', [ServiceController::class, 'update']);
    Route::delete('/service/delete/{id}', [ServiceController::class, 'delete']);

    Route::get('/patient', [PatientController::class, 'index']);
    Route::get('/patient/detail/{id}', [PatientController::class, 'detail']);
    Route::post('/patient/create', [PatientController::class, 'create']);
    Route::put('/patient/update/{id}', [PatientController::class, 'update']);
    Route::delete('/patient/delete/{id}', [PatientController::class, 'delete']);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
