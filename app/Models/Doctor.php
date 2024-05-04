<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'first_name',
        'last_name',
        'position',
        'created_by',
        'updated_by',
    ];
}
