<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('dob');
            $table->string('street');
            $table->string('house_number');
            $table->string('city');
            $table->integer('postal_code');
            $table->string('house_doctor')->nullable();
            $table->string('recommended_doctor')->nullable();
            $table->string('health_insurance_company')->nullable();
            $table->tinyInteger('payment_free')->comment('0=no,1=yes');
            $table->tinyInteger('treatment_in_6_month')->nullable()->comment('0=no,1=yes');
            $table->tinyInteger('private_patient')->nullable()->comment('0=no,1=yes');
            $table->longText('special_need')->nullable();
            $table->longText('patient_signature')->nullable();
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
