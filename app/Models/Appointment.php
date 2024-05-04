<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'service_id',
        'patient_id',
        'user_id',
        'doctor_name',
        'date',
        'time',
        'status',
        'comment',
        'start_date_time',
        'finish_date_time',
        'created_by',
        'updated_by',
    ];
}
