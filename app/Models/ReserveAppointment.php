<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReserveAppointment extends Model
{
    use HasFactory,HasUuids;

    protected $fillable = [
       'date',
       'from_time',
       'to_time',
       'created_by',
       'updated_by',
    ];
}
