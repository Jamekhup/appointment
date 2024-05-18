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
        Schema::create('payment_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id');
            $table->foreign('patient_id')
                ->references('id')
                ->on('patients')
                ->onDelete('cascade');
            $table->foreignUuid('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->date('issue_date');
            $table->string('treatment')->nullable();
            $table->string('doctor_name')->nullable();
            $table->tinyInteger('full_covered_by_insurance_company')->comment('0=no,1=yes');
            $table->integer('number');
            $table->decimal('cost',8,2);
            $table->decimal('additional_payment',8,2)->nullable();
            $table->tinyInteger('home_visit')->comment('0=no,1=yes');
            $table->integer('number2')->nullable();
            $table->decimal('cost3',8,2)->nullable();
            $table->decimal('additional_payment_4',8,2)->nullable();
            $table->decimal('total_payment',8,2);
            $table->string('received_by');
            $table->date('received_date');
            $table->longText('remark')->nullable();
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
        Schema::dropIfExists('payment_records');
    }
};
