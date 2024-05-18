<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\PaymentRecord;
use App\Models\ReserveAppointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashbaordController extends Controller
{
    public function dashboard(Request $request)
    {

        $totalPatient = Patient::count();
        $totalAppointment = Appointment::count();
        $totalPaymentRecord = PaymentRecord::count();

        $totalIncome = PaymentRecord::sum('total_payment');

        $activeAppointment = Appointment::with(['patient', 'user'])->where('status', '0')->orderBy('created_at', 'DESC')->get();
        $reserved = ReserveAppointment::whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->orderBy('created_at', 'DESC')->get();

        $therapists = User::where('role', 2)->count();

        $yourAppointments = Appointment::where('user_id', Auth::user()->id)->count();

        // filter

        $filterTotalPatient = Patient::when($request->dateRange, function ($query, $date) {
            $query->whereDate('created_at', '>=', Carbon::parse($date[0])->addDay()->format('Y-m-d'))
                ->whereDate('created_at', '<=', Carbon::parse($date[1])->addDay()->format('Y-m-d'));
        })->count();
        $filterTotalAppointment = Appointment::when($request->dateRange, function ($query, $date) {
            $query->whereDate('created_at', '>=', Carbon::parse($date[0])->addDay()->format('Y-m-d'))
                ->whereDate('created_at', '<=', Carbon::parse($date[1])->addDay()->format('Y-m-d'));
        })->count();
        $filterTotalPaymentRecord = PaymentRecord::when($request->dateRange, function ($query, $date) {
            $query->whereDate('created_at', '>=', Carbon::parse($date[0])->addDay()->format('Y-m-d'))
                ->whereDate('created_at', '<=', Carbon::parse($date[1])->addDay()->format('Y-m-d'));
        })->count();

        $filterTotalIncome = PaymentRecord::when($request->dateRange, function ($query, $date) {
            $query->whereDate('created_at', '>=', Carbon::parse($date[0])->addDay()->format('Y-m-d'))
                ->whereDate('created_at', '<=', Carbon::parse($date[1])->addDay()->format('Y-m-d'));
        })->sum('total_payment');



        return response()->json([
            'status' => 'success',
            'totalPatient' => $totalPatient,
            'totalAppointment' => $totalAppointment,
            'totalPaymentRecord' => $totalPaymentRecord,
            'totalIncome' => $totalIncome,
            'activeAppointment' => $activeAppointment,
            'reserved' => $reserved,

            'therapists' => $therapists,
            'yourAppointments' => $yourAppointments,

            'filterTotalPatient' => $filterTotalPatient,
            'filterTotalAppointment' => $filterTotalAppointment,
            'filterTotalPaymentRecord' => $filterTotalPaymentRecord,
            'filterTotalIncome' => $filterTotalIncome,

        ]);
    }
}
