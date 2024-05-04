<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'first_name',
        'last_name',
        'dob',
        'street',
        'house_number',
        'city',
        'postal_code',
        'house_doctor',
        'recommended_doctor',
        'health_insurance_company',
        'payment_free',
        'treatment_in_6_months',
        'private_patient',
        'special_need',
        'patient_signature',
        'created_by',
        'updated_by',
    ];
}
