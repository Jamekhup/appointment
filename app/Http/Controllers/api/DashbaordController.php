<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\PaymentRecord;
use App\Models\ReserveAppointment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashbaordController extends Controller
{
    public function dashboard(){

        $totalPatient = Patient::count();
        $totalAppointment = Appointment::count();
        $totalPaymentRecord = PaymentRecord::count();

        $totalIncome = PaymentRecord::sum('total_payment');

        $activeAppointment = Appointment::with('patient')->where('status','0')->orderBy('created_at', 'DESC')->get();
        $reserved = ReserveAppointment::whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
        ->orderBy('created_at','DESC')->get();

        return response()->json([
            'status' => 'success',
            'totalPatient' => $totalPatient,
            'totalAppointment' => $totalAppointment,
            'totalPaymentRecord' => $totalPaymentRecord,
            'totalIncome' => $totalIncome,
            'activeAppointment' => $activeAppointment,
            'reserved' => $reserved,
        ]);
    }
}
