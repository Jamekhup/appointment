<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentRecord extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'patient_id',
        'issue_date',
        'treatment',
        'doctor_name',
        'full_covered_by_insurance_company',
        'number',
        'cost',
        'additional_payment',
        'home_visit',
        'number2',
        'cost3',
        'additional_payment_4',
        'total_payment',
        'received_by',
        'received_date',
        'remark',
        'created_by',
        'updated_by',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
