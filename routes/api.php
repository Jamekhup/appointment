<?php

use App\Http\Controllers\api\AppointmentController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\DashbaordController;
use App\Http\Controllers\api\TherapistController;
use App\Http\Controllers\api\PatientController;
use App\Http\Controllers\api\PaymentRecordController;
use App\Http\Controllers\api\ReservationController;
use App\Http\Controllers\api\ServiceController;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\api\SettingController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login'])
    ->name('login');

Route::post('/forgot-password', [AuthController::class, 'forgot_password'])
    ->name('password.email');

Route::post('/reset-password', [AuthController::class, 'reset_password'])
    ->name('password.store');



Route::middleware(['auth:sanctum', 'verified'])->group(function () {

    Route::get('/dashboard', [DashbaordController::class, 'dashboard']);

    Route::get('/appointment', [AppointmentController::class, 'index']);
    Route::get('/appointment-list', [AppointmentController::class, 'appointmentList']);
    Route::post('/appointment/create', [AppointmentController::class, 'create']);
    Route::put('/appointment/update/{id}', [AppointmentController::class, 'update']);
    Route::get('/appointment/detail/{id}', [AppointmentController::class, 'detail']);
    Route::put('/appointment/finished/{id}', [AppointmentController::class, 'finished']);
    Route::put('/appointment/cancelled/{id}', [AppointmentController::class, 'cancelled']);
    Route::put('/appointment/dnd/{id}', [AppointmentController::class, 'dnd']);
    Route::delete('/appointment/delete/{id}', [AppointmentController::class, 'delete']);

    Route::get('/reserve-appointment', [ReservationController::class, 'index']);
    Route::post('/reserve-appointment/create', [ReservationController::class, 'create']);
    Route::delete('/reserve-appointment/delete/{id}', [ReservationController::class, 'delete']);

    Route::get('/therapist', [TherapistController::class, 'index']);
    Route::post('/therapist/create', [TherapistController::class, 'create']);
    Route::put('/therapist/update/{id}', [TherapistController::class, 'update']);
    Route::delete('/therapist/delete/{id}', [TherapistController::class, 'delete']);

    Route::get('/service', [ServiceController::class, 'index']);
    Route::post('/service/create', [ServiceController::class, 'create']);
    Route::put('/service/update/{id}', [ServiceController::class, 'update']);
    Route::delete('/service/delete/{id}', [ServiceController::class, 'delete']);

    Route::get('/patient', [PatientController::class, 'index']);
    Route::get('/patient/get-all', [PatientController::class, 'get_all']);
    Route::get('/patient/detail/{id}', [PatientController::class, 'detail']);
    Route::post('/patient/create', [PatientController::class, 'create']);
    Route::post('/patient/create/excel-upload', [PatientController::class, 'excel_upload']);
    Route::put('/patient/update/{id}', [PatientController::class, 'update']);
    Route::delete('/patient/delete/{id}', [PatientController::class, 'delete']);

    Route::get('/payment-record', [PaymentRecordController::class, 'index']);
    Route::get('/payment-record/detail/{id}', [PaymentRecordController::class, 'detail']);
    Route::post('/payment-record/create/existed', [PaymentRecordController::class, 'create_existed']);
    Route::get('/payment-record/edit/{id}', [PaymentRecordController::class, 'edit']);
    Route::put('/payment-record/update/{id}', [PaymentRecordController::class, 'update']);
    Route::delete('/payment-record/delete/{id}', [PaymentRecordController::class, 'delete']);

    Route::get('/setting', [SettingController::class, 'index']);
    Route::post('/setting/update-password', [SettingController::class, 'update_password']);
    Route::post('/setting/create-service-charges', [SettingController::class, 'create_service_charges']);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
